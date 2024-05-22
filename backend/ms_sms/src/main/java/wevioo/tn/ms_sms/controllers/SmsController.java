package wevioo.tn.ms_sms.controllers;


import lombok.AllArgsConstructor;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_sms.dtos.request.ScheduleSMSRequest;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.dtos.response.ScheduleSMSResponse;
import wevioo.tn.ms_sms.dtos.response.ScheduledSMSInfo;
import wevioo.tn.ms_sms.dtos.response.UserResponse;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.repositories.SmsRepository;
import wevioo.tn.ms_sms.services.SmsService;
import wevioo.tn.ms_sms.services.SmsUtils;

import java.time.ZonedDateTime;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/apiSms")
@AllArgsConstructor
public class SmsController {

    private final SmsService smsService;
    private final Scheduler scheduler;

    private final SmsRepository smsRepository;
    private final SmsUtils smsUtils;
    private final UsersClient usersClient;

    @PostMapping(value = "/addSmsTemplate")
    public ResponseEntity<SmsTemplate> createEmailTemplate(@RequestBody SmsTemplate smsTemplate) {
        SmsTemplate createdEmailTemplate = smsService.createSmsTemplate(smsTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }

    @DeleteMapping(value = "/deleteSmsTemplate/{id}")
    public ResponseEntity deleteTemplateSms(@PathVariable Long id) {
            smsService.deleteSmsTemplate(id);
        return ResponseEntity.ok("Template deleted successfully");
    }

    @PutMapping("/updateSmsTemplate/{id}")
    public ResponseEntity<SmsTemplate> updateSmsTemplate(@RequestBody UpdateSmsTemplate smsTemplate, @PathVariable Long id) {
        SmsTemplate updatedTemplate = smsService.updateSmsTemplate(smsTemplate, id);
        return ResponseEntity.ok(updatedTemplate);
    }


    @PostMapping(value = "/sendSMS")
    public String sendSMS(@RequestBody SendsSms sendsSms) {
        return smsService.sendSms(sendsSms);
    }

    @GetMapping(value = "/getAllTemplates")
    public ResponseEntity<List<SmsTemplate>> getAllTemplates(){return ResponseEntity.ok(smsRepository.findAll());}
    @GetMapping(value = "/getSMSTemplateById/{id}")
    public ResponseEntity<SmsTemplate> getSMSTemplateById(@PathVariable Long id) {
        Optional<SmsTemplate> optionalTemplate = smsRepository.findByIdWithPlaceholders(id);
        if (optionalTemplate.isPresent()) {
            return ResponseEntity.ok(optionalTemplate.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("toggleFavoriteSMS/{templateId}/{userId}")
    public String toggleFavoriteEmail(@PathVariable  Long templateId, @PathVariable Long userId){
        smsService.toggleFavoriteSMS(templateId,userId);
        return "Template add to favorite with success";
    }

    @GetMapping("likedByUser/{userId}")
    public List<SmsTemplate> getTemplatesLikedByUser(@PathVariable Long userId) {
        return smsRepository.findTemplatesByUserFavoriteSmsContains(userId);
    }

    @PostMapping("/scheduleSMS")
    public ResponseEntity<ScheduleSMSResponse> scheduleEmail(@RequestBody ScheduleSMSRequest scheduleSMSRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(scheduleSMSRequest.getDateTime(), scheduleSMSRequest.getTimeZone());
            if (dateTime.isBefore(ZonedDateTime.now())) {
                ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(false,
                        "dateTime must be after current time");
                return ResponseEntity.badRequest().body(scheduleEmailResponse);
            }

            JobDetail jobDetail = smsUtils.buildJobDetail(scheduleSMSRequest);
            Trigger trigger = smsUtils.buildJobTrigger(jobDetail, dateTime);
            scheduler.scheduleJob(jobDetail, trigger);

            ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(true,
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "SMS Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {

            ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(false,
                    "Error scheduling SMS. Please try later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(scheduleEmailResponse);
        }
    }


    @GetMapping("getScheduledSMSs")
    public ResponseEntity<List<ScheduledSMSInfo>> listScheduledEmails() {
        List<ScheduledSMSInfo> scheduledEmails = new ArrayList<>();

        try {

                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals("sms-jobs"))) {
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
                            SmsTemplate smsTemplate = smsRepository.findById(templateId)
                                    .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + templateId));
                            UserResponse user = usersClient.getUserById(userId);
                            // Create ScheduledEmailInfo object
                            ScheduledSMSInfo emailInfo = new ScheduledSMSInfo();
                            emailInfo.setJobId(jobName);
                            emailInfo.setTemplateId(templateId);
                            emailInfo.setUserId(userId);
                            emailInfo.setNextTimeFired(nextFireTime);
                            emailInfo.setTemplateName(smsTemplate.getName());
                            emailInfo.setUsername(user.getFirstName() + "" + user.getLastName());


                            // Add ScheduledEmailInfo to the list
                            scheduledEmails.add(emailInfo);

                    }
                }


            return ResponseEntity.ok(scheduledEmails);
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("getScheduledSMSsByUser/{userId}")
    public ResponseEntity<List<ScheduledSMSInfo>> listScheduledEmails(@PathVariable Long userId) {
        List<ScheduledSMSInfo> scheduledEmails = new ArrayList<>();

        try {

                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals("sms-jobs"))) {
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
                            SmsTemplate smsTemplate = smsRepository.findById(templateId)
                                    .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + templateId));

                            UserResponse user = usersClient.getUserById(userId);

                            // Create ScheduledEmailInfo object
                            ScheduledSMSInfo emailInfo = new ScheduledSMSInfo();
                            emailInfo.setJobId(jobName);
                            emailInfo.setTemplateId(templateId);
                            emailInfo.setUserId(userId);
                            emailInfo.setNumbers(jobDataMap.getString("numbers").split(","));
                            emailInfo.setNextTimeFired(nextFireTime);
                            emailInfo.setTemplateName(smsTemplate.getName());
                            emailInfo.setUsername(user.getFirstName() + " " + user.getLastName());

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



    @DeleteMapping("deleteScheduledSMS/{jobName}")
    public ResponseEntity<String> deleteScheduledSMS(@PathVariable String jobName) {
        try {
            if (scheduler.checkExists(JobKey.jobKey(jobName, "sms-jobs"))) {
                scheduler.deleteJob(JobKey.jobKey(jobName, "sms-jobs"));
                return ResponseEntity.ok("Job deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found.");
            }
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting job.");
        }
    }


}

