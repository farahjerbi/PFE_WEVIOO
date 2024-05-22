package wevioo.tn.ms_push.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wevioo.tn.ms_push.entities.WebPushSubscription;

public interface SubscriptionRepository extends JpaRepository<WebPushSubscription,Long> {
    WebPushSubscription findByNotificationEndPoint(String notificationEndPoint);
}
