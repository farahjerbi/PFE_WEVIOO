package wevioo.tn.ms_auth.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMember {
    private Long id;
    private String fullName;
    private String phone;
    private String whatsapp;
    private String email;
    private String auth;
    private String endPoint;
    private String publicKey;
    private Long userId;
    private Set<Long> teamId;
}
