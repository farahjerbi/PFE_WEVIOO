package wevioo.tn.ms_sms.services;


import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.entities.SmsTemplate;


public interface SmsService {
    SmsTemplate createSmsTemplate(SmsTemplate s);
    void deleteSmsTemplate(Long id);
    SmsTemplate updateSmsTemplate(UpdateSmsTemplate s, Long id);
    String sendSms(SendsSms sendsSms);
    void toggleFavoriteSMS(Long smsTemplateId, Long userId);
}
