package wevioo.tn.ms_auth.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_auth.dtos.requests.*;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;
import wevioo.tn.ms_auth.dtos.responses.TeamResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.Member;
import wevioo.tn.ms_auth.entities.Team;
import wevioo.tn.ms_auth.entities.UserEntity;
import wevioo.tn.ms_auth.repositories.MemberRepository;
import wevioo.tn.ms_auth.repositories.TeamRepository;
import wevioo.tn.ms_auth.repositories.UserRepository;

import java.util.*;

@Service
@AllArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final FileStorageService fileStorageService;
    private final TeamRepository teamRepository;
    private final MemberRepository memberRepository;





    public void changePassword(ChangePasswordRequest request ) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }


    public void forgotPassword(ForgotPassword forgotPassword){
        UserEntity user = userRepository.findByEmail(forgotPassword.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!forgotPassword.getNewPassword().equals(forgotPassword.getConfirmNewPassword())) {
            throw new IllegalStateException("Passwords do not match");
        }
        user.setPassword(passwordEncoder.encode(forgotPassword.getNewPassword()));

        userRepository.save(user);
    }


    public UserResponse UpdateProfile(UpdateUser userEntity , Long id){
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        user.setLastName(userEntity.getLastName());
        user.setFirstName(userEntity.getFirstName());
        user.setEmailSecret(userEntity.getEmailSecret());
        if (userEntity.getSignature() != null) {
            String oldIconPath = user.getSignature();
            String newIconPath = fileStorageService.storeFile(userEntity.getSignature());

            if (oldIconPath != null) {
                fileStorageService.deleteFile(oldIconPath);
            }

            user.setSignature(newIconPath);
        }
        userRepository.save(user);

        return modelMapper.map(user, UserResponse.class);
    }



    public  String deleteProfile(long id){
        userRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        userRepository.deleteById(id);

        return "User deleted successfully";
    }


    public List<UserResponse> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();

        for (UserEntity user : users) {
            UserResponse userResponse = modelMapper.map(user, UserResponse.class);
            userResponses.add(userResponse);
        }

        return userResponses;
    }


    @Transactional
    public TeamResponse createTeamWithMembers(TeamRequest teamDto, Long userId) {
        Team team = new Team();
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());
        team.setAvatar(teamDto.getAvatar());
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));
        team.setUserTeam(user);

        Set<Member> members = new HashSet<>(memberRepository.findAllById(teamDto.getMembers()));
        team.setMembers(members);

        for (Member member : members) {
            member.getTeams().add(team);
        }

        team = teamRepository.save(team);
        memberRepository.saveAll(members);
        TeamResponse teamResponse = modelMapper.map(team, TeamResponse.class);

        return teamResponse;
    }
    @Transactional
    public MemberResponse addMember(Member member, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Set<Member> members = user.getMembers();
        if (members == null) {
            members = new HashSet<>();
        }

        members.add(member);
        user.setMembers(members);
        member.setUser(user);

        memberRepository.save(member);
        userRepository.save(user);
        MemberResponse memberResponse = modelMapper.map(member, MemberResponse.class);

        return memberResponse;
    }


    @Transactional
    public String deleteMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId));

        for (Team team : member.getTeams()) {
            team.getMembers().remove(member);
        }

        member.getTeams().clear();

        memberRepository.deleteById(memberId);
        return "deleted successfully";
    }

    @Transactional
    public MemberResponse updateMember(UpdateMember updatedMember) {
        Member existingMember = memberRepository.findById(updatedMember.getId())
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + updatedMember.getId()));

        UserEntity user = userRepository.findById(updatedMember.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + updatedMember.getUserId()));
        existingMember.setUser(user);

        existingMember.getTeams().clear();
        if (updatedMember.getTeamId() != null && !updatedMember.getTeamId().isEmpty()) {
            for (Long teamId : updatedMember.getTeamId()) {
                Team team = teamRepository.findById(teamId)
                        .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + teamId));
                existingMember.getTeams().add(team);
            }
        }

        modelMapper.map(updatedMember, existingMember);

        memberRepository.save(existingMember);

        MemberResponse memberResponse = modelMapper.map(existingMember, MemberResponse.class);
        memberResponse.setTeamId(updatedMember.getTeamId());
        return memberResponse;
    }

    @Transactional
    public TeamResponse updateTeamWithMembers(Long teamId, TeamRequest teamDto, Long userId) {
        Team existingTeam = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + teamId));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        updateTeamFields(existingTeam, teamDto, user);

        Set<Member> newMembers = new HashSet<>(memberRepository.findAllById(teamDto.getMembers()));
        updateMemberTeams(existingTeam, newMembers);

        teamRepository.save(existingTeam);

        return modelMapper.map(existingTeam, TeamResponse.class);
    }

    private void updateTeamFields(Team team, TeamRequest teamDto, UserEntity user) {
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());
        team.setAvatar(teamDto.getAvatar());
        team.setUserTeam(user);
    }

    private void updateMemberTeams(Team team, Set<Member> newMembers) {
        Set<Member> currentMembers = team.getMembers();

        currentMembers.stream()
                .filter(member -> !newMembers.contains(member))
                .forEach(member -> member.getTeams().remove(team));

        newMembers.forEach(member -> member.getTeams().add(team));

        team.setMembers(newMembers);

        memberRepository.saveAll(currentMembers);
        memberRepository.saveAll(newMembers);
    }

    @Transactional
    public void deleteTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found with id: " + teamId));

        for (Member member : team.getMembers()) {
            member.getTeams().remove(team);
            memberRepository.save(member);
        }

        team.getMembers().clear();
        teamRepository.delete(team);
    }

}
