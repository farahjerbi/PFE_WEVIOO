package wevioo.tn.backend.services.profile;

import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.dtos.response.UserResponse;
import wevioo.tn.backend.entities.UserEntity;

import java.util.List;


public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    String forgotPassword(String email);
    String deleteProfile(long id);

     String UpdateProfile(UpdateUser userEntity , Long id);
    List<UserResponse> getAllUsers();
}
