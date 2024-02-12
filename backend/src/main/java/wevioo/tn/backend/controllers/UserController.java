package wevioo.tn.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.ChangePasswordRequest;
import wevioo.tn.backend.dtos.UpdateUser;
import wevioo.tn.backend.services.UserEntityService;



@RestController
@RequestMapping("/api/users/")

public class UserController {
    @Autowired
    private UserEntityService userService;

    @PostMapping("changepassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request ) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("demo")
    public ResponseEntity<String> demo() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("forgot_password")
    public ResponseEntity<String> forgetPassword(@RequestBody String email){
        return new ResponseEntity<>(userService.forgotPassword(email), HttpStatus.OK);
    }

    @PutMapping("updateUser/{id}")
    public ResponseEntity<String> updateUser (@RequestBody UpdateUser user , @PathVariable Long id){
        return new ResponseEntity<>(userService.UpdateUser(user,id), HttpStatus.OK);
    }

    @DeleteMapping("deleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        return new ResponseEntity<>(userService.deleteUser(id), HttpStatus.OK);
    }
}
