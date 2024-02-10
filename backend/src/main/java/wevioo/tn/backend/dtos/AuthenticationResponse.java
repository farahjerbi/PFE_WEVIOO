package wevioo.tn.backend.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@Builder

public class AuthenticationResponse {
    private String token;
    private String refreshToken;
    private UserResponse user;
    private boolean mfaEnabled;
    private String secretImageUri;

}
