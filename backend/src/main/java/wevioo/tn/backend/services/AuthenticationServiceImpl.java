package wevioo.tn.backend.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.TwoFactorAuth.TwoFactorAuthenticationService;
import wevioo.tn.backend.dtos.*;
import wevioo.tn.backend.entities.Role;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.UserRepository;
import wevioo.tn.backend.security.JwtGenerator;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private AuthenticationManager authenticationManager;

    private JwtGenerator jwtGenerator;
    private TwoFactorAuthenticationService tfaService;
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    public AuthenticationServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtGenerator jwtGenerator, TwoFactorAuthenticationService tfaService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.tfaService = tfaService;
    }


    public AuthenticationResponse singUp(SignUpRequest signUpRequest){
        UserEntity user = new UserEntity();

        user.setEmail(signUpRequest.getEmail());
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setMfaEnabled(signUpRequest.isMfaEnabled());
        
        if(signUpRequest.isMfaEnabled()){
            user.setSecret(tfaService.generateNewSecret());
        }

        userRepository.save(user);


        return AuthenticationResponse.builder()
                .secretImageUri(tfaService.generateQrCodeImageUri(user.getSecret()))
                .mfaEnabled(user.isMfaEnabled())
                .build();

    }

    public AuthenticationResponse signIn( SignInRequest signInRequest){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signInRequest.getEmail(),signInRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserEntity userFound= userRepository.findByEmail(signInRequest.getEmail()).orElseThrow(()->new IllegalArgumentException("Invalid email or password"));
        String token = jwtGenerator.generateToken(authentication);
       // String refreshToken = jwtGenerator.generateToken(authentication);
        UserResponse user = modelMapper.map(userFound, UserResponse.class);

        if (userFound.isMfaEnabled()) {
            return AuthenticationResponse.builder()
                    .token("")
                    .refreshToken("")
                    .mfaEnabled(true)
                    .build();
        }


      //  authenticationResponse.setRefreshToken(refreshToken);

        return AuthenticationResponse.builder()
                .token(token)
                .user(user)
                .build();


    }

    public AuthenticationResponse verifyCode(VerificationRequest verificationRequest) {
        UserEntity user = userRepository.findByEmail(verificationRequest.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(
                        String.format("No user found with %S", verificationRequest.getEmail()))
                );
        if (tfaService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) {

            throw new BadCredentialsException("Code is not correct");
        }
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(),user.getPassword()));
        var jwtToken = jwtGenerator.generateToken(authentication);

        UserResponse userResponse = modelMapper.map(user, UserResponse.class);


        return AuthenticationResponse.builder()
                .token(jwtToken)
                .user(userResponse)
                .mfaEnabled(user.isMfaEnabled())
                .build();
    }

}
