package wevioo.tn.backend.services.email;

import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;

import java.io.File;
import java.util.Map;

public interface EmailTemplateService {
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);
    void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate);
    void sendHtmlEmail(EmailTemplate emailTemplate, Map<String, Object> requestBody, MultipartFile attachment);
}
