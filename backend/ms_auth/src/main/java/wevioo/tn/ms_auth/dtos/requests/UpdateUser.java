package wevioo.tn.ms_auth.dtos.requests;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateUser {
    private String firstName;
    private String lastName;
    private String emailSecret;
    private String signatureUrl;
    private MultipartFile signature;
}
