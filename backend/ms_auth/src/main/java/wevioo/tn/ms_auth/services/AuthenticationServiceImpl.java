package wevioo.tn.ms_auth.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import wevioo.tn.ms_auth.dtos.requests.SignInRequest;
import wevioo.tn.ms_auth.dtos.requests.SignUpRequest;
import wevioo.tn.ms_auth.dtos.requests.VerificationRequest;
import wevioo.tn.ms_auth.dtos.responses.AuthenticationResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.UserRepository;
import wevioo.tn.ms_auth.security.JwtGenerator;
import wevioo.tn.ms_auth.twoFactorAuth.TwoFactorAuthenticationService;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtGenerator jwtGenerator;
    private final TwoFactorAuthenticationService tfaService;

    private final EmailAuthVerification emailAuthVerification;

    private final ModelMapper modelMapper;

    @Autowired
    public AuthenticationServiceImpl(ModelMapper modelMapper ,UserRepository userRepository, PasswordEncoder passwordEncoder,
                                     AuthenticationManager authenticationManager, JwtGenerator jwtGenerator,
                                     TwoFactorAuthenticationService tfaService,EmailAuthVerification emailAuthVerification) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.tfaService = tfaService;
        this.modelMapper=modelMapper;
        this.emailAuthVerification=emailAuthVerification;
    }


    public AuthenticationResponse singUp(SignUpRequest signUpRequest){

        UserEntity user = modelMapper.map(signUpRequest, UserEntity.class);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setEnabled(true);
        if(signUpRequest.isMfaEnabled()){
            user.setSecret(tfaService.generateNewSecret());
        }

        userRepository.save(user);

        if(!user.isMfaEnabled()){
            return AuthenticationResponse.builder().mfaEnabled(user.isMfaEnabled()).build();
        }

        return AuthenticationResponse.builder()
                .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .mfaEnabled(user.isMfaEnabled())
                .build();

    }

    public AuthenticationResponse signIn( SignInRequest signInRequest){
        UserEntity userFound= userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"));

        if (!userFound.isEnabled()) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "User is not enabled");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),signInRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);
        UserResponse user = modelMapper.map(userFound, UserResponse.class);

        if (userFound.isMfaEnabled()) {
            return AuthenticationResponse.builder()
                    .token("")
                    .refreshToken("")
                    .mfaEnabled(true)
                    .build();
        }



        return AuthenticationResponse.builder()
                .token(token)
                .user(user)
                .mfaEnabled(false)
                .build();


    }

    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        try {
            // Retrieve user from repository
            UserEntity user = userRepository.findByEmail(verificationRequest.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid email"));

            // Validate OTP
          /*  if (!tfaService.isOtpValid(user.getSecret(), verificationRequest.getCode())) {
                throw new BadCredentialsException("Code is not correct");
            }*/

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(verificationRequest.getEmail(), verificationRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String token = jwtGenerator.generateToken(authentication);

            // Map user to response object
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);

            // Build and return authentication response
            return AuthenticationResponse.builder()
                    .token(token)
                    .user(userResponse)
                    .build();
        } catch (IllegalArgumentException ex) {
            // Handle invalid email exception
            System.out.println("Invalid email provided: " + verificationRequest.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid email", ex);
        } catch (BadCredentialsException ex) {
            // Handle incorrect OTP exception
            System.out.println("Incorrect code provided: " + ex.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect code", ex);
        } catch (AuthenticationException ex) {
            // Handle authentication failure
            System.out.println("Authentication failed: " + ex.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed", ex);
        } catch (Exception ex) {
            // Handle unexpected errors
            System.out.println("An unexpected error occurred: " + ex.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", ex);
        }
    }



    public String enableUser(String email){
        UserEntity user= userRepository.findByEmail(email).orElseThrow(()->new IllegalArgumentException("Email not found"));
        user.setEnabled(true);
        userRepository.save(user);
        return "User Enabled successfully";
    }

    public String deactivateUser(String email){
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %S", email)
                ));

        user.setEnabled(false);
        userRepository.save(user);
        return "User Deactivated successfully";

    }


}
