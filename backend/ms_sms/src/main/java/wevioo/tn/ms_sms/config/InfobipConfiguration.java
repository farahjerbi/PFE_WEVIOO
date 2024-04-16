package wevioo.tn.ms_sms.config;

import com.infobip.ApiClient;
import com.infobip.ApiKey;
import com.infobip.BaseUrl;
import lombok.AllArgsConstructor;
import org.springframework.boot.info.InfoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import wevioo.tn.ms_sms.entities.InfobipProperties;

@Configuration
@AllArgsConstructor
public class InfobipConfiguration {

    private final InfobipProperties infobipProperties;
    @Bean
    public ApiClient InfobipApiClient() {
        ApiClient apiClient = ApiClient.forApiKey(ApiKey.from(infobipProperties.getApiKey()))
                .withBaseUrl(BaseUrl.from(infobipProperties.getBaseUrl()))
                .build();
        return apiClient;
    }
}