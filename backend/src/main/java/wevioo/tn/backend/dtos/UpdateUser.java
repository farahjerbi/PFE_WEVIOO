package wevioo.tn.backend.dtos;

import lombok.Data;

@Data
public class UpdateUser {
    private String firstName;
    private String lastName;
    private boolean mfaEnabled;
}
