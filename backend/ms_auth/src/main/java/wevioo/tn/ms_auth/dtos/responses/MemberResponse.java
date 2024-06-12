package wevioo.tn.ms_auth.dtos.responses;

import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_auth.entities.Member;

@Data
@NoArgsConstructor
public class MemberResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String whatsapp;
    private String email;
    private String auth;
    private String endpoint;
    private String publicKey;
    private Long userId;
    private Long teamId;

    public MemberResponse(Member member) {
        this.id = member.getId();
        this.fullName = member.getFullName();
        this.phone = member.getPhone();
        this.whatsapp = member.getWhatsapp();
        this.email = member.getEmail();
        this.auth = member.getAuth();
        this.endpoint = member.getEndpoint();
        this.publicKey = member.getPublicKey();
        this.userId = member.getUser().getId();
        this.teamId=member.getTeam().getId();
    }

}
