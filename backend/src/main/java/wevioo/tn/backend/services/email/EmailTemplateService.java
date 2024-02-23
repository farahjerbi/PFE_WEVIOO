package wevioo.tn.backend.services.email;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;

import java.util.Map;


public interface EmailTemplateService {
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);
    void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate);
    void sendEmail(EmailTemplate emailTemplate,
                       Map<String, String> requestBody, MultipartFile attachment, String recipients);
     void sendScheduledEmail(Long idTemplate, String requestBody,String recipients) throws JsonProcessingException;
}
