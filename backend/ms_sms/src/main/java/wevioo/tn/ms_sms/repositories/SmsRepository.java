package wevioo.tn.ms_sms.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wevioo.tn.ms_sms.entities.SmsTemplate;

import java.util.List;
import java.util.Optional;

public interface SmsRepository extends JpaRepository<SmsTemplate,Long> {

    List<SmsTemplate> findTemplatesByUserFavoriteSmsContains(Long userId);

    @Query("SELECT t FROM SmsTemplate t LEFT JOIN FETCH t.placeholders WHERE t.id = :id")
    Optional<SmsTemplate> findByIdWithPlaceholders(@Param("id") Long id);


}
