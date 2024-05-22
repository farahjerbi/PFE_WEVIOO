package wevioo.tn.ms_push.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_push.dtos.request.WebPushMessageAdd;
import wevioo.tn.ms_push.dtos.request.WebPushMessageUpdate;
import wevioo.tn.ms_push.entities.WebPushMessage;
import wevioo.tn.ms_push.repositories.WebPushMessageTemplateRepository;

import java.util.Set;

@Service
@AllArgsConstructor
public class WebPushMessageTemplateImpl implements WebPushMessageTemplate{

    private final FileStorageService fileStorageService;
    private final WebPushMessageTemplateRepository webPushMessageTemplateRepository;
    private final WebPushMessageUtil webPushMessageUtil;


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


}
