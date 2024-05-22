package wevioo.tn.ms_auth.services;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_auth.dtos.requests.ChangePasswordRequest;
import wevioo.tn.ms_auth.dtos.requests.ForgotPassword;
import wevioo.tn.ms_auth.dtos.requests.UpdateUser;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.Member;
import wevioo.tn.ms_auth.entities.Team;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.MemberRepository;
import wevioo.tn.ms_auth.repositories.TeamRepository;
import wevioo.tn.ms_auth.repositories.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;
    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;





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
        if (userEntity.getSignature() != null && !userEntity.getSignature().isEmpty()) {
            user.setSignature(fileStorageService.storeFile(userEntity.getSignature()));
        } else if (userEntity.getSignatureUrl() != null && !userEntity.getSignatureUrl().isEmpty()) {
            user.setSignature(userEntity.getSignatureUrl());
        }

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


    public Team createTeamWithMembers(Team teamDto, Long userId) {
        Team team = new Team();
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());

        Optional<UserEntity> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            team.setUser(user);
        } else {
            throw new IllegalArgumentException("User not found for the provided userId: " + userId);
        }
        teamRepository.save(team);
        List<Member> members = new ArrayList<>();

        for (Member memberDto : teamDto.getMembers()) {
            Member member = new Member();
            member.setFullName(memberDto.getFullName());
            member.setPhone(memberDto.getPhone());
            member.setWhatsapp(memberDto.getWhatsapp());
            member.setEmail(memberDto.getEmail());
            member.setTeam(team);
            members.add(member);
        }

        team.setMembers(members);

        memberRepository.saveAll(members);

        return team;
    }



}
