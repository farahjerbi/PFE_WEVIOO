package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class SendSeparately {
    private String number;
    private Map<String, String> placeholderValues;
}
