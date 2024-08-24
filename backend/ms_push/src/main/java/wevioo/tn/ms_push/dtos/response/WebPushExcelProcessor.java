package wevioo.tn.ms_push.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushMessage;

import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WebPushExcelProcessor {
    private Map<String, String[]> placeholderData;
    private WebPushMessage template;
}
