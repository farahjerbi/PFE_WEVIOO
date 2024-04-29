package wevioo.tn.ms_sms.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.services.SmsService;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
public class SMSJob extends QuartzJobBean {
    @Autowired
    private SmsService smsService;


    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        try {
            JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
            Long idTemplate = jobDataMap.getLongValue("templateId");
            String placeholdersValues = jobDataMap.getString("placeholdersValues");
            String numbers = jobDataMap.getString("numbers");
            List<String> numbersList = Arrays.asList(numbers.split(","));

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> requestBodyMap = objectMapper.readValue(placeholdersValues, Map.class);

            SendsSms sms = new SendsSms();
            sms.setNumbers(numbersList);
            sms.setIdTemplate(idTemplate);
            sms.setPlaceholderValues(requestBodyMap);

            smsService.sendSms(sms);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

}
