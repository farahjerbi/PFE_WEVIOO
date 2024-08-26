package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendSeparately {
    private String number;
    private Map<String, String> placeholderValues;
}
