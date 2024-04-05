package wevioo.tn.ms_auth.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class EmailForgetPassword {
    private final JavaMailSender mailSender;

    public void sendEmailForgotPassword(String toEmail ){
        String activationLink = "http://localhost:3000/forgotPassword/" + toEmail;
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
                "        <h1>Reset Password</h1>\n" +
                "        <p>Dear User,</p>\n" +
                "        <p>In order to reset your account password, please click on the following link:</p>\n" +
                "        <p><a class=\"cta-button\" href=\"" + activationLink + "\">Reset Password</a></p>\n" +
                "        <p>If you did not ask for a change in the password , please disregard this email.</p>\n" +
                "        <p>Thank you for choosing our Platform!</p>\n" +
                "        <p>Sincerely, Wevioo Team</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("farah.jeerbi@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject("Reset Password");
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {

        }
    }

}
