package wevioo.tn.ms_email.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_email.FeignClients.UsersClient;
import wevioo.tn.ms_email.config.EmailJob;
import wevioo.tn.ms_email.dtos.request.ScheduleEmailRequest;
import wevioo.tn.ms_email.dtos.request.SendEmail;
import wevioo.tn.ms_email.dtos.request.UpdateTemplateRequest;
import wevioo.tn.ms_email.dtos.response.ScheduleEmailResponse;
import wevioo.tn.ms_email.dtos.response.ScheduledEmailInfo;
import wevioo.tn.ms_email.dtos.response.UserResponse;
import wevioo.tn.ms_email.entities.EmailTemplate;
import wevioo.tn.ms_email.entities.TemplateBody;
import wevioo.tn.ms_email.repositories.EmailTemplateRepository;
import wevioo.tn.ms_email.services.EmailTemplateService;
import wevioo.tn.ms_email.services.TemplateUtils;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.*;

@RestController
@RequestMapping("/apiEmail/")
@AllArgsConstructor
public class EmailController {

    private final EmailTemplateService emailTemplateService;
    private final EmailTemplateRepository emailTemplateRepository;
    private final EmailTemplateService emailService;
    private final TemplateUtils templateUtils;
    private final Scheduler scheduler;
    private final UsersClient usersClient;

