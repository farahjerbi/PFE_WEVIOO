package wevioo.tn.backend.entities;

import lombok.Data;

@Data
public class EmailTemplate {
    private Long id;
    private String name;
    private String language;
    private State state;
    private EmailTemplate details;
}
