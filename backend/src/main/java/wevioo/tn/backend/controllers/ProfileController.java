package wevioo.tn.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.dtos.UpdateUser;
import wevioo.tn.backend.services.ProfileService;



@RestController
@RequestMapping("/api/profiles/")

public class ProfileController {
    @Autowired
    private ProfileService profileService;


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

    @PostMapping("changepassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request ) {
        profileService.changePassword(request);
        return ResponseEntity.ok().build();
    }

}
