package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;
import wevioo.tn.ms_sms.entities.Category;
import wevioo.tn.ms_sms.entities.Language;
import wevioo.tn.ms_sms.entities.Structure;

@Data
public class WhatsAppTemplatePayload {
    private boolean allowCategoryChange;
    private String name;
    private String language;
    private Structure structure;
    private Category category;
}
