package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;

import java.util.List;

@Data
public class SendWhatsAppMsg {
    private WhatsAppTemplateResponse whatsAppTemplateResponse;
    private List<String> numbers;
    private List<String> placeholders;
}
