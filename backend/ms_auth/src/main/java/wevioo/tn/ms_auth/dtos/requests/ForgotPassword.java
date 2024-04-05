package wevioo.tn.ms_auth.dtos.requests;

import lombok.Data;

@Data
public class ForgotPassword {
    private String newPassword;
    private String confirmNewPassword;
    private String email;
}

