package wevioo.tn.ms_email.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;
import wevioo.tn.ms_email.services.EmailTemplateService;

@Component
public class EmailJob extends QuartzJobBean {

    @Autowired
    private EmailTemplateService emailTemplateService;


    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) {

        JobDataMap jobDataMap = jobExecutionContext.getMergedJobDataMap();
        Long idTemplate = jobDataMap.getLongValue("templateId");
        Long userId = jobDataMap.getLongValue("userId");
        String requestBody = jobDataMap.getString("requestBody");
        String recipientEmail = jobDataMap.getString("recipients");
        String cc = jobDataMap.getString("cc");
        String replyTo=jobDataMap.getString("replyTo");
        String addSignature=jobDataMap.getString("addSignature");
        String[] recipientsArray = recipientEmail.split(",");
        String[] ccArray = cc.split(",");


        try {
            emailTemplateService.sendScheduledEmail(idTemplate,userId,requestBody,recipientsArray,ccArray,replyTo,addSignature);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


    }
}