package wevioo.tn.backend.dtos.request;

import lombok.Data;

@Data
public class UpdateTemplateRequest {
    private UpdateEmailTemplateRequest emailTemplate;
    private Object jsonObject;
}