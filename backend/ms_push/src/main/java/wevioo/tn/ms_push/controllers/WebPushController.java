package wevioo.tn.ms_push.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_push.dtos.request.SchedulePushRequest;
import wevioo.tn.ms_push.dtos.request.SendPushNotif;
import wevioo.tn.ms_push.dtos.request.WebPushMessageAdd;
import wevioo.tn.ms_push.dtos.request.WebPushMessageUpdate;
import wevioo.tn.ms_push.dtos.response.SchedulePushResponse;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.SubscriptionRepository;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;
import wevioo.tn.ms_push.services.SubscriptionService;
import wevioo.tn.ms_push.services.WebPushMessageTemplate;
import wevioo.tn.ms_push.services.WebPushMessageUtil;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/apiPush/")
@AllArgsConstructor

public class WebPushController {
    private final Scheduler scheduler;

    private final SubscriptionService subscriptionService;
    private final SubscriptionRepository subscriptionRepository;
    private static final String PUBLIC_KEY = "BOdufZ-xvfmjBHSA8YEl0oVxLbf6wNPgQuHngrjJI1q8rZkMF2x-ZrJ7to0s_jTr8Q9HVDY0pcIfaMTEu1L8XfU";
    private static final String PRIVATE_KEY = "xOGXMLirxOEePoZREJvHvQIciurMQS0SSr16np0eNG0";
    private static final String SUBJECT = "test";
    private final ObjectMapper objectMapper;
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
        Security.addProvider(new BouncyCastleProvider());
        if(message.getPlaceholderValues()!=null){
            message.getWebPushMessageTemplate().setMessage(
                    webPushMessageUtil.replacePlaceholders(message.getWebPushMessageTemplate().getMessage(), message.getPlaceholderValues()));
        }
        List<WebPushSubscription> webPushMessages=subscriptionRepository.findAll();
        PushService pushService = new PushService(PUBLIC_KEY, PRIVATE_KEY, SUBJECT);
        for (WebPushSubscription subscription: webPushMessages) {

            Notification notification = new Notification(
                    subscription.getNotificationEndPoint(),
                    subscription.getPublicKey(),
                    subscription.getAuth(),
                    objectMapper.writeValueAsBytes(message));

            pushService.send(notification);
        }

        return "YeeeeeeeeY sent successfully";
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
        Security.addProvider(new BouncyCastleProvider());
        if(message.getPlaceholderValues()!=null){
            message.getWebPushMessageTemplate().setMessage(
                    webPushMessageUtil.replacePlaceholders(message.getWebPushMessageTemplate().getMessage(), message.getPlaceholderValues()));
        }
        PushService pushService = new PushService(PUBLIC_KEY, PRIVATE_KEY, SUBJECT);
        for (WebPushSubscription subscription: message.getWebPushSubscriptions()) {

            Notification notification = new Notification(
                    subscription.getPublicKey(),
                    subscription.getNotificationEndPoint(),
                    subscription.getAuth(),
                    objectMapper.writeValueAsBytes(message.getWebPushMessageTemplate()));

            pushService.send(notification);
        }

        return "yEEEEEEy sent :)";
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
                    jobDetail.getKey().getName(), jobDetail.getKey().getGroup(), "Whatsapp Scheduled Successfully!");
            return ResponseEntity.ok(scheduleEmailResponse);
        } catch (SchedulerException ex) {

            SchedulePushResponse scheduleEmailResponse = new SchedulePushResponse(false,
                    "Error scheduling Whatsapp SMS. Please try later!");
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


}
