package wevioo.tn.ms_sms.services;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import okhttp3.Response;
import wevioo.tn.ms_sms.dtos.request.WhatsAppTemplatePayload;

import java.io.IOException;

public interface WhatsAppService {
    Response createWhatsAppTemplate(WhatsAppTemplatePayload payload) throws IOException;
    Response getWhatsAppTemplates() throws IOException;
    Response deleteWhatsAppTemplate(String templateName) throws IOException;
}
