package wevioo.tn.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.ChangePasswordRequest;
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
    public ResponseEntity<String> changePassword() {
        return ResponseEntity.ok().build();
    }
}
