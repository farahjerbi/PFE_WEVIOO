package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SendWhatsappSeparately {
    private String number;
    private List<String> placeholders;
}
