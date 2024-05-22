package wevioo.tn.ms_push.dtos.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;

import java.util.Map;
import java.util.Set;


@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendPushNotif {
    private WebPushMessage webPushMessageTemplate;
    private Set<WebPushSubscription> webPushSubscriptions;
    private Map<String, String> placeholderValues;

}
