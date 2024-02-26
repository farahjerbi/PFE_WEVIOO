package wevioo.tn.backend.services.email;

import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.entities.Image;

public interface ImageService {
     Image createImage(Image image , MultipartFile file) ;
     String createAndAssignImageToTemplate(
             Long id, Image image, MultipartFile file, String type);
}
