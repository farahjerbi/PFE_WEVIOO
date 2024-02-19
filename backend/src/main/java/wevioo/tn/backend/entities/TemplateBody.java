package wevioo.tn.backend.entities;

import lombok.Data;

@Data
public class TemplateBody {
    private Long id;
    private String subject;
    private String salutation;
    private String introduction;
    private String closing;
    private String signOff;
    private Image signature;
    private Image logo;
    private String infos;
}
