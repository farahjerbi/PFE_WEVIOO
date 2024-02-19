package wevioo.tn.backend.services.profile;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.dtos.UpdateUser;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.UserRepository;
import wevioo.tn.backend.services.profile.ProfileService;


@Service
public class ProfileServiceImpl implements ProfileService {
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private  UserRepository userRepository;

    @Autowired
    private  ModelMapper modelMapper;


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
        user.setAddress(userEntity.getAddress());
        user.setProfession(userEntity.getProfession());
        user.setGithub(userEntity.getGithub());
        user.setPhone(userEntity.getPhone());
        user.setTwitter(userEntity.getTwitter());
        userRepository.save(user);

        return "User Updated successfully";
    }



    public  String deleteProfile(long id){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

         userRepository.deleteById(id);

        return "User deleted successfully";

    }



}
