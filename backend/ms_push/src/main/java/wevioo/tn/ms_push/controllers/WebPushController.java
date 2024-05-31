package wevioo.tn.ms_push.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;

import org.jose4j.lang.JoseException;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_push.dtos.request.SchedulePushRequest;
import wevioo.tn.ms_push.dtos.request.SendPushNotif;
import wevioo.tn.ms_push.dtos.request.WebPushMessageAdd;
import wevioo.tn.ms_push.dtos.request.WebPushMessageUpdate;
import wevioo.tn.ms_push.dtos.response.SchedulePushResponse;
import wevioo.tn.ms_push.dtos.response.ScheduledPushInfo;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;
import wevioo.tn.ms_push.services.SubscriptionService;
import wevioo.tn.ms_push.services.WebPushMessageTemplate;
import wevioo.tn.ms_push.services.WebPushMessageUtil;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/apiPush/")
@AllArgsConstructor

public class WebPushController {
    private final Scheduler scheduler;

    private final SubscriptionService subscriptionService;
    private final WebPushMessageTemplate webPushMessageTemplate;
    private final WebPushMessageTemplateRepository webPushMessageTemplateRepository;
    private final WebPushMessageUtil webPushMessageUtil;

    @PostMapping("/subscribe")
    public void subscribe(@RequestBody WebPushSubscription subscription) {
        subscriptionService.saveSubscription(subscription);
    }

    @PostMapping("/unsubscribe")
    public void unsubscribe(@RequestBody WebPushSubscription subscription) {
        WebPushSubscription existingSubscription = subscriptionService.findByNotificationEndPoint(subscription.getNotificationEndPoint());
        if (existingSubscription != null) {
            subscriptionService.deleteSubscription(existingSubscription.getId());
        }
    }
    @PostMapping("/notify-all")
    public String notifyAll(@RequestBody SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException {
       return webPushMessageTemplate.notifyAll(message);
    }

    @PostMapping("/addTemplate")
    public WebPushMessage addTemplate(@ModelAttribute WebPushMessageAdd webPushMessageAdd) {
       return webPushMessageTemplate.createPushTemplate(webPushMessageAdd);
    }

    @PostMapping("/updateTemplate/{id}")
    public WebPushMessage updateTemplate(@ModelAttribute WebPushMessageUpdate webPushMessageAdd,@PathVariable Long id) {
        return webPushMessageTemplate.updatePushTemplate(webPushMessageAdd,id);
    }

    @DeleteMapping("/deleteTemplate/{id}")
    public String deleteTemplate(@PathVariable Long id ) {
         webPushMessageTemplate.deletePushTemplate(id);
         return "deleted successfully";
    }

    @GetMapping("/getAll")
    public List<WebPushMessage> getAll( ) {
        return webPushMessageTemplateRepository.findAll();
    }

    @GetMapping("/getById/{id}")
    public WebPushMessage getById( @PathVariable Long id) {
        return webPushMessageTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WebPushMessage not found with id: " + id));
    }

    @PostMapping("/notify")
    public String notify(@RequestBody SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException {
        return  webPushMessageTemplate.notify(message);
    }

    @PostMapping("/schedulePush")
    public ResponseEntity<SchedulePushResponse> scheduleEmail(@RequestBody SchedulePushRequest schedulePushRequest) {
        try {
            ZonedDateTime dateTime = ZonedDateTime.of(schedulePushRequest.getDateTime(), schedulePushRequest.getTimeZone());
            if (dateTime.isBefore(ZonedDateTime.now())) {
                SchedulePushResponse scheduleEmailResponse = new SchedulePushResponse(false,
                        "dateTime must be after current time");
                return ResponseEntity.badRequest().body(scheduleEmailResponse);
            }

            JobDetail jobDetail = webPushMessageUtil.buildJobDetail(schedulePushRequest);
            Trigger trigger = webPushMessageUtil.buildJobTrigger(jobDetail, dateTime);
            scheduler.scheduleJob(jobDetail, trigger);

            SchedulePushResponse scheduleEmailResponse = new SchedulePushResponse(true,
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "Push Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {
            System.out.println("Error scheduling Push notification: " + ex.getMessage());

            SchedulePushResponse scheduleEmailResponse = new SchedulePushResponse(false,
                    "Error scheduling Push . Please try later!");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(scheduleEmailResponse);
        }
    }

    @GetMapping("likedByUser/{userId}")
    public List<WebPushMessage> getTemplatesLikedByUser(@PathVariable Long userId) {
        return webPushMessageTemplateRepository.findTemplatesByUserFavoritePushContains(userId);
    }

    @PutMapping("toggleFavoritePush/{templateId}/{userId}")
    public String toggleFavoritePush(@PathVariable  Long templateId, @PathVariable Long userId){
        webPushMessageTemplate.toggleFavoritePush(templateId,userId);
        return "Template add to favorite with success";
    }

    @GetMapping("getScheduledPushesByUser/{userId}")
    public ResponseEntity<List<ScheduledPushInfo>> listScheduledPushes(@PathVariable Long userId) {
        List<ScheduledPushInfo> scheduledPushes = new ArrayList<>();

        try {
            for (JobKey jobKey : scheduler.getJobKeys(GroupMatcher.jobGroupEquals("push-jobs"))) {
                String jobName = jobKey.getName();

                // Get job's triggers
                List<? extends Trigger> triggers = scheduler.getTriggersOfJob(jobKey);

                if (!triggers.isEmpty()) {
                    JobDetail jobDetail = scheduler.getJobDetail(jobKey);

                    JobDataMap jobDataMap = jobDetail.getJobDataMap();
                    Long templateId = jobDataMap.getLongValue("templateId");
                    Long userIdFromJob = jobDataMap.getLongValue("userId");
                    String templateName = jobDataMap.getString("name");

                    if (userId.equals(userIdFromJob)) {
                        Date nextFireTime = triggers.get(0).getNextFireTime();

                        // Deserialize subscriptions
                        ObjectMapper objectMapper = new ObjectMapper();
                        String subscriptionsJson = jobDataMap.getString("subscriptions");
                        List<WebPushSubscription> subscriptions = objectMapper.readValue(subscriptionsJson, objectMapper.getTypeFactory().constructCollectionType(List.class, WebPushSubscription.class));

                        // Create ScheduledPushInfo object
                        ScheduledPushInfo pushInfo = new ScheduledPushInfo();
                        pushInfo.setJobId(jobName);
                        pushInfo.setTemplateId(templateId);
                        pushInfo.setUserId(userId);
                        pushInfo.setTemplateName(templateName);
                        pushInfo.setSubscriptions(subscriptions);
                        pushInfo.setNextTimeFired(nextFireTime);

                        // Add ScheduledPushInfo to the list
                        scheduledPushes.add(pushInfo);
                    }
                }
            }

            return ResponseEntity.ok(scheduledPushes);
        } catch (SchedulerException | JsonProcessingException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @DeleteMapping("deleteScheduledWhatsapp/{jobName}")
    public ResponseEntity<String> deleteScheduledSMS(@PathVariable String jobName) {
        try {
            if (scheduler.checkExists(JobKey.jobKey(jobName, "push-jobs"))) {
                scheduler.deleteJob(JobKey.jobKey(jobName, "push-jobs"));
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
