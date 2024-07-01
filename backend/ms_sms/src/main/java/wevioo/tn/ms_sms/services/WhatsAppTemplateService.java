package wevioo.tn.ms_sms.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.infobip.ApiClient;
import com.infobip.api.WhatsAppApi;
import com.infobip.model.*;
import lombok.AllArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.dtos.request.SendIndivWhatsapp;
import wevioo.tn.ms_sms.dtos.request.SendWhatsAppMsg;
import wevioo.tn.ms_sms.dtos.request.SendWhatsappSeparately;
import wevioo.tn.ms_sms.dtos.request.WhatsAppTemplatePayload;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;

import java.io.IOException;

@AllArgsConstructor
@Service
public class WhatsAppTemplateService implements WhatsAppService {

    private final OkHttpClient client;
    private final ApiClient infobipApiClient;
    private final SmsUtils smsUtils;
    private final ObjectMapper objectMapper = new ObjectMapper();




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
                .url("https://3glv2v.api.infobip.com/whatsapp/2/senders/447860099299/templates")
                .get()
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e")
                .addHeader("Accept", "application/json")
                .build();
        return client.newCall(request).execute();
    }

    public WhatsAppTemplateResponse getWhatsAppTemplateById(Long id) throws IOException {
        String url = String.format("https://3glv2v.api.infobip.com/whatsapp/2/senders/447860099299/templates/%s", id);
        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e")
                .addHeader("Accept", "application/json")
                .build();
        Response response = client.newCall(request).execute();
        if (response.isSuccessful()) {
            String responseBody = response.body().string();
            return objectMapper.readValue(responseBody, WhatsAppTemplateResponse.class);
        } else {
            throw new IOException("Failed to fetch WhatsApp template. Response code: " + response.code());
        }
    }

    public Response deleteWhatsAppTemplate(String templateName) throws IOException {
        String url = String.format("https://3glv2v.api.infobip.com/whatsapp/2/senders/447860099299/templates/%s", templateName);

        Request request = new Request.Builder()
                .url(url)
                .delete()
                .addHeader("Authorization", "App adb55098fdf3453812bd4bf8dc673dee-61018e95-be7c-4251-8d9f-ae46e940369e")
                .build();

        return client.newCall(request).execute();
    }
    public String sendSmsWhatsApp(SendWhatsAppMsg sendWhatsAppMsg) {
        WhatsAppApi whatsAppApi = new WhatsAppApi(infobipApiClient);

         for (String number : sendWhatsAppMsg.getNumbers()) {
            if (!smsUtils.isValidPhoneNumber(number)) {
                return "Invalid phone number: " + number;
            }
        }

        try {
            WhatsAppTemplateBodyContent bodyContent = new WhatsAppTemplateBodyContent();
            for (String placeholder : sendWhatsAppMsg.getPlaceholders()) {
                bodyContent.addPlaceholdersItem(placeholder);
            }
            for (String number : sendWhatsAppMsg.getNumbers()) {
                WhatsAppMessage message = new WhatsAppMessage()
                        .from("447860099299")
                        .to(number)
                        .content(new WhatsAppTemplateContent()
                                .language(sendWhatsAppMsg.getWhatsAppTemplateResponse().getLanguage())
                                .templateName(sendWhatsAppMsg.getWhatsAppTemplateResponse().getName())
                                .templateData(new WhatsAppTemplateDataContent()
                                        .body(bodyContent)
                                )
                        );

                WhatsAppBulkMessage bulkMessage = new WhatsAppBulkMessage()
                        .addMessagesItem(message);
                WhatsAppBulkMessageInfo messageInfo = whatsAppApi
                        .sendWhatsAppTemplateMessage(bulkMessage)
                        .execute();
                System.out.println(messageInfo.getMessages().get(0).getStatus().getDescription());
            }
            return "WhatsApp messages sent successfully";
        } catch (Exception e) {
            return "Failed to send WhatsApp messages: " + e.getMessage();
        }
    }

    public String sendSmsWhatsAppSeparately(SendIndivWhatsapp sendWhatsAppMsg) {
        WhatsAppApi whatsAppApi = new WhatsAppApi(infobipApiClient);

        try {
            WhatsAppTemplateBodyContent bodyContent = new WhatsAppTemplateBodyContent();
            for (SendWhatsappSeparately number : sendWhatsAppMsg.getSendSeparatelyList()) {
                for (String placeholder : number.getPlaceholders()) {
                    bodyContent.addPlaceholdersItem(placeholder);
                }
                WhatsAppMessage message = new WhatsAppMessage()
                        .from("447860099299")
                        .to(number.getNumber())
                        .content(new WhatsAppTemplateContent()
                                .language(sendWhatsAppMsg.getWhatsAppTemplateResponse().getLanguage())
                                .templateName(sendWhatsAppMsg.getWhatsAppTemplateResponse().getName())
                                .templateData(new WhatsAppTemplateDataContent()
                                        .body(bodyContent)
                                )
                        );

                WhatsAppBulkMessage bulkMessage = new WhatsAppBulkMessage()
                        .addMessagesItem(message);
                WhatsAppBulkMessageInfo messageInfo = whatsAppApi
                        .sendWhatsAppTemplateMessage(bulkMessage)
                        .execute();
                System.out.println(messageInfo.getMessages().get(0).getStatus().getDescription());
            }
            return "WhatsApp messages sent successfully";
        } catch (Exception e) {
            return "Failed to send WhatsApp messages: " + e.getMessage();
        }
    }


}
