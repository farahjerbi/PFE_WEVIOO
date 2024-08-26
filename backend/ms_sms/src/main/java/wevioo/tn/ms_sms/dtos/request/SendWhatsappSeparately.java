package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendWhatsappSeparately {
    private String number;
    private List<String> placeholders;
}
