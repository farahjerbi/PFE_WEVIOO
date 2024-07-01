package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.util.Map;

@Data
public class SendSeparately {
    private String number;
    private Map<String, String> placeholderValues;
}
