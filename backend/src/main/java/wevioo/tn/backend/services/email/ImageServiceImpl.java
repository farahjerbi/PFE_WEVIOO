package wevioo.tn.backend.services.email;

import org.springframework.beans.factory.annotation.Autowired;
import wevioo.tn.backend.entities.Image;
import wevioo.tn.backend.repositories.ImageRepository;

public class ImageServiceImpl implements ImageService {
    @Autowired
    private ImageRepository imageRepository;

    public Image createImage(Image image) {
        return imageRepository.save(image);
    }
}
