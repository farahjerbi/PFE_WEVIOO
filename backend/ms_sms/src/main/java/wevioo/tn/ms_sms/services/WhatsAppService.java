package wevioo.tn.ms_sms.services;


import okhttp3.Response;
import wevioo.tn.ms_sms.dtos.request.SendIndivWhatsapp;
import wevioo.tn.ms_sms.dtos.request.SendWhatsAppMsg;
import wevioo.tn.ms_sms.dtos.request.WhatsAppTemplatePayload;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;

import java.io.IOException;

public interface WhatsAppService {
    Response createWhatsAppTemplate(WhatsAppTemplatePayload payload) throws IOException;
    Response getWhatsAppTemplates() throws IOException;
    Response deleteWhatsAppTemplate(String templateName) throws IOException;
    WhatsAppTemplateResponse getWhatsAppTemplateById(Long id) throws IOException ;
    String sendSmsWhatsApp(SendWhatsAppMsg sendWhatsAppMsg);
    String sendSmsWhatsAppSeparately(SendIndivWhatsapp sendWhatsAppMsg);
}
