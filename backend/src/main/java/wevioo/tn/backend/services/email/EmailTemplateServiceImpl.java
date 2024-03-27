package wevioo.tn.backend.services.email;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import lombok.AllArgsConstructor;


import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.dtos.exceptions.EmailSendingException;
import wevioo.tn.backend.dtos.request.UpdateEmailTemplateRequest;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.EmailTemplateRepository;
import wevioo.tn.backend.repositories.UserRepository;


import java.io.File;
import java.nio.file.Paths;

import java.util.Map;

import static wevioo.tn.backend.services.email.TemplateUtils.DIRECTORYPATH;


@Service
@AllArgsConstructor
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    private final JavaMailSender emailSender;

    private  final TemplateUtils templateUtils;


    public static final String UTF_8_ENCODING = "UTF-8";
    private final UserRepository userRepository;



    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        return emailTemplateRepository.save(emailTemplate);
    }

    public void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate) {
        emailTemplate.setTemplateBody(templateBody);
        emailTemplateRepository.save(emailTemplate);
    }

    public void sendEmail(TemplateBody emailTemplate,
                          Map<String, String> requestBody,
                          MultipartFile attachment,
                          String[] recipients,
                          String[] cc,
                          String replyTo,
                          Long id,
                          String addSignature
                          ) {

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject(emailTemplate.getSubject());
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo(recipients);
            if (cc != null) {
                for (String ccRecipient : cc) {
                    helper.addCc(ccRecipient);
                }
            }
            helper.setReplyTo(replyTo);

            String templateContent = emailTemplate.getContent();
            String result = templateUtils.replacePlaceholders(templateContent, requestBody);
            emailTemplate.setContent(result);

            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalStateException("User not found"));

            String signature = user.getSignature();


            MimeMultipart mimeMultipart = new MimeMultipart("related");

            //Add HTML Body content
            templateUtils.addHtmlContentToEmail(mimeMultipart,emailTemplate);



            // Add signature to the email body
            if(addSignature.equals("true")){
            templateUtils.addImagesToEmailBody(signature,mimeMultipart);}

            //AddAttachment
            if (attachment != null && !attachment.isEmpty()) {
            templateUtils.addAttachment(attachment,mimeMultipart);
            }

            message.setContent(mimeMultipart);
            emailSender.send(message);
        } catch (Exception exception) {
            throw new EmailSendingException("Failed to send HTML email", exception);
        }
    }




    public void sendScheduledEmail(Long idTemplate,Long idUser, String requestBody,
                                   String[] recipients , String[] cc,String replyTo,
                                   String addSignature) throws JsonProcessingException {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(idTemplate);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> requestBodyMap = objectMapper.readValue(requestBody, Map.class);

        try {
            sendEmail(emailTemplate.getTemplateBody(),requestBodyMap,null,recipients,cc,replyTo,idUser,addSignature);
        } catch (Exception exception) {
            throw new EmailSendingException("Failed to send scheduled email", exception);
        }
    }


    public String deleteEmailTemplate(Long id){
        String filePath = Paths.get(DIRECTORYPATH, id.toString() + ".json").toString();
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
        emailTemplateRepository.deleteById(id);
        return "deleted Successfully";
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        MimeMessage message = emailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML content
            emailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public String updateEmailTemplate(Long id, UpdateEmailTemplateRequest updatedTemplate, Object jsonObject)  {
        try {

        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(id);
        emailTemplate.setName(updatedTemplate.getName());
        emailTemplate.setLanguage(updatedTemplate.getLanguage());
        emailTemplate.getTemplateBody().setContent(updatedTemplate.getContent());
        emailTemplate.getTemplateBody().setSubject(updatedTemplate.getSubject());

        if(updatedTemplate.getState().equals("COMPLEX")){

            templateUtils.updateDesignTemplate(jsonObject,id);
        }
        emailTemplateRepository.save(emailTemplate);
        } catch (Exception exception) {
            throw new EmailSendingException("Failed to update template", exception);
        }
        return "Template updated successfully";
    }





}
