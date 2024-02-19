package wevioo.tn.backend.services.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.repositories.UserRepository;

@Service
public class EmailAuthVerification {

    private final JavaMailSender mailSender;

    private final UserRepository userRepository;

    public EmailAuthVerification(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }



    public void sendEmailAuthVerification(String toEmail ){
        String activationLink = "http://localhost:4200/pages/activateAccount?email=" + toEmail;
        String body = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "    <title>Account Activation</title>\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            background-color: #f2f2f2;\n" +
                "            margin: 0;\n" +
                "            padding: 0;\n" +
                "        }\n" +
                "        .container {\n" +
                "            max-width: 600px;\n" +
                "            background-color: #ffffff;\n" +
                "            margin: 0 auto;\n" +
                "            padding: 20px;\n" +
                "            border-radius: 8px;\n" +
                "            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);\n" +
                "        }\n" +
                "        h1 {\n" +
                "            color: #007BFF;\n" +
                "            font-size: 24px;\n" +
                "        }\n" +
                "        p {\n" +
                "            font-size: 16px;\n" +
                "        }\n" +
                "        .cta-button {\n" +
                "            display: inline-block;\n" +
                "            padding: 12px 24px;\n" +
                "            background-color: #007BFF;\n" +
                "            color: #fff;\n" +
                "            text-decoration: none;\n" +
                "            border-radius: 4px;\n" +
                "            font-weight: bold;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"container\">\n" +
                "        <h1>Account Activation</h1>\n" +
                "        <p>Dear User,</p>\n" +
                "        <p>Thank you for registering an account with IntelliPath! To activate your account and start using our services, please click on the following link:</p>\n" +
                "        <p><a class=\"cta-button\" href=\"" + activationLink + "\">Activate Account</a></p>\n" +
                "        <p>If you did not create an account on IntelliPath, please disregard this email.</p>\n" +
                "        <p>Thank you for choosing IntelliPath!</p>\n" +
                "        <p>Sincerely, The IntelliPath Team</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Account Activation");
            helper.setText(body, true); // Set the second parameter to true for HTML content

            mailSender.send(message);
        } catch (MessagingException e) {

        }
    }


}
