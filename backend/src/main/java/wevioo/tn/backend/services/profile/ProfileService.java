package wevioo.tn.backend.services.profile;

import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.ForgotPassword;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.dtos.response.UserResponse;
import wevioo.tn.backend.entities.UserEntity;

import java.util.List;


public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    void forgotPassword(ForgotPassword email);
    String deleteProfile(long id);

    UserResponse UpdateProfile(UpdateUser userEntity , Long id );
    List<UserResponse> getAllUsers();
}
