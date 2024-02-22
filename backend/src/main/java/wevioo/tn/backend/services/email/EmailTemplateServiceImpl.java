package wevioo.tn.backend.services.email;

import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.AllArgsConstructor;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.EmailTemplateRepository;

import java.util.Map;



@Service
@AllArgsConstructor
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;

    private final   TemplateUtils templateUtils;
    public static final String EMAIL_TEMPLATE = "HtmlTemplateStandards";
    public static final String UTF_8_ENCODING = "UTF-8";
    public static final String TEXT_HTML_ENCODING = "text/html";

    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        return emailTemplateRepository.save(emailTemplate);
    }

    public void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate) {
        emailTemplate.setTemplateBody(templateBody);
        emailTemplateRepository.save(emailTemplate);
    }

    public void sendHtmlEmail(EmailTemplate emailTemplate, Map<String, Object> requestBody, MultipartFile attachment) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject("TEST_EMAIL");
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo("farah.jeerbi@gmail.com");

            String template = emailTemplate.getTemplateBody().getContent();
            Map<String, String> placeholderValues = (Map<String, String>) requestBody.get("placeholderValues");
            String result = templateUtils.replacePlaceholders(template, placeholderValues);
            emailTemplate.getTemplateBody().setContent(result);


            Context context = new Context();
            context.setVariable("template", emailTemplate);
            String text = templateEngine.process(EMAIL_TEMPLATE, context);

            MimeMultipart mimeMultipart = new MimeMultipart("related");
            BodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setContent(text, TEXT_HTML_ENCODING);
            mimeMultipart.addBodyPart(messageBodyPart);

            // Add images to the email body
            BodyPart imageBodyPart = new MimeBodyPart();
            DataSource dataSource = new FileDataSource( "uploads/files/wevioo.png");
            imageBodyPart.setDataHandler(new DataHandler(dataSource));
            imageBodyPart.setHeader("Content-ID", "image");
            mimeMultipart.addBodyPart(imageBodyPart);

            //Add Attachment
            String attachmentFileName = attachment.getOriginalFilename();
            byte[] attachmentBytes = attachment.getBytes();
            String attachmentContentType = attachment.getContentType();
            BodyPart attachmentBodyPart = new MimeBodyPart();
            attachmentBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(attachmentBytes, attachmentContentType)));
            attachmentBodyPart.setFileName(attachmentFileName);
            mimeMultipart.addBodyPart(attachmentBodyPart);

            message.setContent(mimeMultipart);
            emailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }




    }



}
