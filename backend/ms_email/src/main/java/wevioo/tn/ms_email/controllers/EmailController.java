package wevioo.tn.ms_email.controllers;

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
import wevioo.tn.ms_email.dtos.request.ScheduleEmailRequest;
import wevioo.tn.ms_email.dtos.request.SendEmail;
import wevioo.tn.ms_email.dtos.request.SendEmailSeparately;
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
    private static final String JOB_GROUP = "email-jobs";

    @PostMapping("addTemplate")
    public ResponseEntity<EmailTemplate> createEmailTemplate(@RequestBody EmailTemplate emailTemplate) {
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
            Map<String, String> requestBody = mapper.readValue(email.getRequestBody(), new TypeReference<>() {});
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

    @PostMapping(value = "SendEmailSeparately/{emailTemplateId}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> SendEmailSeparately(
            @PathVariable Long emailTemplateId, @ModelAttribute List<SendEmailSeparately> email) {
        try {
            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(emailTemplateId);
            if (emailTemplate == null) {
                return ResponseEntity.ok("Email template not found.");
            }
            ObjectMapper mapper = new ObjectMapper();
            for (SendEmailSeparately recipient : email) {
                Map<String, String> requestBody = mapper.readValue(recipient.getRequestBody(), new TypeReference<>() {});
                String[] singleRecipient = {recipient.getRecipient()};

                emailService.sendEmail(emailTemplate.getTemplateBody(), requestBody, recipient.getAttachment(),
                        singleRecipient, recipient.getCc(), recipient.getReplyTo(), recipient.getId(), recipient.getAddSignature());
            }
            return ResponseEntity.ok().body("Email sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
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

            JobDetail jobDetail = templateUtils.buildJobDetail(scheduleEmailRequest);
            Trigger trigger = templateUtils.buildJobTrigger(jobDetail, dateTime);
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
            if (scheduler.checkExists(JobKey.jobKey(jobName, JOB_GROUP))) {
                scheduler.deleteJob(JobKey.jobKey(jobName, JOB_GROUP));
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
            if (scheduler.checkExists(JobKey.jobKey(jobName, JOB_GROUP))) {
                // Delete the existing job
                scheduler.deleteJob(JobKey.jobKey(jobName, JOB_GROUP));

                // Build a new job with updated parameters
                JobDetail updatedJobDetail = templateUtils.buildJobDetail(updatedRequest);
                Trigger updatedTrigger = templateUtils.buildJobTrigger(updatedJobDetail, ZonedDateTime.now());

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


    @PutMapping("toggleFavoriteEmail/{templateId}/{userId}")
    public String toggleFavoriteEmail(@PathVariable  Long templateId, @PathVariable Long userId){
         emailTemplateService.toggleFavoriteEmail(templateId,userId);
        return "Template add to favorite with success";
    }

    @GetMapping("likedByUser/{userId}")
    public List<EmailTemplate> getTemplatesLikedByUser(@PathVariable Long userId) {
        return emailTemplateRepository.findTemplatesByUserFavoriteEmailsContains(userId);
    }



}


