package wevioo.tn.backend.services.email;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;

import java.util.List;
import java.util.Map;


public interface EmailTemplateService {
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);
    void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate);
    void sendEmail(TemplateBody emailTemplate,
                       Map<String, String> requestBody, MultipartFile attachment,String[] recipients ,String[] cc,String[] bb,String replyTo);
    /* void sendScheduledEmail(Long idTemplate, String requestBody,String recipients) throws JsonProcessingException;*/
    String deleteEmailTemplate(Long id);
     void sendHtmlEmail(String to, String subject, String htmlBody);
}
