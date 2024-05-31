package wevioo.tn.ms_push.dtos.response;


import lombok.Data;
import wevioo.tn.ms_push.entities.WebPushSubscription;

import java.util.Date;
import java.util.List;
@Data
public class ScheduledPushInfo {
    private String jobId;
    private Long templateId;
    private Long userId;
    private List<WebPushSubscription> subscriptions;
    private Date nextTimeFired;
    private String templateName;
    private String username;
}
