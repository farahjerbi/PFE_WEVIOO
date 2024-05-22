package wevioo.tn.ms_email.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;

import java.net.MalformedURLException;
import java.net.URL;

import jakarta.activation.URLDataSource;
import jakarta.mail.BodyPart;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.AllArgsConstructor;
import org.quartz.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import wevioo.tn.ms_email.config.EmailJob;
import wevioo.tn.ms_email.dtos.request.ScheduleEmailRequest;
import wevioo.tn.ms_email.entities.TemplateBody;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class TemplateUtils {
    private final TemplateEngine templateEngine;

    private final Pattern PLACEHOLDER_PATTERN = Pattern.compile("\\{\\{([^{}]*)\\}\\}");
    public static final String EMAIL_TEMPLATE = "HtmlTemplateStandards";
    public static final String TEXT_HTML_ENCODING = "text/html";
    public static final String DIRECTORY = "templates";
    public static final String DIRECTORYPATH = Paths.get("src", "main", "resources", DIRECTORY).toString();

    // Method to extract dynamic placeholders from the template
    public Set<String> extractPlaceholders(String template) {
        Set<String> placeholders = new HashSet<>();
        Matcher matcher = PLACEHOLDER_PATTERN.matcher(template);
        while (matcher.find()) {
            placeholders.add(matcher.group(1));
        }
        return placeholders;
    }

    // Method to replace placeholders with actual values
    public String replacePlaceholders(String template, Map<String, String> placeholderValues) {
        for (Map.Entry<String, String> entry : placeholderValues.entrySet()) {
            String placeholder = entry.getKey();
            String value = entry.getValue();
            template = template.replace("{{" + placeholder + "}}", value);
        }
        return template;
    }

    public String extractUsername(String email) {
        int atIndex = email.indexOf('@');
        String username=atIndex != -1 ? email.substring(0, atIndex) : email;
        return username.replace(".", "");
    }
    private String extractFirstName(String email) {
        String username = extractUsername(email);
        int dotIndex = username.indexOf('.');
        return dotIndex != -1 ? username.substring(0, dotIndex) : username;
    }

    private String extractLastName(String email) {
        String username = extractUsername(email);
        int dotIndex = username.indexOf('.');
        return dotIndex != -1 ? username.substring(dotIndex + 1) : "";
    }

    public String replaceTags(String template, String email) {
        String username = extractUsername(email);
        String firstName = extractFirstName(email);
        String lastName = extractLastName(email);

        template = template.replace("@email", email);
        template = template.replace("@username", username);
        template = template.replace("@firstname", firstName);
        template = template.replace("@lastname", lastName);

        return template;
    }



    public void addHtmlContentToEmail(MimeMultipart mimeMultipart, String emailTemplate,String addSignature) throws MessagingException {
        Context context = new Context();
        context.setVariable("template", emailTemplate);
        context.setVariable("signature", addSignature);
        String text = templateEngine.process(EMAIL_TEMPLATE, context);
        BodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setContent(text, TEXT_HTML_ENCODING);
        mimeMultipart.addBodyPart(messageBodyPart);
    }


    public void addImagesToEmailBody(String signatureUrl, MimeMultipart mimeMultipart) throws MessagingException {
        if (signatureUrl != null && !signatureUrl.isEmpty()) {
            try {
                BodyPart imageBodyPart = new MimeBodyPart();
                URL url = new URL(signatureUrl);
                DataSource dataSource = new URLDataSource(url);
                imageBodyPart.setDataHandler(new DataHandler(dataSource));
                imageBodyPart.setHeader("Content-ID", "image");
                mimeMultipart.addBodyPart(imageBodyPart);
            } catch (MalformedURLException e) {
                // Handle MalformedURLException
                e.printStackTrace(); // or log the error
            }
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

    public String saveEmailHtmlTemplate(String content) throws IOException {
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        String fileName = "file_" + timestamp + ".txt";

        Files.createDirectories(Paths.get(DIRECTORYPATH));

        String filePath = Paths.get(DIRECTORYPATH, fileName).toString();

        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(content);
        }

        return fileName;
    }


    public String addDesignTemplate(Object jsonObject, Long id) throws IOException {
        String fileName = id + ".json";
        String filePath = Paths.get(DIRECTORYPATH, fileName).toString();

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = objectMapper.writeValueAsString(jsonObject);

        Files.createDirectories(Paths.get(DIRECTORYPATH));

        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(jsonString);
        }

        return fileName;
    }

    public String updateDesignTemplate(Object jsonObject, Long id) throws IOException {
        String fileName = id + ".json";
        String filePath = Paths.get(DIRECTORYPATH, fileName).toString();

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString = objectMapper.writeValueAsString(jsonObject);

        System.out.println("JSON String: " + jsonString); // Debugging statement

        // Ensure the directory exists before writing the file
        Files.createDirectories(Paths.get(DIRECTORYPATH));

        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write(jsonString);
        }

        return fileName;
    }


    public static Object readDesignFile(Long fileName) throws IOException {
        String filePath = Paths.get(DIRECTORYPATH, fileName.toString()).toString();

        ObjectMapper objectMapper = new ObjectMapper();
        File file = new File(filePath + ".json");

        return objectMapper.readValue(file, Object.class);
    }

    public String extractFullName(String email) {
        String[] parts = email.split("@")[0].split("\\.");
        StringBuilder fullName = new StringBuilder();
        for (String part : parts) {
            fullName.append(part.substring(0, 1).toUpperCase())
                    .append(part.substring(1))
                    .append(" ");
        }
        return fullName.toString().trim();
    }

    public JavaMailSender personalJavaMailSender(String email, String secretKey) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        String host = getSmtpHost(email);
        mailSender.setHost(host);
        mailSender.setPort(587);
        mailSender.setUsername(email);
        mailSender.setPassword(secretKey);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        return mailSender;
    }

    public String getSmtpHost(String email) {
        String domain = email.substring(email.indexOf('@') + 1);
        switch (domain) {
            case "gmail.com":
                return "smtp.gmail.com";
            case "outlook.com":
                return "smtp.outlook.com";
            default:
                throw new IllegalArgumentException("SMTP server not configured for domain: " + domain);
        }
    }


    public JobDetail buildJobDetail(ScheduleEmailRequest scheduleEmailRequest) {
        JobDataMap jobDataMap = new JobDataMap();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String placeHoldersJson = objectMapper.writeValueAsString(scheduleEmailRequest.getPlaceHolders());
            jobDataMap.put("requestBody", placeHoldersJson);
            String recipientsString = String.join(",", scheduleEmailRequest.getRecipients());
            jobDataMap.put("recipients", recipientsString);
            String ccString = String.join(",", scheduleEmailRequest.getCc());
            jobDataMap.put("cc", ccString);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        jobDataMap.put("templateId", scheduleEmailRequest.getTemplateId());
        jobDataMap.put("userId", scheduleEmailRequest.getUserId());
        jobDataMap.put("replyTo", scheduleEmailRequest.getReplyTo());
        jobDataMap.put("addSignature", scheduleEmailRequest.getAddSignature());

        return JobBuilder.newJob(EmailJob.class)
                .withIdentity(UUID.randomUUID().toString(), "email-jobs")
                .withDescription("Send Email Job")
                .usingJobData(jobDataMap)
                .storeDurably()
                .build();
    }

    public Trigger buildJobTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), "email-triggers")
                .withDescription("Send Email Trigger")
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
}

