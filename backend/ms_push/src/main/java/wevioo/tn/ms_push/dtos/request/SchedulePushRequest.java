package wevioo.tn.ms_push.dtos.request;

import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushSubscription;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Map;
import java.util.Set;

@Data
public class SchedulePushRequest {
    private Set<WebPushSubscription> webPushSubscriptions;
    private Long templateId;
    private String name;
    private Map<String,String> placeHolders;
    private LocalDateTime dateTime;
    private ZoneId timeZone;
    private Long userId;
}
