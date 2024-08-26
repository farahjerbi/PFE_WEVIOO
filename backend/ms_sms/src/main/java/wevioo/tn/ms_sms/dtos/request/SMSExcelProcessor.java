package wevioo.tn.ms_sms.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_sms.entities.SmsTemplate;

import java.util.List;
import java.util.Map;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SMSExcelProcessor {
    private SmsTemplate smsTemplate;
    Map<String, List<String>> placeholderData;
}
