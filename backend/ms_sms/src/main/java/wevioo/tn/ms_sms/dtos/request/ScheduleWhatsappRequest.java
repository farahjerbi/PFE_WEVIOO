package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
public class ScheduleWhatsappRequest {
    private String[] numbers;
    private Long templateId;
    private String name;
    private String language;
    private String[] placeholders;
    private LocalDateTime dateTime;
    private ZoneId timeZone;
    private Long userId;
}
