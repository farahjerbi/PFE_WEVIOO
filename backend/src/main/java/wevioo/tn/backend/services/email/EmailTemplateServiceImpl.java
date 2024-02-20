package wevioo.tn.backend.services.email;

import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
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

    public void sendHtmlEmail(EmailTemplate emailTemplate,Map<String, Object> requestBody) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject("NEW_USER_ACCOUNT_VERIFICATION");
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo("farah.jeerbi@gmail.com");

            String template = emailTemplate.getTemplateBody().getContent();
            Map<String, String> placeholderValues = (Map<String, String>) requestBody.get("placeholderValues");
            String result = templateUtils.replacePlaceholders(template, placeholderValues);
            emailTemplate.getTemplateBody().setContent(result);
            // Set the HTML content directly
            Context context = new Context();
            context.setVariable("template", emailTemplate);
            String text = templateEngine.process(EMAIL_TEMPLATE, context);
            helper.setText(text, true); // true indicates HTML content

            emailSender.send(message);
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }




    }



}
