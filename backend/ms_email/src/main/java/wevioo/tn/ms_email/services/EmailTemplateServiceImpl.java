package wevioo.tn.ms_email.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.BodyPart;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.ms_email.FeignClients.UsersClient;
import wevioo.tn.ms_email.dtos.exception.EmailSendingException;
import wevioo.tn.ms_email.dtos.request.UpdateEmailTemplateRequest;
import wevioo.tn.ms_email.dtos.response.UserResponse;
import wevioo.tn.ms_email.entities.EmailTemplate;
import wevioo.tn.ms_email.entities.State;
import wevioo.tn.ms_email.entities.TemplateBody;
import wevioo.tn.ms_email.repositories.EmailTemplateRepository;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import static wevioo.tn.ms_email.services.TemplateUtils.DIRECTORYPATH;

@Service
@AllArgsConstructor
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    private  final TemplateUtils templateUtils;


    public static final String UTF_8_ENCODING = "UTF-8";

    private final UsersClient usersClient;


    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        if(emailTemplate.getTemplateBody().getContent().contains("@email")
        ||emailTemplate.getTemplateBody().getContent().contains("@username")
                ||emailTemplate.getTemplateBody().getContent().contains("@firstname")
                ||emailTemplate.getTemplateBody().getContent().contains("@lastname")
        ){
            emailTemplate.getTemplateBody().setTags(true);
        }
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

            UserResponse user = usersClient.getUserById(id);
            JavaMailSender mailSender =templateUtils.personalJavaMailSender(user.getEmail(), user.getEmailSecret());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject(emailTemplate.getSubject());
            helper.setTo(recipients);

            if (cc != null) {
                for (String ccRecipient : cc) {
                    helper.addCc(ccRecipient);
                }
            }
            helper.setReplyTo(replyTo);

            String result = emailTemplate.getContent();
            if (emailTemplate.isTags()) {
                result = templateUtils.replaceTags(result, recipients[0]);
            }
            result = templateUtils.replacePlaceholders(result, requestBody);

            emailTemplate.setContent(result);



            MimeMultipart mimeMultipart = new MimeMultipart("related");

            //Add HTML Body content
            templateUtils.addHtmlContentToEmail(mimeMultipart,result, addSignature);


            // Add signature to the email body
            if(addSignature.equals("true")){
                String signatureUrl = "http://localhost:8099/uploads/" + user.getSignature();
                templateUtils.addImagesToEmailBody(signatureUrl,mimeMultipart);}

            //AddAttachment
            if (attachment != null && !attachment.isEmpty()) {
                templateUtils.addAttachment(attachment,mimeMultipart);
            }

            message.setContent(mimeMultipart);
            mailSender.send(message);
        } catch (MessagingException | IOException | MailException exception) {
            System.out.println("Converted Request Body: " + exception);

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



    public String updateEmailTemplate(Long id, UpdateEmailTemplateRequest updatedTemplate, Object jsonObject)  {
        try {

            EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(id);
            emailTemplate.setName(updatedTemplate.getName());
            emailTemplate.setState(updatedTemplate.getState());
            emailTemplate.setLanguage(updatedTemplate.getLanguage());
            emailTemplate.getTemplateBody().setContent(updatedTemplate.getContent());
            emailTemplate.getTemplateBody().setSubject(updatedTemplate.getSubject());

            if(updatedTemplate.getState().equals(State.COMPLEX)){

                templateUtils.updateDesignTemplate(jsonObject,id);
            }
            emailTemplateRepository.save(emailTemplate);
        } catch (Exception exception) {
            throw new EmailSendingException("Failed to update template", exception);
        }
        return "Template updated successfully";
    }



    public void toggleFavoriteEmail(Long emailTemplateId, Long userId) {
        EmailTemplate emailTemplate = emailTemplateRepository.findById(emailTemplateId)
                .orElseThrow(() -> new EntityNotFoundException("Email template not found with id: " + emailTemplateId));

        List<Long> userFavoriteEmails = emailTemplate.getUserFavoriteEmails();
        if (userFavoriteEmails.contains(userId)) {
            userFavoriteEmails.removeIf(id -> id.equals(userId));
        } else {
            userFavoriteEmails.add(userId);
        }

         emailTemplateRepository.save(emailTemplate);
    }

}