package wevioo.tn.ms_email.dtos.request;

import lombok.Data;
import wevioo.tn.ms_email.entities.State;

@Data
public class UpdateEmailTemplateRequest {
    private String name;
    private String language;
    private State state;
    private String subject;
    private String content;
}