    @PostMapping("addTemplate")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate emailTemplate, Object jsonObject) {
        EmailTemplate createdEmailTemplate = emailTemplateService.createEmailTemplate(emailTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }


    @PostMapping("assignTemplateBody/{emailTemplateId}")
    public ResponseEntity<String> assignTemplateBodyToEmailTemplate(@PathVariable Long emailTemplateId, @RequestBody TemplateBody templateBody) {

        EmailTemplate emailTemplate = emailTemplateRepository.getReferenceById(emailTemplateId);

        emailTemplateService.assignTemplateBodyToEmailTemplate(templateBody, emailTemplate);
        return ResponseEntity.ok("TemplateBody assigned to EmailTemplate successfully.");
    }


    @GetMapping("getById/{emailTemplateId}")
    public ResponseEntity<EmailTemplate> getEmailById(@PathVariable Long emailTemplateId) {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);
        return ResponseEntity.ok(emailTemplate);
    }

    @PostMapping(value = "sendEmail/{emailTemplateId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> sendEmailWithAttachment(
            @PathVariable Long emailTemplateId, @ModelAttribute SendEmail email) {
        try {
            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);
            if (emailTemplate == null) {
                return ResponseEntity.ok("Email template not found.");
            }
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> requestBody = mapper.readValue(email.getRequestBody(), new TypeReference<Map<String, String>>() {});
            System.out.println("Converted Request Body: " + requestBody.toString());
            boolean isSentSeparately = Boolean.parseBoolean(email.getIsSentSeparately());
            if (isSentSeparately) {
                // Send emails separately
                for (String recipient : email.getRecipients()) {
                    String[] singleRecipient = {recipient};
                    emailService.sendEmail(emailTemplate.getTemplateBody(), requestBody, email.getAttachment(),
                            singleRecipient, email.getCc(), email.getReplyTo(), email.getId(), email.getAddSignature());
                }
            } else {
                // Send email in bulk
                emailService.sendEmail(emailTemplate.getTemplateBody(), requestBody, email.getAttachment(),
                        email.getRecipients(), email.getCc(), email.getReplyTo(), email.getId(), email.getAddSignature());
            }

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
    public Set<String> getTemplatePlaceholders(@PathVariable Long id) {
        EmailTemplate emailTemplate = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EmailTemplate not found with id: " + id));

        String emailTemplateContent = emailTemplate.getTemplateBody().getContent();
        return templateUtils.extractPlaceholders(emailTemplateContent);
    }

    @PostMapping("/scheduleEmail")
    public ResponseEntity<ScheduleEmailResponse> scheduleEmail(@Valid @RequestBody ScheduleEmailRequest scheduleEmailRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(scheduleEmailRequest.getDateTime(), scheduleEmailRequest.getTimeZone());
            if (dateTime.isBefore(ZonedDateTime.now())) {
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


    public JobDetail buildJobDetail(ScheduleEmailRequest scheduleEmailRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String placeHoldersJson = objectMapper.writeValueAsString(scheduleEmailRequest.getPlaceHolders());
            jobDataMap.put("requestBody", placeHoldersJson);
            String recipientsString = String.join(",", scheduleEmailRequest.getRecipients());
            jobDataMap.put("recipients", recipientsString);
            String ccString = String.join(",", scheduleEmailRequest.getCc());
            jobDataMap.put("cc", ccString);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        jobDataMap.put("templateId", scheduleEmailRequest.getTemplateId());
        jobDataMap.put("userId", scheduleEmailRequest.getUserId());
        jobDataMap.put("replyTo", scheduleEmailRequest.getReplyTo());
        jobDataMap.put("addSignature", scheduleEmailRequest.getAddSignature());

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

    @DeleteMapping("deleteTemplate/{id}")
    public String deleteEmailTemplate(@PathVariable Long id) {
        return emailTemplateService.deleteEmailTemplate(id);
    }


    @GetMapping("getAll")
    public List<EmailTemplate> getAllEmailTemplates() {
        return emailTemplateRepository.findAll();
    }


    @PostMapping("updateTemplate/{id}")
    public String updateTemplate(@PathVariable Long id,@RequestBody UpdateTemplateRequest request) {
        return emailTemplateService.updateEmailTemplate(id,request.getEmailTemplate(), request.getJsonObject());
    }




    @PostMapping("add")
    public String add(@RequestParam String content) throws IOException {
        return templateUtils.saveEmailHtmlTemplate(content);
    }


    @PostMapping("addDesignTemplate/{id}")
    public String addDesignTemplate(@RequestBody Object jsonObject, @PathVariable Long id) throws IOException {
        return templateUtils.addDesignTemplate(jsonObject, id);
    }

    @GetMapping("getDesignTemplate/{id}")
    public Object getDesignTemplate(@PathVariable Long id) throws IOException {
        return templateUtils.readDesignFile(id);
    }


    @GetMapping("getScheduledEmails")
    public ResponseEntity<List<ScheduledEmailInfo>> listScheduledEmails() {
        List<ScheduledEmailInfo> scheduledEmails = new ArrayList<>();

        try {
            for (String groupName : scheduler.getJobGroupNames()) {
                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(groupName))) {
                    String jobName = jobKey.getName();

                    // Get job's triggers
                    List<? extends Trigger> triggers = scheduler.getTriggersOfJob(jobKey);

                    if (!triggers.isEmpty()) {
                        Date nextFireTime = triggers.get(0).getNextFireTime();

                        JobDetail jobDetail = scheduler.getJobDetail(jobKey);

                        JobDataMap jobDataMap = jobDetail.getJobDataMap();
                        Long templateId = jobDataMap.getLongValue("templateId");
                        Long userId = jobDataMap.getLongValue("userId");

                        //Get info
                        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(templateId);

                        UserResponse user = usersClient.getUserById(userId);
                        // Create ScheduledEmailInfo object
                        ScheduledEmailInfo emailInfo = new ScheduledEmailInfo();
                        emailInfo.setJobId(jobName);
                        emailInfo.setTemplateId(templateId);
                        emailInfo.setUserId(userId);
                        emailInfo.setNextTimeFired(nextFireTime);
                        emailInfo.setTemplateName(emailTemplate.getName());
                        emailInfo.setUsername(user.getFirstName() +"" +user.getLastName());


                        // Add ScheduledEmailInfo to the list
                        scheduledEmails.add(emailInfo);
                    }
                }
            }

            return ResponseEntity.ok(scheduledEmails);
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("getScheduledEmailsByUser/{userId}")
    public ResponseEntity<List<ScheduledEmailInfo>> listScheduledEmails(@PathVariable Long userId) {
        List<ScheduledEmailInfo> scheduledEmails = new ArrayList<>();

        try {
            for (String groupName : scheduler.getJobGroupNames()) {
                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals(groupName))) {
                    String jobName = jobKey.getName();

                    // Get job's triggers
                    List<? extends Trigger> triggers = scheduler.getTriggersOfJob(jobKey);

                    if (!triggers.isEmpty()) {
                        JobDetail jobDetail = scheduler.getJobDetail(jobKey);

                        JobDataMap jobDataMap = jobDetail.getJobDataMap();
                        Long templateId = jobDataMap.getLongValue("templateId");
                        Long userIdFromJob = jobDataMap.getLongValue("userId");
                        if (userId.equals(userIdFromJob)) {
                            Date nextFireTime = triggers.get(0).getNextFireTime();

                            //Get info
                            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(templateId);

                            UserResponse user = usersClient.getUserById(userId);

                            // Create ScheduledEmailInfo object
                            ScheduledEmailInfo emailInfo = new ScheduledEmailInfo();
                            emailInfo.setJobId(jobName);
                            emailInfo.setTemplateId(templateId);
                            emailInfo.setUserId(userId);
                            emailInfo.setReplyTo(jobDataMap.getString("replyTo"));
                            emailInfo.setAddSignature(jobDataMap.getString("addSignature"));
                            emailInfo.setRequestBody(jobDataMap.getString("requestBody"));
                            emailInfo.setRecipients(jobDataMap.getString("recipients").split(","));
                            emailInfo.setCc(jobDataMap.getString("cc").split(","));
                            emailInfo.setNextTimeFired(nextFireTime);
                            emailInfo.setTemplateName(emailTemplate.getName());
                            emailInfo.setUsername(user.getFirstName() + " " + user.getLastName());

                            // Add ScheduledEmailInfo to the list
                            scheduledEmails.add(emailInfo);
                        }
                    }
                }
            }

            return ResponseEntity.ok(scheduledEmails);
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @DeleteMapping("deleteScheduledEmail/{jobName}")
    public ResponseEntity<String> deleteScheduledEmail(@PathVariable String jobName) {
        try {
            if (scheduler.checkExists(JobKey.jobKey(jobName, "email-jobs"))) {
                scheduler.deleteJob(JobKey.jobKey(jobName, "email-jobs"));
                return ResponseEntity.ok("Job deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
            }
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting job.");
        }
    }

    @PutMapping("updateScheduledEmail/{jobName}")
    public ResponseEntity<String> updateScheduledEmail(@PathVariable String jobName, @RequestBody ScheduleEmailRequest updatedRequest) {
        try {
            if (scheduler.checkExists(JobKey.jobKey(jobName, "email-jobs"))) {
                // Delete the existing job
                scheduler.deleteJob(JobKey.jobKey(jobName, "email-jobs"));

                // Build a new job with updated parameters
                JobDetail updatedJobDetail = buildJobDetail(updatedRequest);
                Trigger updatedTrigger = buildJobTrigger(updatedJobDetail, ZonedDateTime.now());

                scheduler.scheduleJob(updatedJobDetail, updatedTrigger);

                return ResponseEntity.ok("Job updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
            }
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating job.");
        }
    }



}

