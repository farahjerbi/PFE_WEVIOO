package wevioo.tn.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wevioo.tn.backend.entities.Image;

public interface ImageRepository  extends JpaRepository<Image,Long> {
}
