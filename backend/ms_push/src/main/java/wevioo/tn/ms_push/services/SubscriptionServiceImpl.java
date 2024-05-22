package wevioo.tn.ms_push.services;

import lombok.AllArgsConstructor;
import nl.martijndwars.webpush.PushService;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.SubscriptionRepository;

@Service
@AllArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {
//VAPID keys : (Voluntary Application Server Identification)
    /*{
"subject": "mailto: <farah.jeerbi@gmail.com>",
"publicKey": "BOdufZ-xvfmjBHSA8YEl0oVxLbf6wNPgQuHngrjJI1q8rZkMF2x-ZrJ7to0s_jTr8Q9HVDY0pcIfaMTEu1L8XfU",
"privateKey": "xOGXMLirxOEePoZREJvHvQIciurMQS0SSr16np0eNG0"
}*/

    private final SubscriptionRepository subscriptionRepository;

    public void saveSubscription(WebPushSubscription subscription) {
        subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(Long id) {
        subscriptionRepository.deleteById(id);
    }

    public WebPushSubscription findByNotificationEndPoint(String notificationEndPoint) {
        return subscriptionRepository.findByNotificationEndPoint(notificationEndPoint);
    }
}
