package wevioo.tn.ms_push.dtos.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class SchedulePushResponse {
    private boolean success;
    private String jobId;

    public SchedulePushResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    private String jobGroup;
    private String message;
}
