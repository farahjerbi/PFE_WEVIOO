package wevioo.tn.ms_push.dtos.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushMessage;

import java.util.List;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendIndiv {
    private WebPushMessage webPushMessageTemplate;
    private List<SendSeparately> sendSeparatelyList;
}
