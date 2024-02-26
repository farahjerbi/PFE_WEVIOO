package wevioo.tn.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wevioo.tn.backend.entities.EmailTemplate;

import java.util.List;

public interface EmailTemplateRepository extends JpaRepository<EmailTemplate,Long> {
    @Query("SELECT et FROM EmailTemplate et LEFT JOIN FETCH et.templateBody tb LEFT JOIN FETCH tb.signature LEFT JOIN FETCH tb.logo WHERE et.id = :id")
    EmailTemplate findEmailTemplateWithDetails(@Param("id") Long id);

}
