package wevioo.tn.ms_email.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SendEmail {
    private String[] recipients;
    private String[] cc;
    private String requestBody;
    private String replyTo;
    private MultipartFile attachment;
    private Long id ;
    private String addSignature;
    private String isSentSeparately="false";
}
