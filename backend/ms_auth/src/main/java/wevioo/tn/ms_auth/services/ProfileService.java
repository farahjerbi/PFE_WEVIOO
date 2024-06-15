package wevioo.tn.ms_auth.services;

import wevioo.tn.ms_auth.dtos.requests.*;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;
import wevioo.tn.ms_auth.dtos.responses.TeamResponse;
import wevioo.tn.ms_auth.dtos.responses.UserResponse;
import wevioo.tn.ms_auth.entities.Member;
import wevioo.tn.ms_auth.entities.Team;

import java.util.List;

public interface ProfileService {
    void changePassword(ChangePasswordRequest changePasswordRequest);
    void forgotPassword(ForgotPassword email);
    String deleteProfile(long id);

    UserResponse UpdateProfile(UpdateUser userEntity , Long id );
    List<UserResponse> getAllUsers();
    TeamResponse createTeamWithMembers(TeamRequest teamDto, Long userId);
    MemberResponse addMember(Member member, Long userId);
    MemberResponse updateMember(UpdateMember updatedMember) ;
    String deleteMember(Long id);
    TeamResponse updateTeamWithMembers(Long teamId, TeamRequest teamDto, Long userId);
    void deleteTeam(Long teamId);
}
