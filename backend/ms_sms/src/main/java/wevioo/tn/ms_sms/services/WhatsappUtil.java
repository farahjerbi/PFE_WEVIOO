package wevioo.tn.ms_sms.services;


import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.config.WhatsappJob;
import wevioo.tn.ms_sms.dtos.request.ScheduleWhatsappRequest;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;
@Service
@AllArgsConstructor
public class WhatsappUtil {

    public JobDetail buildJobDetail(ScheduleWhatsappRequest scheduleWhatsappRequest) {
        JobDataMap jobDataMap = new JobDataMap();

            String placeholders = String.join(",", scheduleWhatsappRequest.getPlaceholders());
            String numbers = String.join(",", scheduleWhatsappRequest.getNumbers());
            jobDataMap.put("numbers", numbers);
            jobDataMap.put("placeholders", placeholders);
            jobDataMap.put("language", scheduleWhatsappRequest.getLanguage());
            jobDataMap.put("name", scheduleWhatsappRequest.getName());
            jobDataMap.put("templateId", scheduleWhatsappRequest.getTemplateId());
            jobDataMap.put("userId", scheduleWhatsappRequest.getUserId());
        return JobBuilder.newJob(WhatsappJob.class)
                .withIdentity(UUID.randomUUID().toString(), "whatsapp-jobs")
                .withDescription("Send Whatsapp Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    public Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "whatsapp-triggers")
                .withDescription("Send Whatsapp Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
}
