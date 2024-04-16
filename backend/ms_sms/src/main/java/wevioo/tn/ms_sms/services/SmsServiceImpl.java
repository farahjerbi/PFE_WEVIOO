package wevioo.tn.ms_sms.services;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.entities.TwilioProperties;
import wevioo.tn.ms_sms.openFeign.UsersClient;
import wevioo.tn.ms_sms.repositories.SmsRepository;

import java.util.Set;

@Service
@AllArgsConstructor
public class SmsServiceImpl implements SmsService{

    private  final SmsRepository smsRepository;

    private final UsersClient usersClient;
    private final SmsUtils smsUtils;
    private final TwilioProperties twilioProperties;



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

    public String sendSms(SendsSms sendsSms){
        SmsTemplate smsTemplate=smsRepository.findById(sendsSms.getIdTemplate()).orElseThrow(() -> new RuntimeException("SmsTemplate not found with id: " + sendsSms.getIdTemplate()));

        String content = smsUtils.replacePlaceholders(smsTemplate.getContent(),sendsSms.getPlaceholderValues());

        for (String number : sendsSms.getNumbers()) {
            if (!smsUtils.isValidPhoneNumber(number)) {
                return"Invalid phone number: " + number;
            }
        }

        Twilio.init(twilioProperties.getAccountSid(), twilioProperties.getAuthToken());

        sendsSms.getNumbers().parallelStream().forEach(phoneNumber -> {
            Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(twilioProperties.getFromNumber()),
                    content
            ).create();
        });

        return "Message sent successfully";
    }
    }


