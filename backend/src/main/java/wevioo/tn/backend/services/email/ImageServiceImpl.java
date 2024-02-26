package wevioo.tn.backend.services.email;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import wevioo.tn.backend.entities.EmailTemplate;
import wevioo.tn.backend.entities.Image;
import wevioo.tn.backend.repositories.EmailTemplateRepository;
import wevioo.tn.backend.repositories.ImageRepository;
import wevioo.tn.backend.services.uploadFiles.FileStorageService;

@Service
@AllArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final FileStorageService fileStorageService;
    private final EmailTemplateRepository emailTemplateRepository;

    public Image createImage(Image image, MultipartFile file) {
        image.setValue(fileStorageService.storeFile(file));
        return imageRepository.save(image);
    }

    public String createAndAssignImageToTemplate(
            Long id, Image image, MultipartFile file, String type) {
        EmailTemplate emailTemplate = emailTemplateRepository.findEmailTemplateWithDetails(id);

        if (emailTemplate == null) {
            return "Template Not Found";
        }
        try {

            image.setValue(fileStorageService.storeFile(file));
            imageRepository.save(image);

            if ("signature".equals(type)) {
                emailTemplate.getTemplateBody().setSignature(image);
            } else {
                emailTemplate.getTemplateBody().setLogo(image);
            }

            emailTemplateRepository.save(emailTemplate);
            return "Signature Assigned Successfully";

        } catch (Exception e) {
            if (image.getId() != null) {
                imageRepository.deleteById(image.getId());
            }
            return "Failed to assign signature: " + e.getMessage();
        }

    }
}
