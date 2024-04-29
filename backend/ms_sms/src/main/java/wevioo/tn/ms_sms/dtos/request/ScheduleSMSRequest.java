package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
@Data
public class ScheduleSMSRequest {
    private String[] numbers;
    private Long templateId;
    private Map<String,String> placeHolders;
    private LocalDateTime dateTime;
    private ZoneId timeZone;
    private Long userId;
}
