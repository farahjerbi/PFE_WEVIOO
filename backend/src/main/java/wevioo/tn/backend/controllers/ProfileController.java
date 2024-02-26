package wevioo.tn.backend.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.request.ChangePasswordRequest;
import wevioo.tn.backend.dtos.request.UpdateUser;
import wevioo.tn.backend.services.profile.ProfileService;



@RestController
@RequestMapping("/api/profiles/")
@AllArgsConstructor
public class ProfileController {
    private final ProfileService profileService;


    @GetMapping("demo")
    public ResponseEntity<String> demo() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("forgot_password")
    public ResponseEntity<String> forgetPassword(@RequestBody String email){
        return new ResponseEntity<>(profileService.forgotPassword(email), HttpStatus.OK);
    }

    @PutMapping("updateProfile/{id}")
    public ResponseEntity<String> updateUser (@RequestBody UpdateUser user , @PathVariable Long id){
        return new ResponseEntity<>(profileService.UpdateProfile(user,id), HttpStatus.OK);
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

}
