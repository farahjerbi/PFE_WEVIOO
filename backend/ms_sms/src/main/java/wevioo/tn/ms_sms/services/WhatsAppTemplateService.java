package wevioo.tn.ms_sms.services;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import lombok.AllArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.dtos.request.WhatsAppTemplatePayload;

import java.io.IOException;

@AllArgsConstructor
@Service
public class WhatsAppTemplateService implements WhatsAppService {

    private final OkHttpClient client;

    public Response createWhatsAppTemplate(WhatsAppTemplatePayload payload) throws IOException {
        MediaType mediaType = MediaType.parse("application/json");
        RequestBody body = RequestBody.create(mediaType, new Gson().toJson(payload));
        Request request = new Request.Builder()
                .url("https://3glv2v.api.infobip.com/whatsapp/2/senders/21695372490/templates")
                .method("POST", body)
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e") // Use the injected authorization string directly
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept", "application/json")
                .build();
        return client.newCall(request).execute();
    }



    public Response getWhatsAppTemplates() throws IOException {
        Request request = new Request.Builder()
                .url("https://3glv2v.api.infobip.com/whatsapp/2/senders/21695372490/templates")
                .get()
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e")
                .addHeader("Accept", "application/json")
                .build();
        return client.newCall(request).execute();
    }

    public Response deleteWhatsAppTemplate(String templateName) throws IOException {
        String url = String.format("https://3glv2v.api.infobip.com/whatsapp/2/senders/21695372490/templates/%s", templateName);

        Request request = new Request.Builder()
                .url(url)
                .delete()
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e")
                .build();

        return client.newCall(request).execute();
    }

}
