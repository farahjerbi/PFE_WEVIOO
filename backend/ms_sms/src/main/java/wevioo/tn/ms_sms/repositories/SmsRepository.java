package wevioo.tn.ms_sms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wevioo.tn.ms_sms.entities.SmsTemplate;

import java.util.List;

public interface SmsRepository extends JpaRepository<SmsTemplate,Long> {

    List<SmsTemplate> findTemplatesByUserFavoriteSmsContains(Long userId);

}
