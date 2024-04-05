package wevioo.tn.ms_auth.services;

import wevioo.tn.ms_auth.dtos.requests.SignInRequest;
import wevioo.tn.ms_auth.dtos.requests.SignUpRequest;
import wevioo.tn.ms_auth.dtos.requests.VerificationRequest;
import wevioo.tn.ms_auth.dtos.responses.AuthenticationResponse;

public interface AuthenticationService {
    AuthenticationResponse singUp(SignUpRequest signUpRequest);
    AuthenticationResponse signIn( SignInRequest signInRequest);
    AuthenticationResponse verifyCode(VerificationRequest verificationRequest);
    String enableUser(String email);

    String deactivateUser(String email);
}
