package wevioo.tn.ms_email.dtos.request;

import lombok.Data;

@Data
public class UpdateEmailTemplateRequest {
    private String name;
    private String language;
    private String state;
    private String subject;
    private String content;
}