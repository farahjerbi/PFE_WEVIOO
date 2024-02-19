package wevioo.tn.backend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import wevioo.tn.backend.dtos.AuthenticationResponse;
import wevioo.tn.backend.dtos.SignInRequest;
import wevioo.tn.backend.dtos.SignUpRequest;
import wevioo.tn.backend.dtos.VerificationRequest;
import wevioo.tn.backend.repositories.UserRepository;
import wevioo.tn.backend.services.AuthenticationService;

@Tag(name = "Authentication", description = "Authentication")
@RestController
@RequestMapping("/api/auth/")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserRepository userRepository;


    @PostMapping("register")
    public ResponseEntity<?>signUp(@RequestBody SignUpRequest signUpRequest){
        Boolean emailExists = userRepository.existsByEmail(signUpRequest.getEmail());
        if (Boolean.TRUE.equals(emailExists)) {
            return ResponseEntity.badRequest().body("Email Already Exists");
        } else {
            return ResponseEntity.ok(authenticationService.singUp(signUpRequest));
        }
    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody SignInRequest signInRequest) {
        return ResponseEntity.ok(authenticationService.signIn(signInRequest));
    }

    @PostMapping("verify")
    public ResponseEntity<AuthenticationResponse> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(authenticationService.verifyCode(verificationRequest));
    }


    @PutMapping("enableUser")
    public String enableUserByEmail(@RequestParam("email") String email) {
        return authenticationService.enableUser(email);
    }

    @PutMapping("deactivateUser")
    public String deactivateUserByEmail(@RequestBody String email) {
        return authenticationService.deactivateUser(email);
    }



}
