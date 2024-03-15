package wevioo.tn.backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import wevioo.tn.backend.config.EmailJob;
import wevioo.tn.backend.dtos.request.ScheduleEmailRequest;
import wevioo.tn.backend.dtos.request.SendEmail;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.dtos.response.ScheduleEmailResponse;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.Image;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.EmailTemplateRepository;
import wevioo.tn.backend.services.email.EmailTemplateService;
import wevioo.tn.backend.services.email.ImageService;
import wevioo.tn.backend.services.email.TemplateUtils;

import java.io.IOException;

import java.time.ZonedDateTime;
import java.util.*;


@RestController
@RequestMapping("/api/email/")
@AllArgsConstructor
public class EmailController {

    private final EmailTemplateService emailTemplateService;
    private final EmailTemplateRepository emailTemplateRepository;
    private final EmailTemplateService emailService;
    private final TemplateUtils templateUtils;
    private final Scheduler scheduler;
    private final ImageService imageService;


    @PostMapping("addTemplate")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate emailTemplate ,Object jsonObject ) {
        EmailTemplate createdEmailTemplate = emailTemplateService.createEmailTemplate(emailTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }
    @PostMapping("assignTemplateBody/{emailTemplateId}")
    public ResponseEntity<String> assignTemplateBodyToEmailTemplate(@PathVariable Long emailTemplateId, @RequestBody TemplateBody templateBody) {

        EmailTemplate emailTemplate = emailTemplateRepository.getReferenceById(emailTemplateId);


        emailTemplateService.assignTemplateBodyToEmailTemplate(templateBody, emailTemplate);
        return ResponseEntity.ok("TemplateBody assigned to EmailTemplate successfully.");
    }

    @PostMapping("/createAndAssignImage/{emailTemplateId}")
    public String createAndAssignImageToTemplate(
            @PathVariable Long emailTemplateId ,
            @RequestPart("Image") Image image,
            @RequestPart("file") MultipartFile file, @RequestPart("type") String type) {
        return imageService.createAndAssignImageToTemplate(emailTemplateId,image,file,type);
    }
    @GetMapping("getById/{emailTemplateId}")
    public ResponseEntity<EmailTemplate> getEmailById(@PathVariable Long emailTemplateId) {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);
        return ResponseEntity.ok(emailTemplate);
    }

  /*  @PostMapping("sendEmail/{emailTemplateId}")
    public ResponseEntity<?> sendEmailWithAttachment(@PathVariable Long emailTemplateId,
                                                     @RequestPart("requestBody") Map<String, String> requestBody ,
                                                     @RequestPart(value = "attachment", required = false) MultipartFile attachment,
                                                     @RequestPart("recipients") String recipients
                                       ) {
        try {
            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);

            if (emailTemplate == null) {
                return ResponseEntity.ok("Email template not found.");
            }
            emailService.sendEmail(emailTemplate.getTemplateBody(),requestBody,attachment,recipients);
            return ResponseEntity.ok().body("Email sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }*/

    @PostMapping(value ="sendEmail/{emailTemplateId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> sendEmailWithAttachment(@PathVariable Long emailTemplateId, @ModelAttribute SendEmail email )
    {
        try {
            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);

            if (emailTemplate == null) {
                return ResponseEntity.ok("Email template not found.");
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> requestBody = mapper.readValue(email.getRequestBody(), new TypeReference<Map<String, String>>() {});
            System.out.println("Converted Request Body: " + requestBody.toString());

            emailService.sendEmail(emailTemplate.getTemplateBody(),requestBody, email.getAttachment(),
                    email.getRecipients() ,email.getCc(),email.getBb(),email.getReplyTo());
            return ResponseEntity.ok().body("Email sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }

    @PostMapping("test")
    public String testReplacePlaceholders(@RequestBody Map<String, Object> requestBody) {
        String template = (String) requestBody.get("template");
        Map<String, String> placeholderValues = (Map<String, String>) requestBody.get("placeholderValues");
        return templateUtils.replacePlaceholders(template, placeholderValues);

    }

    @GetMapping("getTemplatePlaceholders/{id}")
    @Transactional
    public Set<String> getTemplatePlaceholders(@PathVariable Long id ) {
        EmailTemplate emailTemplate = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EmailTemplate not found with id: " + id));

        String emailTemplateContent = emailTemplate.getTemplateBody().getContent();
        return templateUtils.extractPlaceholders(emailTemplateContent);
    }

    /*@PostMapping("/scheduleEmail")
    public ResponseEntity<ScheduleEmailResponse> scheduleEmail(@Valid @RequestBody ScheduleEmailRequest scheduleEmailRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(scheduleEmailRequest.getDateTime(), scheduleEmailRequest.getTimeZone());
            if(dateTime.isBefore(ZonedDateTime.now())) {
                ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(false,
                        "dateTime must be after current time");
                return ResponseEntity.badRequest().body(scheduleEmailResponse);
            }

            JobDetail jobDetail = buildJobDetail(scheduleEmailRequest);
            Trigger trigger = buildJobTrigger(jobDetail, dateTime);
            scheduler.scheduleJob(jobDetail, trigger);

            ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(true,
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "Email Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {

            ScheduleEmailResponse scheduleEmailResponse = new ScheduleEmailResponse(false,
                    "Error scheduling email. Please try later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(scheduleEmailResponse);
        }
    }
*/

/*
    public JobDetail buildJobDetail(ScheduleEmailRequest scheduleEmailRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String placeHoldersJson = objectMapper.writeValueAsString(scheduleEmailRequest.getPlaceHolders());
            jobDataMap.put("requestBody", placeHoldersJson);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        jobDataMap.put("email", scheduleEmailRequest.getEmail());
        jobDataMap.put("templateId", scheduleEmailRequest.getTemplateId());


        return JobBuilder.newJob(EmailJob.class)
                .withIdentity(UUID.randomUUID().toString(), "email-jobs")
                .withDescription("Send Email Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    public Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "email-triggers")
                .withDescription("Send Email Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
*/
    @DeleteMapping("deleteTemplate/{id}")
    public String deleteEmailTemplate(@PathVariable Long id){
       return emailTemplateService.deleteEmailTemplate(id);
    }


    @GetMapping("getAll")
    public List<EmailTemplate> getAllEmailTemplates(){
        return emailTemplateRepository.findAll();
    }

    @PostMapping("sendHtml/{id}")
    public String sendHtmlEmail(@PathVariable Long id){
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(id);
        emailTemplateService.sendHtmlEmail("farah.jeerbi@gmail.com","Lol",emailTemplate.getTemplateBody().getContent());
        return "Will it work  all the time ? find out next on MBC action";
    }


    @PostMapping("add")
    public String add(@RequestParam String content) throws IOException {
       return templateUtils.saveEmailHtmlTemplate(content);
    }


    @PostMapping("addDesignTemplate/{id}")
    public String addDesignTemplate(@RequestBody Object jsonObject ,@PathVariable Long id) throws IOException {
        return templateUtils.addDesignTemplate(jsonObject,id);
    }

    @GetMapping("getDesignTemplate/{id}")
    public Object getDesignTemplate(@PathVariable Long id) throws IOException {
        return templateUtils.readDesignFile(id);
    }
}

