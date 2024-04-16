package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.util.List;
import java.util.Map;
@Data
public class SendsSms {
    private Long idTemplate;
    private List<String> numbers;
    private Map<String, String> placeholderValues;
}
