package wevioo.tn.ms_push.services;

import wevioo.tn.ms_push.dtos.request.WebPushMessageAdd;
import wevioo.tn.ms_push.dtos.request.WebPushMessageUpdate;
import wevioo.tn.ms_push.entities.WebPushMessage;

public interface WebPushMessageTemplate {
    WebPushMessage updatePushTemplate(WebPushMessageUpdate s,Long id);
    WebPushMessage createPushTemplate(WebPushMessageAdd s);
    void deletePushTemplate(Long id);
    void toggleFavoritePush(Long pushTemplateId, Long userId);
}
