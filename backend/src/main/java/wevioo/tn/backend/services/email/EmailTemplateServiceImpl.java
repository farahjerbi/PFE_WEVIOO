package wevioo.tn.backend.services.email;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.EmailTemplateRepository;



@Service
public class EmailTemplateServiceImpl implements EmailTemplateService {
    @Autowired
    private EmailTemplateRepository emailTemplateRepository;
    @Autowired
    private JavaMailSender emailSender;
    @Autowired
    private  TemplateEngine templateEngine;

    public static final String EMAIL_TEMPLATE = "HtmlTemplateStandards";
    public static final String UTF_8_ENCODING = "UTF-8";
    public static final String TEXT_HTML_ENCONDING = "text/html";

    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        return emailTemplateRepository.save(emailTemplate);
    }

    public void assignTemplateBodyToEmailTemplate(TemplateBody templateBody, EmailTemplate emailTemplate) {
        emailTemplate.setTemplateBody(templateBody);
        emailTemplateRepository.save(emailTemplate);
    }

    public void sendHtmlEmailWithEmbeddedFiles(EmailTemplate emailTemplate) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setSubject("NEW_USER_ACCOUNT_VERIFICATION");
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo("farah.jeerbi@gmail.com");

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
