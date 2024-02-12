package wevioo.tn.backend.services;

import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.dtos.UpdateUser;


public interface UserEntityService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    String forgotPassword(String email);
    public  String deleteUser(long id);

    public String UpdateUser(UpdateUser userEntity , Long id);
}
