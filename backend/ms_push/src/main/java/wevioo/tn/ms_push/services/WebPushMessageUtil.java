package wevioo.tn.ms_push.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_push.config.PushJob;
import wevioo.tn.ms_push.dtos.request.SchedulePushRequest;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class WebPushMessageUtil {

    private final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{\\{([^{}]*)\\}\\}");

    public Set<String> extractPlaceholders(String template) {
        System.out.println("Template before processing: " + template);
        Set<String> placeholders = new HashSet<>();
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(template);
        while (matcher.find()) {
            placeholders.add(matcher.group(1));
        }
        return placeholders;
    }

    public String replacePlaceholders(String template, Map<String, String> placeholderValues) {
        for (Map.Entry<String, String> entry : placeholderValues.entrySet()) {
            String placeholder = entry.getKey();
            String value = entry.getValue();
            template = template.replace("{{" + placeholder + "}}", value);
        }
        return template;
    }

    public JobDetail buildJobDetail(SchedulePushRequest schedulePushRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String placeHoldersJson = objectMapper.writeValueAsString(schedulePushRequest.getPlaceHolders());
            jobDataMap.put("placeholdersValues", placeHoldersJson);
            String subscriptionsJson = objectMapper.writeValueAsString(schedulePushRequest.getWebPushSubscriptions());
            jobDataMap.put("subscriptions", subscriptionsJson);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        jobDataMap.put("templateId", schedulePushRequest.getTemplateId());
        jobDataMap.put("userId", schedulePushRequest.getUserId());
        jobDataMap.put("name", schedulePushRequest.getName());
        jobDataMap.put("isAdmin", schedulePushRequest.isAdmin());


        return JobBuilder.newJob(PushJob.class)
                .withIdentity(UUID.randomUUID().toString(), "push-jobs")
                .withDescription("Send Push Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    public Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "push-triggers")
                .withDescription("Send Push Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }


}
