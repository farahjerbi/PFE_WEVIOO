package wevioo.tn.ms_auth.controllers;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_auth.dtos.requests.*;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;
import wevioo.tn.ms_auth.dtos.responses.TeamResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.dtos.responses.UsersResponse;
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
    public void deleteUser(@PathVariable Long id,@RequestBody DeleteRequest request){
         profileService.deleteProfile(id,request.getPassword(),request.getIsAdmin());
    }

    @PostMapping("changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request ) {
        profileService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("getAllUsers")
    public List<UsersResponse> getUsers( ) {
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
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        UserResponse userResponse = modelMapper.map(user, UserResponse.class);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("getUserById/{id}")
    @Transactional
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<UserEntity> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            UserResponse userResponse = modelMapper.map(userOptional.get(), UserResponse.class);
            return ResponseEntity.ok(userResponse);
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    @PostMapping("createTeam/{id}")
    public ResponseEntity<TeamResponse> createTeamWithMembers(@RequestBody TeamRequest teamDto, @PathVariable Long id) {
        try {
            TeamResponse team = profileService.createTeamWithMembers(teamDto,id);
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
    @PostMapping("/{userId}/members")
    public ResponseEntity<List<MemberResponse>> addMembers(
            @PathVariable Long userId,
            @RequestBody List<Member> members) {
        List<MemberResponse> memberResponses = profileService.addMembers(members, userId);
        return ResponseEntity.ok(memberResponses);
    }

    @PostMapping("updateMember")
    public ResponseEntity<MemberResponse> updateMember(@RequestBody UpdateMember member) {
        try {
            MemberResponse m = profileService.updateMember(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PutMapping("updateTeam/{teamId}")
    public ResponseEntity<TeamResponse> updateTeam(@RequestBody TeamRequest teamRequest
            ,@PathVariable Long teamId) {
        try {
            TeamResponse m = profileService.updateTeamWithMembers(teamId,teamRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(m);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @DeleteMapping("deleteTeam/{id}")
    public ResponseEntity<String> deleteTeam(@PathVariable Long id){
         profileService.deleteTeam(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully");
    }


    @DeleteMapping("deleteMember/{id}")
    public String deleteMember(@PathVariable Long id){
        return profileService.deleteMember(id);
    }
}
