package wevioo.tn.ms_auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import wevioo.tn.ms_auth.dtos.requests.SignInRequest;
import wevioo.tn.ms_auth.dtos.requests.SignUpRequest;
import wevioo.tn.ms_auth.dtos.responses.AuthenticationResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.UserRepository;
import wevioo.tn.ms_auth.security.JwtGenerator;
import wevioo.tn.ms_auth.services.AuthenticationServiceImpl;
import wevioo.tn.ms_auth.services.EmailAuthVerification;
import wevioo.tn.ms_auth.twoFactorAuth.TwoFactorAuthenticationService;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtGenerator jwtGenerator;

    @Mock
    private TwoFactorAuthenticationService tfaService;

    @Mock
    private EmailAuthVerification emailAuthVerification;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    private UserEntity userEntity;
    private SignUpRequest signUpRequest;
    private SignInRequest signInRequest;

    @BeforeEach
    public void setUp() {
        userEntity = new UserEntity();
        userEntity.setEmail("test@example.com");
        userEntity.setPassword("password");
        userEntity.setEnabled(true);

        signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setPassword("password");
        signUpRequest.setMfaEnabled(false);

        signInRequest = new SignInRequest();
        signInRequest.setEmail("test@example.com");
        signInRequest.setPassword("password");

    }

    @Test
     void testSignUp() {
        when(modelMapper.map(any(SignUpRequest.class), eq(UserEntity.class))).thenReturn(userEntity);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);

        AuthenticationResponse response = authenticationService.singUp(signUpRequest);

        assertNotNull(response);
        assertFalse(response.isMfaEnabled());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
     void testSignIn() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));
        when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(new UsernamePasswordAuthenticationToken("test@example.com", "password"));
        when(jwtGenerator.generateToken(any(Authentication.class))).thenReturn("jwtToken");
        when(modelMapper.map(any(UserEntity.class), eq(UserResponse.class))).thenReturn(new UserResponse());

        AuthenticationResponse response = authenticationService.signIn(signInRequest);

        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any(Authentication.class));
        verify(jwtGenerator, times(1)).generateToken(any(Authentication.class));
    }

    @Test
     void testEnableUser() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));

        String result = authenticationService.enableUser("test@example.com");

        assertEquals("User Enabled successfully", result);
        assertTrue(userEntity.isEnabled());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
     void testDeactivateUser() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));

        String result = authenticationService.deactivateUser("test@example.com");

        assertEquals("User Deactivated successfully", result);
        assertFalse(userEntity.isEnabled());
        verify(userRepository, times(1)).save(any(UserEntity.class));
    }
}
