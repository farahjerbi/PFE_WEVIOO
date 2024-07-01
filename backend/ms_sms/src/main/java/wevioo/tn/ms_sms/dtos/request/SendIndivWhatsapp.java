package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;

import java.util.List;

@Data
public class SendIndivWhatsapp {
    private WhatsAppTemplateResponse whatsAppTemplateResponse;
    private List<SendWhatsappSeparately> sendSeparatelyList;

}
