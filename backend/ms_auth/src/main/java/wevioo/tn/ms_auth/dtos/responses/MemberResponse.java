package wevioo.tn.ms_auth.dtos.responses;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_auth.entities.Member;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@AllArgsConstructor
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

}
