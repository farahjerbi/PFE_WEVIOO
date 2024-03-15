/*package wevioo.tn.backend.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

import wevioo.tn.backend.services.email.EmailTemplateService;


@Component
public class EmailJob extends QuartzJobBean {

    @Autowired
    private EmailTemplateService emailTemplateService;


   @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {

        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long idTemplate = jobDataMap.getLongValue("templateId");
        String requestBody = jobDataMap.getString("requestBody");
        String recipientEmail = jobDataMap.getString("email");

        try {
            emailTemplateService.sendScheduledEmail(idTemplate,requestBody,recipientEmail);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


    }
}*/
