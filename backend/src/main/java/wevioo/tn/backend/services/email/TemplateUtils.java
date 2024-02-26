package wevioo.tn.backend.services.email;


import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import wevioo.tn.backend.entities.TemplateBody;

import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@AllArgsConstructor
public class TemplateUtils {
    private final TemplateEngine templateEngine;

    private  final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{\\{([^{}]*)\\}\\}");
    public static final String EMAIL_TEMPLATE = "HtmlTemplateStandards";
    public static final String TEXT_HTML_ENCODING = "text/html";

    // Method to extract dynamic placeholders from the template
    public  Set<String> extractPlaceholders(String template) {
        Set<String> placeholders = new HashSet<>();
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(template);
        while (matcher.find()) {
            placeholders.add(matcher.group(1));
        }
        return placeholders;
    }
    // Method to replace placeholders with actual values
    public  String replacePlaceholders(String template, Map<String, String> placeholderValues) {
        for (Map.Entry<String, String> entry : placeholderValues.entrySet()) {
            String placeholder = entry.getKey();
            String value = entry.getValue();
            template = template.replace("{{" + placeholder + "}}", value);
        }
        return template;
    }

    public void addHtmlContentToEmail(MimeMultipart mimeMultipart , TemplateBody emailTemplate) throws MessagingException {
        Context context = new Context();
        context.setVariable("template", emailTemplate);
        String text = templateEngine.process(EMAIL_TEMPLATE, context);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(text, TEXT_HTML_ENCODING);
        mimeMultipart.addBodyPart(messageBodyPart);
    }


    public void addImagesToEmailBody(String signatureValue, MimeMultipart mimeMultipart) throws MessagingException {
        if (signatureValue != null && !signatureValue.isEmpty()) {
            BodyPart imageBodyPart = new MimeBodyPart();
            String filePath = "uploads/files/" + signatureValue;
            DataSource dataSource = new FileDataSource(filePath);
            imageBodyPart.setDataHandler(new DataHandler(dataSource));
            imageBodyPart.setHeader("Content-ID", "image");
            mimeMultipart.addBodyPart(imageBodyPart);
        }
    }

    public void addAttachment(MultipartFile attachment, MimeMultipart mimeMultipart) throws MessagingException, IOException {
            String attachmentFileName = attachment.getOriginalFilename();
            byte[] attachmentBytes = attachment.getBytes();
            String attachmentContentType = attachment.getContentType();
            BodyPart attachmentBodyPart = new MimeBodyPart();
            attachmentBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(attachmentBytes, attachmentContentType)));
            attachmentBodyPart.setFileName(attachmentFileName);
            mimeMultipart.addBodyPart(attachmentBodyPart);

    }


}
