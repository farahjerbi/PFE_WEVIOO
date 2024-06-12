package wevioo.tn.ms_auth.controllers;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_auth.dtos.requests.ChangePasswordRequest;
import wevioo.tn.ms_auth.dtos.requests.ForgotPassword;
import wevioo.tn.ms_auth.dtos.requests.TeamRequest;
import wevioo.tn.ms_auth.dtos.requests.UpdateUser;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.Member;
import wevioo.tn.ms_auth.entities.Team;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.UserRepository;
import wevioo.tn.ms_auth.services.AuthenticationService;
import wevioo.tn.ms_auth.services.ProfileService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/")
@AllArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    private final AuthenticationService authenticationService;

    private final ModelMapper modelMapper;
    private final UserRepository userRepository;


    @PostMapping("forgotPassword")
    public void forgetPassword(@RequestBody ForgotPassword forgotPassword){
        profileService.forgotPassword(forgotPassword);
    }

    @PostMapping(value = "updateProfile/{id}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<UserResponse> updateUser (@ModelAttribute UpdateUser user ,
                                                    @PathVariable Long id){
        return ResponseEntity.ok(profileService.UpdateProfile(user,id));
    }

    @DeleteMapping("deleteProfile/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        return new ResponseEntity<>(profileService.deleteProfile(id), HttpStatus.OK);
    }

    @PostMapping("changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request ) {
        profileService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("getAllUsers")
    public List<UserResponse> getUsers( ) {
        return profileService.getAllUsers();
    }

    @PutMapping("enableUser/{email}")
    public String enableUserByEmail(@PathVariable  String email) {
        return authenticationService.enableUser(email);
    }

    @PutMapping("deactivateUser/{email}")
    public String deactivateUserByEmail(@PathVariable String email) {
        return authenticationService.deactivateUser(email);
    }

    @GetMapping("getUserByEmail/{email}")
    public UserResponse getUserByEmail(@PathVariable String email){
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        return  modelMapper.map(user, UserResponse.class);
    }

    @GetMapping("getUserById/{id}")
    @Transactional
    public UserResponse getUserById(@PathVariable Long id){
        Optional<UserEntity> user = userRepository.findById(id);
        return  modelMapper.map(user, UserResponse.class);
    }
    @PostMapping("createTeam/{id}")
    public ResponseEntity<Team> createTeamWithMembers(@RequestBody TeamRequest teamDto, @PathVariable Long id) {
        try {
            Team team = profileService.createTeamWithMembers(teamDto,id);
            return ResponseEntity.status(HttpStatus.CREATED).body(team);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("createMember/{id}")
    public ResponseEntity<MemberResponse> createMember(@RequestBody Member member, @PathVariable Long id) {
        try {
            MemberResponse m = profileService.addMember(member,id);
            return ResponseEntity.status(HttpStatus.CREATED).body(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("updateMember")
    public ResponseEntity<Member> updateMember(@RequestBody Member member) {
        try {
            Member m = profileService.updateMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("deleteMember/{id}")
    public String deleteMember(@PathVariable Long id){
        return profileService.deleteMember(id);
    }
}
