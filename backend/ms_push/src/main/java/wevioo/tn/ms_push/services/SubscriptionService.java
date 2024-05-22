package wevioo.tn.ms_push.services;

import wevioo.tn.ms_push.entities.WebPushSubscription;

public interface SubscriptionService {
    void saveSubscription(WebPushSubscription subscription);
    void deleteSubscription(Long id);
    WebPushSubscription findByNotificationEndPoint(String notificationEndPoint);
}
