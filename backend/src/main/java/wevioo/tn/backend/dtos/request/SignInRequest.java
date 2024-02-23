package wevioo.tn.backend.dtos.request;

import lombok.Data;

@Data

public class SignInRequest {
    private String email;
    private String password;
}
