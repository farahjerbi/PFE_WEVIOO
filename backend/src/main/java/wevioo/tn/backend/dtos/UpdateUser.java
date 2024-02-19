package wevioo.tn.backend.dtos;

import lombok.Data;

@Data
public class UpdateUser {
    private String firstName;
    private String lastName;
    private String profession;
    private String github;
    private String twitter;
    private String phone;
    private String address;
    private boolean mfaEnabled;
}
