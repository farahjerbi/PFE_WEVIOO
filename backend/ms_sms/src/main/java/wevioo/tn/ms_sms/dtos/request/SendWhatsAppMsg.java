package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class SendWhatsAppMsg {
    private Long idTemplate;
    private List<String> numbers;
    private Set<String> placeholders;
}
