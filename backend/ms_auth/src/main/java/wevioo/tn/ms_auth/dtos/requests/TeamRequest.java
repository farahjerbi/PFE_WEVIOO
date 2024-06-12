package wevioo.tn.ms_auth.dtos.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_auth.dtos.responses.MemberResponse;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamRequest {
    private String name;
    private String description;
    private String avatar;
    private Set<Long> members;
}
