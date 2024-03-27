package wevioo.tn.backend.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.ForgotPassword;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.dtos.response.UserResponse;
import wevioo.tn.backend.services.auth.AuthenticationService;
import wevioo.tn.backend.services.profile.ProfileService;

import java.util.List;


@RestController
@RequestMapping("/api/users/")
@AllArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    private final AuthenticationService authenticationService;


    @PostMapping ("forgotPassword")
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

}
