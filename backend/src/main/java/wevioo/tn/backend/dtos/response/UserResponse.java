package wevioo.tn.backend.dtos.response;

import lombok.Data;
@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;

}
