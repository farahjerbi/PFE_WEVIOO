package wevioo.tn.ms_email.dtos.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;

@Data
public class ScheduleEmailRequest {
    private String[] recipients;
    private String[] cc;

    private Long templateId;

    private Map<String,String> placeHolders;

    private LocalDateTime dateTime;

    private ZoneId timeZone;
    private String replyTo;
    private String addSignature;
    private Long userId;

}