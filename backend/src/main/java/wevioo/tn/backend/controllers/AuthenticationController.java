package wevioo.tn.backend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
    public ResponseEntity<String>signUp(@RequestBody SignUpRequest signUpRequest){
        Boolean emailExists = userRepository.existsByEmail(signUpRequest.getEmail());
        if (Boolean.TRUE.equals(emailExists)) {
            return ResponseEntity.badRequest().body("Email Already Exists");
        } else {
            authenticationService.singUp(signUpRequest);
            return ResponseEntity.ok("{\"message\": \"User registered successfully\"}");
        }
    }

    @PostMapping("login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody SignInRequest signInRequest) {
        return ResponseEntity.ok(authenticationService.signIn(signInRequest));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        return ResponseEntity.ok(authenticationService.verifyCode(verificationRequest));
    }
}
