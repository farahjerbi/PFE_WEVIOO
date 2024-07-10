package wevioo.tn.ms_email.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendEmailSeparately {
        private String recipient;
        private String[] cc;
        private String replyTo;
        private Long id;
        private String addSignature;
        private String requestBody;
        private MultipartFile attachment;
}
