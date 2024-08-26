package wevioo.tn.ms_push.services;

import org.jose4j.lang.JoseException;
import org.springframework.http.ResponseEntity;
import wevioo.tn.ms_push.dtos.request.SendIndiv;
import wevioo.tn.ms_push.dtos.request.SendPushNotif;
import wevioo.tn.ms_push.dtos.request.WebPushMessageAdd;
import wevioo.tn.ms_push.dtos.request.WebPushMessageUpdate;
import wevioo.tn.ms_push.entities.WebPushMessage;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.concurrent.ExecutionException;

public interface WebPushMessageTemplate {
    WebPushMessage updatePushTemplate(WebPushMessageUpdate s,Long id);
    WebPushMessage createPushTemplate(WebPushMessageAdd s);
    void deletePushTemplate(Long id);
    void toggleFavoritePush(Long pushTemplateId, Long userId);
    ResponseEntity<String> notifyAll(SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException;
    ResponseEntity<String>  notify(SendPushNotif message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException ;
    ResponseEntity<String>  notifySeparately( SendIndiv message) throws GeneralSecurityException, IOException, JoseException, ExecutionException, InterruptedException;
}
