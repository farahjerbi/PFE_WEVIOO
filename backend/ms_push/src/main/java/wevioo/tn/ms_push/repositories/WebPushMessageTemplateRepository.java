package wevioo.tn.ms_push.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wevioo.tn.ms_push.entities.WebPushMessage;

import java.util.List;

public interface WebPushMessageTemplateRepository  extends JpaRepository<WebPushMessage,Long> {
    List<WebPushMessage> findTemplatesByUserFavoritePushContains(Long userId);

}
