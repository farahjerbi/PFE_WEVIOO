package wevioo.tn.backend.services.profile;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.dtos.response.UserResponse;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;



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


        public String forgotPassword(String email){
           /* UserEntity user =  userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("User not found"));        */
            return " ";
    }


    public String UpdateProfile(UpdateUser userEntity , Long id){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setLastName(userEntity.getLastName());
        user.setFirstName(userEntity.getFirstName());
        userRepository.save(user);

        return "User Updated successfully";
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
