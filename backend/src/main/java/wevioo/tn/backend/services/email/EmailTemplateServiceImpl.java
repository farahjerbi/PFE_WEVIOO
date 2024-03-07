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
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.EmailTemplateRepository;


import java.util.Map;



@Service
@AllArgsConstructor
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    private final JavaMailSender emailSender;

    private  final TemplateUtils templateUtils;


    public static final String UTF_8_ENCODING = "UTF-8";



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
                          String recipients) {

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject(emailTemplate.getSubject());
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo(recipients);
            helper.addCc("farah.jerbi@esprit.tn");
            helper.setReplyTo("farah.jeerbi@gmail.com");

            String templateContent = emailTemplate.getContent();
            String result = templateUtils.replacePlaceholders(templateContent, requestBody);
            emailTemplate.setContent(result);




            MimeMultipart mimeMultipart = new MimeMultipart("related");

            //Add HTML Body content
            templateUtils.addHtmlContentToEmail(mimeMultipart,emailTemplate);



            // Add images to the email body
            templateUtils.addImagesToEmailBody(emailTemplate.getSignature().getValue(),mimeMultipart);

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


    public void sendScheduledEmail(Long idTemplate, String requestBody, String recipients) throws JsonProcessingException {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(idTemplate);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, String> requestBodyMap = objectMapper.readValue(requestBody, Map.class);

        try {
            sendEmail(emailTemplate.getTemplateBody(), requestBodyMap, null, recipients);
        } catch (Exception exception) {
            throw new EmailSendingException("Failed to send scheduled email", exception);
        }
    }


    public String deleteEmailTemplate(Long id){
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
            // Handle exception appropriately
        }
    }





}
