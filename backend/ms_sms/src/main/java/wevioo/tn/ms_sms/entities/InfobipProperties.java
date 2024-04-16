package wevioo.tn.ms_sms.entities;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Data
@Component
public class InfobipProperties {
    @Value("${infobip.BASE_URL}")
    private String baseUrl;

    @Value("${infobip.API_KEY}")
    private String apiKey;

}
