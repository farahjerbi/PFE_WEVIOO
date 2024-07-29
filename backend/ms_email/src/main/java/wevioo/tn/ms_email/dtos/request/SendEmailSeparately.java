package wevioo.tn.ms_email.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendEmailSeparately {
        private String recipient;
        private String replyTo;
        private String addSignature;
        private String requestBody;
}
