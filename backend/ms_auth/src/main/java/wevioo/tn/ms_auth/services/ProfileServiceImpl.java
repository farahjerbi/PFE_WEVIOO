package wevioo.tn.ms_auth.services;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_auth.dtos.requests.ChangePasswordRequest;
import wevioo.tn.ms_auth.dtos.requests.ForgotPassword;
import wevioo.tn.ms_auth.dtos.requests.UpdateUser;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;



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


    public void forgotPassword(ForgotPassword forgotPassword){
        UserEntity user = userRepository.findByEmail(forgotPassword.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!forgotPassword.getNewPassword().equals(forgotPassword.getConfirmNewPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }
        user.setPassword(passwordEncoder.encode(forgotPassword.getNewPassword()));

        userRepository.save(user);
    }


    public UserResponse UpdateProfile(UpdateUser userEntity , Long id){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setLastName(userEntity.getLastName());
        user.setFirstName(userEntity.getFirstName());
        user.setEmailSecret(userEntity.getEmailSecret());
        user.setSignature(fileStorageService.storeFile(userEntity.getSignature()));

        userRepository.save(user);

        return modelMapper.map(user, UserResponse.class);
    }



    public  String deleteProfile(long id){
        userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        userRepository.deleteById(id);

        return "User deleted successfully";
    }


    public List<UserResponse> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();

        for (UserEntity user : users) {
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            userResponses.add(userResponse);
        }

        return userResponses;
    }



}
