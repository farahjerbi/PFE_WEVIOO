package wevioo.tn.ms_email.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wevioo.tn.ms_email.entities.EmailTemplate;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplate,Long> {
    @Query("SELECT et FROM EmailTemplate et LEFT JOIN FETCH et.templateBody tb WHERE et.id = :id")
    EmailTemplate findEmailTemplateWithDetails(@Param("id") Long id);

}