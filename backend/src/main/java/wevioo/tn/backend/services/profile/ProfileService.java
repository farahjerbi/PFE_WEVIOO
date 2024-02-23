package wevioo.tn.backend.services.profile;

import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.UpdateUser;


public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    String forgotPassword(String email);
    public  String deleteProfile(long id);

    public String UpdateProfile(UpdateUser userEntity , Long id);
}
