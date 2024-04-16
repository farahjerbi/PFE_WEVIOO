package wevioo.tn.ms_sms.services;

import com.infobip.ApiClient;
import com.infobip.ApiException;
import com.infobip.api.SmsApi;
import com.infobip.api.WhatsAppApi;
import com.infobip.model.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.repositories.SmsRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SmsServiceImpl implements SmsService{

    private  final SmsRepository smsRepository;

    private final UsersClient usersClient;
    private final SmsUtils smsUtils;
    private final ApiClient infobipApiClient;



    public SmsTemplate createSmsTemplate(SmsTemplate s){
        Set<String> placeholders= smsUtils.extractPlaceholders(s.getContent());
        s.setPlaceholders(placeholders);
        return smsRepository.save(s);
    }


    public SmsTemplate updateSmsTemplate(UpdateSmsTemplate s, Long id) {
        return smsRepository.findById(id)
                .map(smsTemplate -> {
                    smsTemplate.setName(s.getName());
                    smsTemplate.setLanguage(s.getLanguage());
                    smsTemplate.setContent(s.getContent());
                    smsTemplate.setSubject(s.getSubject());
                    smsTemplate.setPlaceholders(smsUtils.extractPlaceholders(s.getContent()));
                    return smsRepository.save(smsTemplate);
                })
                .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + id));
    }

    public void deleteSmsTemplate(Long id){
         smsRepository.deleteById(id);
    }

    public String sendSms(SendsSms sendsSms) {
        SmsTemplate smsTemplate = smsRepository.findById(sendsSms.getIdTemplate())
                .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + sendsSms.getIdTemplate()));

        String content = smsUtils.replacePlaceholders(smsTemplate.getContent(), sendsSms.getPlaceholderValues());

        for (String number : sendsSms.getNumbers()) {
            if (!smsUtils.isValidPhoneNumber(number)) {
                return "Invalid phone number: " + number;
            }
        }

        SmsApi smsApi = new SmsApi(infobipApiClient);

        List<SmsTextualMessage> smsMessages = sendsSms.getNumbers().stream()
                .map(number -> new SmsTextualMessage()
                        .from(smsTemplate.getSubject())
                        .addDestinationsItem(new SmsDestination().to(number))
                        .text(content))
                .collect(Collectors.toList());

        SmsAdvancedTextualRequest smsMessageRequest = new SmsAdvancedTextualRequest()
                .messages(smsMessages);

        try {
            SmsResponse smsResponse = smsApi.sendSmsMessage(smsMessageRequest).execute();
            return "Message sent successfully";
        } catch (ApiException apiException) {
            return "Failed to send message: " + apiException.getMessage();
        }
    }

    public String sendSmsWhatsApp(SendsSms sendsSms) {
        WhatsAppApi whatsAppApi = new WhatsAppApi(infobipApiClient);
        SmsTemplate smsTemplate = smsRepository.findById(sendsSms.getIdTemplate())
                .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + sendsSms.getIdTemplate()));

        for (String number : sendsSms.getNumbers()) {
            if (!smsUtils.isValidPhoneNumber(number)) {
                return "Invalid phone number: " + number;
            }
        }
        String content = smsUtils.replacePlaceholders(smsTemplate.getContent(), sendsSms.getPlaceholderValues());

        try {
            for (String number : sendsSms.getNumbers()) {
                WhatsAppTextMessage textMessage = new WhatsAppTextMessage()
                        .from("447860099299")
                        .to(number)
                        .content(new WhatsAppTextContent()
                                .text(content)
                        );
                WhatsAppSingleMessageInfo messageInfo =whatsAppApi.sendWhatsAppTextMessage(textMessage).execute();
                System.out.println(messageInfo.getStatus().getDescription());

            }
            return "WhatsApp messages sent successfully";
        } catch (Exception e) {
            return "Failed to send WhatsApp messages: " + e.getMessage();
        }
    }

    }


