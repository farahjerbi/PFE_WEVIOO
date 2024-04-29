package wevioo.tn.ms_sms.config;


import lombok.AllArgsConstructor;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;
import wevioo.tn.ms_sms.dtos.request.SendWhatsAppMsg;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;
import wevioo.tn.ms_sms.services.WhatsAppService;

import java.util.Arrays;
import java.util.List;

@Component
@AllArgsConstructor
public class WhatsappJob extends QuartzJobBean {
    final private WhatsAppService whatsAppService;

    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {
        try {
            JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
            String name = jobDataMap.getString("name");
            String language = jobDataMap.getString("language");
            String placeholdersValues = jobDataMap.getString("placeholders");
            String numbers = jobDataMap.getString("numbers");
            List<String> numbersList = Arrays.asList(numbers.split(","));
            List<String> placeholdersList = Arrays.asList(placeholdersValues.split(","));

            WhatsAppTemplateResponse whatsAppTemplateResponse=new WhatsAppTemplateResponse();
            whatsAppTemplateResponse.setLanguage(language);
            whatsAppTemplateResponse.setName(name);

            SendWhatsAppMsg sms = new SendWhatsAppMsg();
            sms.setNumbers(numbersList);
            sms.setPlaceholders(placeholdersList);
            sms.setWhatsAppTemplateResponse(whatsAppTemplateResponse);
            whatsAppService.sendSmsWhatsApp(sms);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
