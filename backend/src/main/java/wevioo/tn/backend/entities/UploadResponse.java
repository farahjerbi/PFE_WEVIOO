package wevioo.tn.backend.entities;

import lombok.Data;

@Data
public class UploadResponse {
    private final String fileName;
    private final String fullName;
    private final String dateOfBirth;
}
