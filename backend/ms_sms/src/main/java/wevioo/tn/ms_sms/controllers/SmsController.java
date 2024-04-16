package wevioo.tn.ms_sms.controllers;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wevioo.tn.ms_sms.dtos.request.SendsSms;
import wevioo.tn.ms_sms.dtos.request.UpdateSmsTemplate;
import wevioo.tn.ms_sms.entities.SmsTemplate;
import wevioo.tn.ms_sms.services.SmsService;
import wevioo.tn.ms_sms.services.SmsUtils;

@RestController
@RequestMapping("/apiSms")
@AllArgsConstructor
public class SmsController {

    private final SmsService smsService;
    private final SmsUtils smsUtils;

    @PostMapping(value = "/addSmsTemplate")
    public ResponseEntity<SmsTemplate> createEmailTemplate(@RequestBody SmsTemplate smsTemplate) {
        SmsTemplate createdEmailTemplate = smsService.createSmsTemplate(smsTemplate);
        return ResponseEntity.ok(createdEmailTemplate);
    }

    @DeleteMapping(value = "/deleteSmsTemplate/{id}")
    public ResponseEntity deleteTemplateSms(@PathVariable Long id) {
            smsService.deleteSmsTemplate(id);
        return ResponseEntity.ok("Template deleted successfully");
    }

    @PutMapping("/updateSmsTemplate/{id}")
    public ResponseEntity<SmsTemplate> updateSmsTemplate(@RequestBody UpdateSmsTemplate updateDto, @PathVariable Long id) {
        SmsTemplate updatedTemplate = smsService.updateSmsTemplate(updateDto, id);
        return ResponseEntity.ok(updatedTemplate);
    }


    @PostMapping(value = "/sendSMS")
    public String sendSMS(@RequestBody SendsSms sendsSms) {
        return smsService.sendSms(sendsSms);
    }

    @PostMapping(value = "/sendWhatsAppSms")
    public String sendSMSWhatsApp(@RequestBody SendsSms sendsSms) {
        return smsService.sendSmsWhatsApp(sendsSms);
    }


}

