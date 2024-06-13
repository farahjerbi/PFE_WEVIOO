package wevioo.tn.ms_auth.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import wevioo.tn.ms_auth.entities.Member;

import java.util.Set;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String enabled;
    private String mfaEnabled;
    private String emailSecret;
    private String signature;
    private Set<MemberResponse> members;
    private Set<TeamResponse> teams;

}

