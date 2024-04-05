package wevioo.tn.ms_auth.dtos.requests;

import lombok.Data;

@Data
public class SignUpRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private boolean mfaEnabled;
}

