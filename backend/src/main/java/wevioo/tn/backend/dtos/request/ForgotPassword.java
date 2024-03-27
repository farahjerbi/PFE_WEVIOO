package wevioo.tn.backend.dtos.request;

import lombok.Data;

@Data
public class ForgotPassword {
    private String newPassword;
    private String confirmNewPassword;
    private String email;
}
