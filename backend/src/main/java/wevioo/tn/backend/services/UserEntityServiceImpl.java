package wevioo.tn.backend.services;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.UserRepository;


@Service
public class UserEntityServiceImpl implements UserEntityService {
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  UserRepository userRepository;

    public void changePassword(ChangePasswordRequest request ) {

            UserEntity user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalStateException("User not found"));

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new IllegalStateException("Wrong password");
            }

            if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
                throw new IllegalStateException("Passwords do not match");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));

            userRepository.save(user);
        }


}
