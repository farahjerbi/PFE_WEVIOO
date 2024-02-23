package wevioo.tn.backend.services.auth;

import wevioo.tn.backend.dtos.response.AuthenticationResponse;
import wevioo.tn.backend.dtos.request.SignInRequest;
import wevioo.tn.backend.dtos.request.SignUpRequest;
import wevioo.tn.backend.dtos.request.VerificationRequest;

public interface AuthenticationService {
     AuthenticationResponse singUp(SignUpRequest signUpRequest);
     AuthenticationResponse signIn( SignInRequest signInRequest);
     AuthenticationResponse verifyCode(VerificationRequest verificationRequest);
     String enableUser(String email);

     String deactivateUser(String email);
    }
