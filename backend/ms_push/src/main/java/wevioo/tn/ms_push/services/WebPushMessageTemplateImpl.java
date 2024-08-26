package wevioo.tn.ms_push.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_push.dtos.request.*;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.entities.WebPushSubscription;
import wevioo.tn.ms_push.repositories.SubscriptionRepository;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;

@Service
@AllArgsConstructor
public class WebPushMessageTemplateImpl implements WebPushMessageTemplate{
    private static final String PUBLIC_KEY = "BOdufZ-xvfmjBHSA8YEl0oVxLbf6wNPgQuHngrjJI1q8rZkMF2x-ZrJ7to0s_jTr8Q9HVDY0pcIfaMTEu1L8XfU";
    private static final String PRIVATE_KEY = "xOGXMLirxOEePoZREJvHvQIciurMQS0SSr16np0eNG0";
    private static final String SUBJECT = "test";
    private SubscriptionRepository subscriptionRepository;
    private ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;
    private final WebPushMessageTemplateRepository webPushMessageTemplateRepository;
    private final WebPushMessageUtil webPushMessageUtil;

    public static final String UNKNOWN_VALUE = "unknown";

    public WebPushMessage createPushTemplate(WebPushMessageAdd s){
        Set<String> placeholders= webPushMessageUtil.extractPlaceholders(s.getMessage());
        WebPushMessage message = new WebPushMessage();
        message.setPlaceholders(placeholders);
        message.setMessage(s.getMessage());
        if(s.getIcon() != null){
        message.setIcon(fileStorageService.storeFile(s.getIcon()));}
        message.setTitle(s.getTitle());
        message.setClickTarget(s.getClickTarget());
        return webPushMessageTemplateRepository.save(message);
    }

    public WebPushMessage updatePushTemplate(WebPushMessageUpdate s,Long id) {
        WebPushMessage webPushMessage = webPushMessageTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WebPushMessage not found with id: " + id));

        Set<String> placeholders = webPushMessageUtil.extractPlaceholders(s.getMessage());
        webPushMessage.setPlaceholders(placeholders);
        webPushMessage.setMessage(s.getMessage());

        if (s.getIcon() != null) {
            String oldIconPath = webPushMessage.getIcon();
            String newIconPath = fileStorageService.storeFile(s.getIcon());

            if (oldIconPath != null) {
                fileStorageService.deleteFile(oldIconPath);
            }

            webPushMessage.setIcon(newIconPath);
        }

        webPushMessage.setTitle(s.getTitle());
        webPushMessage.setClickTarget(s.getClickTarget());

        return webPushMessageTemplateRepository.save(webPushMessage);
    }

    public void deletePushTemplate(Long id) {
        WebPushMessage webPushMessage = webPushMessageTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WebPushMessage not found with id: " + id));
        if (webPushMessage.getIcon() != null) {
            fileStorageService.deleteFile(webPushMessage.getIcon());
        }

        webPushMessageTemplateRepository.deleteById(id);
    }

    public void toggleFavoritePush(Long pushTemplateId, Long userId) {
        WebPushMessage pushTemplate = webPushMessageTemplateRepository.findById(pushTemplateId)
                .orElseThrow(() -> new RuntimeException("pushTemplate not found with id: " + pushTemplateId));

        Set<Long> userFavoriteSMSs = pushTemplate.getUserFavoritePush();
        if (userFavoriteSMSs.contains(userId)) {
            userFavoriteSMSs.removeIf(id -> id.equals(userId));
        } else {
            userFavoriteSMSs.add(userId);
        }

        webPushMessageTemplateRepository.save(pushTemplate);
    }

