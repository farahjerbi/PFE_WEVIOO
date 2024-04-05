package wevioo.tn.ms_email.services;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.ms_email.dtos.request.UpdateEmailTemplateRequest;
import wevioo.tn.ms_email.entities.EmailTemplate;
import wevioo.tn.ms_email.entities.TemplateBody;

import java.util.Map;

public interface EmailTemplateService {
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate);
    void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate);
    void sendEmail(TemplateBody emailTemplate,
                   Map<String, String> requestBody, MultipartFile attachment,
                   String[] recipients , String[] cc, String replyTo, Long id,
                   String addSignature );
    void sendScheduledEmail(Long idTemplate,Long idUser, String requestBody,
                            String[] recipients , String[] cc,String replyTo,
                            String addSignature)throws JsonProcessingException;
    String deleteEmailTemplate(Long id);
    String updateEmailTemplate(Long id, UpdateEmailTemplateRequest updatedTemplate, Object jsonObject) ;
}
