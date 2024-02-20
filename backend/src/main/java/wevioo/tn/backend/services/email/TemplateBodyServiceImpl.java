package wevioo.tn.backend.services.email;

import org.springframework.beans.factory.annotation.Autowired;
import wevioo.tn.backend.entities.TemplateBody;
import wevioo.tn.backend.repositories.TemplateBodyRepository;

public class TemplateBodyServiceImpl implements TemplateBodyService{
    @Autowired
    private TemplateBodyRepository templateBodyRepository;

    public TemplateBody createTemplateBody(TemplateBody templateBody) {
        return templateBodyRepository.save(templateBody);
    }
}