    public ResponseEntity<String> notifyAll(SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException {
        Security.addProvider(new BouncyCastleProvider());
        if(message.getPlaceholderValues()!=null){
            message.getWebPushMessageTemplate().setMessage(
                    webPushMessageUtil.replacePlaceholders(message.getWebPushMessageTemplate().getMessage(), message.getPlaceholderValues()));
        }
        List<WebPushSubscription> webPushMessages=subscriptionRepository.findAll();
        PushService pushService = new PushService(PUBLIC_KEY, PRIVATE_KEY, SUBJECT);
        for (WebPushSubscription subscription: webPushMessages) {

            Notification notification = new Notification(
                    subscription.getNotificationEndPoint(),
                    subscription.getPublicKey(),
                    subscription.getAuth(),
                    objectMapper.writeValueAsBytes(message));

            pushService.send(notification);
        }

        return ResponseEntity.ok("Notifications sent successfully");
    }
    public ResponseEntity<String>  notify(SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException {
        Security.addProvider(new BouncyCastleProvider());

        if (message.getPlaceholderValues() != null) {
            message.getWebPushMessageTemplate().setMessage(
                    webPushMessageUtil.replacePlaceholders(message.getWebPushMessageTemplate().getMessage(), message.getPlaceholderValues()));
        }

        PushService pushService = new PushService(PUBLIC_KEY, PRIVATE_KEY, SUBJECT);

        for (WebPushSubscription subscription : message.getWebPushSubscriptions()) {
            try {
                validatePublicKey(subscription.getPublicKey());

                validateNotificationEndpoint(subscription.getNotificationEndPoint());

                Notification notification = new Notification(
                        subscription.getNotificationEndPoint(),
                        subscription.getPublicKey(),
                        subscription.getAuth(),
                        objectMapper.writeValueAsBytes(message.getWebPushMessageTemplate()));

                pushService.send(notification);
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (MalformedURLException e) {
                throw new RuntimeException( e.getMessage(), e);
            } catch (Exception e) {
                throw new RuntimeException("Failed to send notification due to unexpected error: " + e.getMessage(), e);
            }
        }

        return ResponseEntity.ok("Notifications sent successfully");
    }

    public ResponseEntity<String>  notifySeparately(SendIndiv message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException {
        Security.addProvider(new BouncyCastleProvider());
        PushService pushService = new PushService(PUBLIC_KEY, PRIVATE_KEY, SUBJECT);

        for (SendSeparately sendSeparately : message.getSendSeparatelyList()) {
            try {
                // Validate public key
                validatePublicKey(sendSeparately.getWebPushSubscriptions().getPublicKey());

                // Validate notification endpoint URL
                validateNotificationEndpoint(sendSeparately.getWebPushSubscriptions().getNotificationEndPoint());

                if (message.getWebPushMessageTemplate() != null) {
                    message.getWebPushMessageTemplate().setMessage(
                            webPushMessageUtil.replacePlaceholders(message.getWebPushMessageTemplate().getMessage(), sendSeparately.getPlaceholderValues())
                    );
                }

                Notification notification = new Notification(
                        sendSeparately.getWebPushSubscriptions().getNotificationEndPoint(),
                        sendSeparately.getWebPushSubscriptions().getPublicKey(),
                        sendSeparately.getWebPushSubscriptions().getAuth(),
                        objectMapper.writeValueAsBytes(message.getWebPushMessageTemplate())
                );

                pushService.send(notification);
            } catch (IllegalArgumentException e) {
                throw e;
            } catch (MalformedURLException e) {
                throw new RuntimeException(e.getMessage(), e);
            } catch (Exception e) {
                throw new RuntimeException("Failed to send notification due to unexpected error: " + e.getMessage(), e);
            }
        }
        return ResponseEntity.ok("Notifications sent successfully");
    }

    private void validatePublicKey(String publicKey) {
        StringBuilder errorMessages = new StringBuilder();

        if (UNKNOWN_VALUE.equals(publicKey) || publicKey.isEmpty()) {
            errorMessages.append("Public key is 'unknown' or empty. ");
        }

        try {
            byte[] decodedKey = Base64.getUrlDecoder().decode(publicKey);
            if (decodedKey.length != 65) {
                errorMessages.append("Public key has incorrect length (should be 65 bytes). ");
            }

        } catch (IllegalArgumentException e) {
            errorMessages.append("Public key is not properly base64url encoded. ");
        }
        if (errorMessages.length() > 0) {
            throw new IllegalArgumentException(errorMessages.toString().trim());
        }
    }

    private void validateNotificationEndpoint(String endpoint) throws MalformedURLException {
        if (endpoint == null || endpoint.isEmpty()) {
            throw new MalformedURLException("Notification endpoint URL is null or empty.");
        }
        try {
            new URL(endpoint);
        } catch (MalformedURLException e) {
            throw new MalformedURLException("Invalid URL format for notification endpoint: " + e.getMessage());
        }

    }
}
