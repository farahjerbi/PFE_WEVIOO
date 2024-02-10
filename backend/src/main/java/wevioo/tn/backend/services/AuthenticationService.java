package wevioo.tn.backend.services;

import wevioo.tn.backend.dtos.AuthenticationResponse;
import wevioo.tn.backend.dtos.SignInRequest;
import wevioo.tn.backend.dtos.SignUpRequest;
import wevioo.tn.backend.dtos.VerificationRequest;

public interface AuthenticationService {
     AuthenticationResponse singUp(SignUpRequest signUpRequest);
     AuthenticationResponse signIn( SignInRequest signInRequest);
     AuthenticationResponse verifyCode(VerificationRequest verificationRequest);
    }
