package wevioo.tn.backend.services;

import wevioo.tn.backend.dtos.ChangePasswordRequest;


public interface UserEntityService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
}
