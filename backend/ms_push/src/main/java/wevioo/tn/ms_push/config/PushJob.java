package wevioo.tn.ms_push.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import wevioo.tn.ms_push.dtos.request.SendPushNotif;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;
import wevioo.tn.ms_push.services.WebPushMessageTemplate;

import java.util.Map;
import java.util.Set;

@Component
@AllArgsConstructor
public class PushJob extends QuartzJobBean {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final WebPushMessageTemplate webPushMessageTemplate;
    private final WebPushMessageTemplateRepository webPushMessageTemplateRepository;
    private final Scheduler scheduler;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        try {
            JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
            String name = jobDataMap.getString("name");
            String placeholdersValues = jobDataMap.getString("placeholders");
            Map<String, String> placeholdersList = null;
            if (placeholdersValues != null) {
                placeholdersList = objectMapper.readValue(placeholdersValues, new TypeReference<Map<String, String>>() {});
            }
            Long userId = jobDataMap.getLong("userId");
            Long templateId = jobDataMap.getLong("templateId");
            String subscriptionsJsonString = jobDataMap.getString("subscriptions");

            Set<WebPushSubscription> subscriptions = null;
            if (subscriptionsJsonString != null) {
                subscriptions = objectMapper.readValue(subscriptionsJsonString, new TypeReference<Set<WebPushSubscription>>() {});
            }
            Boolean isAdmin = jobDataMap.getBoolean("isAdmin");

            WebPushMessage webPushMessage = webPushMessageTemplateRepository.findById(templateId)
                    .orElseThrow(() -> new RuntimeException("WebPushMessage not found with id: " + templateId));

            SendPushNotif pushNotif = new SendPushNotif();
            pushNotif.setWebPushSubscriptions(subscriptions);
            pushNotif.setPlaceholderValues(placeholdersList);
            pushNotif.setWebPushMessageTemplate(webPushMessage);

            if (isAdmin != null && isAdmin) {
                webPushMessageTemplate.notifyAll(pushNotif);
            } else {
                webPushMessageTemplate.notify(pushNotif);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error executing PushJob", e);
        }
    }

    @DeleteMapping("deleteScheduledPush/{jobName}")
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
