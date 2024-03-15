package wevioo.tn.backend.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Data
public class SendEmail {
    private String[] recipients;
    private String[] cc;
    private String[] bb;
    private String requestBody;
    private String replyTo;
    private MultipartFile attachment;
}
