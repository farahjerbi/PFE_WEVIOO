package wevioo.tn.ms_sms.controllers;

import lombok.AllArgsConstructor;
import okhttp3.Response;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_sms.dtos.request.*;
import wevioo.tn.ms_sms.dtos.response.ScheduleSMSResponse;
import wevioo.tn.ms_sms.dtos.response.ScheduledSMSInfo;
import wevioo.tn.ms_sms.dtos.response.UserResponse;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.services.ExcelFileService;
import wevioo.tn.ms_sms.services.SmsUtils;
import wevioo.tn.ms_sms.services.WhatsAppService;
import wevioo.tn.ms_sms.services.WhatsappUtil;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/apiWhatsApp/")
@AllArgsConstructor
public class WhatsAppController {
    private final WhatsAppService whatsAppService;
    private final SmsUtils smsUtils;
    private final WhatsappUtil whatsappUtil;
    private final Scheduler scheduler;
    private final UsersClient usersClient;
    private final ExcelFileService excelFileService;



    @PostMapping("addWhatsAppTemplate")
    public ResponseEntity<String> createWhatsAppTemplate(@RequestBody WhatsAppTemplatePayload payload) {
        try {
            Response response = whatsAppService.createWhatsAppTemplate(payload);
            if (response.isSuccessful()) {
                return ResponseEntity.ok("WhatsApp template created successfully");
            } else {
                return ResponseEntity.status(response.code()).body(response.message());
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create WhatsApp template: " + e.getMessage());
        }
    }
    @GetMapping("getAll")
    public ResponseEntity<String> getWhatsAppTemplates() {
        try {
            Response response = whatsAppService.getWhatsAppTemplates();
            String responseBody = response.body().string();
            return ResponseEntity.ok(responseBody);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch WhatsApp templates.");
        }
    }

    @DeleteMapping("delete/{templateName}")
    public ResponseEntity<String> deleteWhatsAppTemplate(
            @PathVariable String templateName
    ) {
        try {
            whatsAppService.deleteWhatsAppTemplate(templateName);
            return ResponseEntity.ok("WhatsApp template deleted successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete WhatsApp template");
        }
    }

    @PostMapping(value = "/sendWhatsAppSms")
    public String sendSMSWhatsApp(@RequestBody SendWhatsAppMsg sendsSms) {
        return whatsAppService.sendSmsWhatsApp(sendsSms);
    }
    @PostMapping(value = "/sendSMSWhatsAppSeparately")
    public ResponseEntity<String> sendSMSWhatsAppSeparately(@RequestBody WhatsappExcelProcessor test) {
        SendIndivWhatsapp send = excelFileService.generateSendSeparatelyListWhatsapp(test.getPlaceholderData(), test.getWhatsAppTemplateResponse());
        return  ResponseEntity.ok(whatsAppService.sendSmsWhatsAppSeparately(send));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WhatsAppTemplateResponse> getWhatsAppTemplateById(@PathVariable Long id) {
        try {
            WhatsAppTemplateResponse response = whatsAppService.getWhatsAppTemplateById(id);
            response.setPlaceholders(smsUtils.extractPlaceholders(response.getStructure().getBody().getText()));
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/scheduleWhatsapp")
    public ResponseEntity<ScheduleSMSResponse> scheduleEmail(@RequestBody ScheduleWhatsappRequest scheduleWhatsappRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(scheduleWhatsappRequest.getDateTime(), scheduleWhatsappRequest.getTimeZone());
            if (dateTime.isBefore(ZonedDateTime.now())) {
                ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(false,
                        "dateTime must be after current time");
                return ResponseEntity.badRequest().body(scheduleEmailResponse);
            }

            JobDetail jobDetail = whatsappUtil.buildJobDetail(scheduleWhatsappRequest);
            Trigger trigger = whatsappUtil.buildJobTrigger(jobDetail, dateTime);
            scheduler.scheduleJob(jobDetail, trigger);

            ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(true,
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "Whatsapp Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {

            ScheduleSMSResponse scheduleEmailResponse = new ScheduleSMSResponse(false,
                    "Error scheduling Whatsapp SMS. Please try later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(scheduleEmailResponse);
        }
    }

    @GetMapping("getScheduledWhatsapp")
    public ResponseEntity<List<ScheduledSMSInfo>> listScheduledEmails() {
        List<ScheduledSMSInfo> scheduledEmails = new ArrayList<>();

        try {
                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals("whatsapp-jobs"))) {
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
                        WhatsAppTemplateResponse response = whatsAppService.getWhatsAppTemplateById(templateId);
                        UserResponse user = usersClient.getUserById(userId);
                        // Create ScheduledEmailInfo object
                        ScheduledSMSInfo emailInfo = new ScheduledSMSInfo();
                        emailInfo.setJobId(jobName);
                        emailInfo.setTemplateId(templateId);
                        emailInfo.setUserId(userId);
                        emailInfo.setNextTimeFired(nextFireTime);
                        emailInfo.setTemplateName(response.getName());
                        emailInfo.setUsername(user.getFirstName() +"" +user.getLastName());


                        // Add ScheduledEmailInfo to the list
                        scheduledEmails.add(emailInfo);
                    }
                    }

            return ResponseEntity.ok(scheduledEmails);
        } catch (SchedulerException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("getScheduledWhatsappByUser/{userId}")
    public ResponseEntity<List<ScheduledSMSInfo>> listScheduledEmails(@PathVariable Long userId) {
        List<ScheduledSMSInfo> scheduledEmails = new ArrayList<>();

        try {
                for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals("whatsapp-jobs"))) {
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
                            WhatsAppTemplateResponse response = whatsAppService.getWhatsAppTemplateById(templateId);

                            UserResponse user = usersClient.getUserById(userId);

                            // Create ScheduledEmailInfo object
                            ScheduledSMSInfo emailInfo = new ScheduledSMSInfo();
                            emailInfo.setJobId(jobName);
                            emailInfo.setTemplateId(templateId);
                            emailInfo.setUserId(userId);
                            emailInfo.setNumbers(jobDataMap.getString("numbers").split(","));
                            emailInfo.setNextTimeFired(nextFireTime);
                            emailInfo.setTemplateName(response.getName());
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
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }



    @DeleteMapping("deleteScheduledWhatsapp/{jobName}")
    public ResponseEntity<String> deleteScheduledSMS(@PathVariable String jobName) {
        try {
            if (scheduler.checkExists(JobKey.jobKey(jobName, "whatsapp-jobs"))) {
                scheduler.deleteJob(JobKey.jobKey(jobName, "whatsapp-jobs"));
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
