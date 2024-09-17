package wevioo.tn.ms_auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import wevioo.tn.ms_auth.dtos.requests.*;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;
import wevioo.tn.ms_auth.dtos.responses.TeamResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.dtos.responses.UsersResponse;
import wevioo.tn.ms_auth.entities.Member;
import wevioo.tn.ms_auth.entities.Team;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.MemberRepository;
import wevioo.tn.ms_auth.repositories.TeamRepository;
import wevioo.tn.ms_auth.repositories.UserRepository;
import wevioo.tn.ms_auth.services.FileStorageService;
import wevioo.tn.ms_auth.services.ProfileServiceImpl;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private ProfileServiceImpl profileService;

    private UserEntity userEntity;
    private Member member;
    private Team team;

    @BeforeEach
    void setUp() {
        userEntity = new UserEntity();
        userEntity.setEmail("test@example.com");
        userEntity.setPassword("password");
        userEntity.setEnabled(true);

        member = new Member();
        member.setId(1L);

        team = new Team();
        team.setId(1L);
    }

    @Test
    void testChangePassword() {
        ChangePasswordRequest request = new ChangePasswordRequest("test@example.com", "oldPassword", "oldPassword", "newPassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        profileService.changePassword(request);

        verify(userRepository, times(1)).save(userEntity);
        assertEquals("encodedPassword", userEntity.getPassword());
    }

    @Test
    void testForgotPassword() {
        ForgotPassword forgotPassword = new ForgotPassword();
        forgotPassword.setEmail("test@example.com");
        forgotPassword.setNewPassword("newPassword");
        forgotPassword.setConfirmNewPassword("newPassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        profileService.forgotPassword(forgotPassword);

        verify(userRepository, times(1)).save(userEntity);
        assertEquals("encodedPassword", userEntity.getPassword());
    }

    @Test
    void testUpdateProfile() {
        UpdateUser updateUser = new UpdateUser();
        updateUser.setLastName("Doe");
        updateUser.setFirstName("John");
        updateUser.setEmailSecret("secret");
        updateUser.setSignature(mock(org.springframework.web.multipart.MultipartFile.class));

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));
        when(fileStorageService.storeFile(any(org.springframework.web.multipart.MultipartFile.class))).thenReturn("storedSignature");
        when(modelMapper.map(any(UserEntity.class), eq(UserResponse.class))).thenReturn(new UserResponse());

        UserResponse response = profileService.UpdateProfile(updateUser, 1L);

        verify(userRepository, times(1)).save(userEntity);
        assertEquals("Doe", userEntity.getLastName());
        assertEquals("John", userEntity.getFirstName());
        assertEquals("secret", userEntity.getEmailSecret());
        assertEquals("storedSignature", userEntity.getSignature());
        assertNotNull(response);
    }


    @Test
    void testGetAllUsers() {
        List<UserEntity> users = Arrays.asList(userEntity);
        when(userRepository.findAllWithMembers()).thenReturn(users);
        when(modelMapper.map(any(UserEntity.class), eq(UsersResponse.class))).thenReturn(new UsersResponse());

        List<UsersResponse> response = profileService.getAllUsers();

        assertNotNull(response);
        assertEquals(1, response.size());
        verify(userRepository, times(1)).findAllWithMembers();
    }

    @Test
    void testCreateGroupWithContacts() {
        TeamRequest teamRequest = new TeamRequest();
        teamRequest.setName("Team Name");
        teamRequest.setDescription("Team Description");
        teamRequest.setAvatar("Avatar");
        teamRequest.setMembers(new HashSet<>(Collections.singletonList(1L)));

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));
        when(memberRepository.findAllById(anyCollection())).thenReturn(Collections.singletonList(member));
        when(teamRepository.save(any(Team.class))).thenReturn(team);
        when(modelMapper.map(any(Team.class), eq(TeamResponse.class))).thenReturn(new TeamResponse());

        TeamResponse response = profileService.createTeamWithMembers(teamRequest, 1L);

        assertNotNull(response);
        verify(teamRepository, times(1)).save(any(Team.class));
        verify(memberRepository, times(1)).saveAll(anyCollection());
    }

    @Test
    void testAddContact() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));
        when(memberRepository.save(any(Member.class))).thenReturn(member);
        when(modelMapper.map(any(Member.class), eq(MemberResponse.class))).thenReturn(new MemberResponse());

        MemberResponse response = profileService.addMember(member, 1L);

        assertNotNull(response);
        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(memberRepository, times(1)).save(any(Member.class));
    }

    @Test
    void testAddContacts() {
        List<Member> members = Arrays.asList(member);
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));
        when(memberRepository.saveAll(anyCollection())).thenReturn(members);
        when(modelMapper.map(any(Member.class), eq(MemberResponse.class))).thenReturn(new MemberResponse());

        List<MemberResponse> response = profileService.addMembers(members, 1L);

        assertNotNull(response);
        assertEquals(1, response.size());
        verify(userRepository, times(1)).save(any(UserEntity.class));
        verify(memberRepository, times(1)).saveAll(anyCollection());
    }

    @Test
    void testDeleteContact() {
        when(memberRepository.findById(anyLong())).thenReturn(Optional.of(member));

        String result = profileService.deleteMember(1L);

        verify(memberRepository, times(1)).deleteById(anyLong());
        assertEquals("deleted successfully", result);
    }


    @Test
    void testUpdateGroupWithContacts() {
        TeamRequest teamRequest = new TeamRequest();
        teamRequest.setName("Updated Name");
        teamRequest.setDescription("Updated Description");
        teamRequest.setAvatar("Updated Avatar");
        teamRequest.setMembers(new HashSet<>(Collections.singletonList(1L)));

        when(teamRepository.findById(anyLong())).thenReturn(Optional.of(team));
        when(memberRepository.findAllById(anyCollection())).thenReturn(Collections.singletonList(member));
        when(modelMapper.map(any(Team.class), eq(TeamResponse.class))).thenReturn(new TeamResponse());

        TeamResponse response = profileService.updateTeamWithMembers(1L, teamRequest);

        assertNotNull(response);
        verify(teamRepository, times(1)).save(any(Team.class));
    }

    @Test
    void testDeleteGroup() {
        when(teamRepository.findById(anyLong())).thenReturn(Optional.of(team));

        profileService.deleteTeam(1L);

        verify(teamRepository, times(1)).deleteById(anyLong());
    }
}
