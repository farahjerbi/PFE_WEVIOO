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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
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

        UserEntity user= userRepository.findByEmail(verificationRequest.getEmail()).orElseThrow(()->new IllegalArgumentException("Invalid email"));

        if ( !tfaService.isOtpValid(user.getSecret(), verificationRequest.getCode())) {

            throw new BadCredentialsException("Code is not correct");
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(verificationRequest.getEmail(),verificationRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        UserResponse userResponse = modelMapper.map(user, UserResponse.class);


        return AuthenticationResponse.builder()
                .token(token)
                .user(userResponse)
                .build();
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
