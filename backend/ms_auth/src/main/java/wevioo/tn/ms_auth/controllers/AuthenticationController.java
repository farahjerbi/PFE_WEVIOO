package wevioo.tn.ms_auth.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_auth.dtos.requests.SignInRequest;
import wevioo.tn.ms_auth.dtos.requests.SignUpRequest;
import wevioo.tn.ms_auth.dtos.requests.VerificationRequest;
import wevioo.tn.ms_auth.dtos.responses.AuthenticationResponse;
import wevioo.tn.ms_auth.repositories.UserRepository;
import wevioo.tn.ms_auth.security.JwtGenerator;
import wevioo.tn.ms_auth.services.AuthenticationService;
import wevioo.tn.ms_auth.services.EmailAuthVerification;
import wevioo.tn.ms_auth.services.EmailForgetPassword;

@Tag(name = "Authentication", description = "Authentication")
@RestController
@RequestMapping("/api/auth/")
@AllArgsConstructor
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;
    private final JwtGenerator jwtGenerator;
    private final EmailAuthVerification emailAuthVerification;
    private final EmailForgetPassword emailForgetPassword;


    @PostMapping("register")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest){
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


    @PostMapping("verifyToken")
    public ResponseEntity<?> verifyToken(@RequestBody String token) {
        return ResponseEntity.ok(jwtGenerator.validateToken(token));
    }

    @PostMapping("verifyEmail")
    public void verifyEmail(@RequestBody String email){
        emailAuthVerification.sendEmailAuthVerification(email);
    }

    @PostMapping("sendEmailForgotPassword")
    public void sendEmailForgotPassword(@RequestBody String email){
        emailForgetPassword.sendEmailForgotPassword(email);
    }
}
