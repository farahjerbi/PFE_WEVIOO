package wevioo.tn.ms_sms.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.config.SMSJob;
import wevioo.tn.ms_sms.dtos.request.ScheduleSMSRequest;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@AllArgsConstructor
public class SmsUtils {
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

    public boolean isValidPhoneNumber(String phoneNumber) {
        String phoneRegex = "\\+?[0-9]+";
        return phoneNumber.matches(phoneRegex);
    }

    public JobDetail buildJobDetail(ScheduleSMSRequest scheduleSMSRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String placeHoldersJson = objectMapper.writeValueAsString(scheduleSMSRequest.getPlaceHolders());
            jobDataMap.put("placeholdersValues", placeHoldersJson);
            String recipientsString = String.join(",", scheduleSMSRequest.getNumbers());
            jobDataMap.put("numbers", recipientsString);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        jobDataMap.put("templateId", scheduleSMSRequest.getTemplateId());
        jobDataMap.put("userId", scheduleSMSRequest.getUserId());

        return JobBuilder.newJob(SMSJob.class)
                .withIdentity(UUID.randomUUID().toString(), "sms-jobs")
                .withDescription("Send SMS Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    public Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "sms-triggers")
                .withDescription("Send SMS Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }

}
