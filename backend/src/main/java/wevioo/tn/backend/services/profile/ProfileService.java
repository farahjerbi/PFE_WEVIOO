package wevioo.tn.backend.services.profile;

import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.dtos.UpdateUser;


public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    String forgotPassword(String email);
    public  String deleteProfile(long id);

    public String UpdateProfile(UpdateUser userEntity , Long id);
}
