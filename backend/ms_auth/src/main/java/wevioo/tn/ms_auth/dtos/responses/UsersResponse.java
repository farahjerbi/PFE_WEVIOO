package wevioo.tn.ms_auth.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UsersResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String enabled;
    private String mfaEnabled;
    private String emailSecret;
    private String signature;
}
