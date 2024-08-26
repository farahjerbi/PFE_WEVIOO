package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhatsappExcelProcessor {
    private WhatsAppTemplateResponse whatsAppTemplateResponse;
    private Map<String, List<String>> placeholderData;
}
