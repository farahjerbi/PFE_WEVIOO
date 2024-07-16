package wevioo.tn.ms_sms.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import wevioo.tn.ms_sms.entities.Category;
import wevioo.tn.ms_sms.entities.Structure;

import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhatsAppTemplateResponse {
    private Long id;
    private boolean allowCategoryChange;
    private String name;
    private String language;
    private Structure structure;
    private Category category;
    private Long businessAccountId;
    private String status;
    private String quality;
    private Set<String> placeholders;

    public WhatsAppTemplateResponse(String en, String test_template) {
    }
}
