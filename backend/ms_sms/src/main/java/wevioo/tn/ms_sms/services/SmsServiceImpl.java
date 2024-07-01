package wevioo.tn.ms_sms.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.infobip.ApiClient;
import com.infobip.ApiException;
import com.infobip.api.SmsApi;
import com.infobip.model.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.dtos.request.SendIndiv;
import wevioo.tn.ms_sms.dtos.request.SendSeparately;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.repositories.SmsRepository;

import java.util.*;
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
        SmsTemplate smsTemplate= smsRepository.findById(id).orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + id));
        System.out.println("Template before processing: " + smsTemplate);
        System.out.println("Template before processing: " + s);

        smsTemplate.setSubject(s.getSubject());
        smsTemplate.setContent(s.getContent());
        smsTemplate.setLanguage(s.getLanguage());
        smsTemplate.setPlaceholders(smsUtils.extractPlaceholders(s.getContent()));
        return smsRepository.save(smsTemplate);
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

    public void toggleFavoriteSMS(Long smsTemplateId, Long userId) {
        SmsTemplate smsTemplate = smsRepository.findById(smsTemplateId)
                .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + smsTemplateId));

        List<Long> userFavoriteSMSs = smsTemplate.getUserFavoriteSms();
        if (userFavoriteSMSs.contains(userId)) {
            userFavoriteSMSs.removeIf(id -> id.equals(userId));
        } else {
            userFavoriteSMSs.add(userId);
        }

        smsRepository.save(smsTemplate);
    }

    public String sendSmsSeparately(SendIndiv sendsSms) {
        SmsTemplate smsTemplate = smsRepository.findById(sendsSms.getIdTemplate())
                .orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + sendsSms.getIdTemplate()));

        SmsApi smsApi = new SmsApi(infobipApiClient);
        List<SmsTextualMessage> smsMessages = new ArrayList<>();

        for (SendSeparately number : sendsSms.getSendSeparatelyList()) {
            if (!smsUtils.isValidPhoneNumber(number.getNumber())) {
                return "Invalid phone number: " + number.getNumber();
            }
            String content = smsUtils.replacePlaceholders(smsTemplate.getContent(), number.getPlaceholderValues());
            SmsTextualMessage smsTextualMessage = new SmsTextualMessage()
                    .from(smsTemplate.getSubject())
                    .addDestinationsItem(new SmsDestination().to(number.getNumber()))
                    .text(content);
            smsMessages.add(smsTextualMessage);
        }

        SmsAdvancedTextualRequest smsMessageRequest = new SmsAdvancedTextualRequest()
                .messages(smsMessages);

        try {
            SmsResponse smsResponse = smsApi.sendSmsMessage(smsMessageRequest).execute();
            return "Message sent successfully";
        } catch (ApiException apiException) {
            return "Failed to send message: " + apiException.getMessage();
        }
    }



}


