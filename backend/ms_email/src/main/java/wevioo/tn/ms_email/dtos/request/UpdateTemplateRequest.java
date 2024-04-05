package wevioo.tn.ms_email.dtos.request;

import lombok.Data;

@Data
public class UpdateTemplateRequest {
    private UpdateEmailTemplateRequest emailTemplate;
    private Object jsonObject;
}