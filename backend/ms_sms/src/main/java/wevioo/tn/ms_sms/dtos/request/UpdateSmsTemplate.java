package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

@Data
public class UpdateSmsTemplate {
    private String name;
    private String subject;
    private String language;
    private String content;
}
