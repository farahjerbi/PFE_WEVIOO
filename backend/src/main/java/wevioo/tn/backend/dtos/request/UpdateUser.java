package wevioo.tn.backend.dtos.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateUser {
    private String firstName;
    private String lastName;
    private String emailSecret;
    private MultipartFile signature;
}
