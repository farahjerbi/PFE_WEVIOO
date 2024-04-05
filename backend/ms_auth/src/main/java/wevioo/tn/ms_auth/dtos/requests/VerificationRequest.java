package wevioo.tn.ms_auth.dtos.requests;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VerificationRequest {
    private String email;
    private String code;
    private String password;
}
