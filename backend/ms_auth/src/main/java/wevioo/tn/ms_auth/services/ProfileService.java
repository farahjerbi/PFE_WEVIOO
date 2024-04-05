package wevioo.tn.ms_auth.services;

import wevioo.tn.ms_auth.dtos.requests.ChangePasswordRequest;
import wevioo.tn.ms_auth.dtos.requests.ForgotPassword;
import wevioo.tn.ms_auth.dtos.requests.UpdateUser;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;

import java.util.List;

public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    void forgotPassword(ForgotPassword email);
    String deleteProfile(long id);

    UserResponse UpdateProfile(UpdateUser userEntity , Long id );
    List<UserResponse> getAllUsers();
}
