package wevioo.tn.ms_push.dtos.request;

import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushSubscription;

import java.util.Map;

@Data
public class SendSeparately {
    private WebPushSubscription webPushSubscriptions;
    private Map<String, String> placeholderValues;
}
