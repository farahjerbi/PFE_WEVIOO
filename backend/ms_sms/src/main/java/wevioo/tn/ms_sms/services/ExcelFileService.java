package wevioo.tn.ms_sms.services;

import org.springframework.stereotype.Service;


import java.util.*;


import wevioo.tn.ms_sms.dtos.request.SendIndiv;
import wevioo.tn.ms_sms.dtos.request.SendIndivWhatsapp;
import wevioo.tn.ms_sms.dtos.request.SendSeparately;
import wevioo.tn.ms_sms.dtos.request.SendWhatsappSeparately;
import wevioo.tn.ms_sms.dtos.response.WhatsAppTemplateResponse;
import wevioo.tn.ms_sms.entities.SmsTemplate;


@Service
public class ExcelFileService {
    public SendIndiv generateSendSeparatelyList(Map<String, List<String>> placeholderData, SmsTemplate template) {
        int rowCount = placeholderData.values().stream().findFirst().map(List::size).orElse(0);
        List<SendSeparately> sendSeparatelyList = new ArrayList<>();

        for (int i = 0; i < rowCount; i++) {
            Map<String, String> row = new HashMap<>();
            boolean isUnknown = false;

            for (String placeholder : template.getPlaceholders()) {
                String value = placeholderData.getOrDefault(placeholder.toLowerCase(), Collections.emptyList()).get(i);
                row.put(placeholder, value);

                if ("unknown".equalsIgnoreCase(value)) {
                    isUnknown = true;
                }
            }

            String number = placeholderData.getOrDefault("phone", Collections.emptyList()).get(i);
            if ("unknown".equalsIgnoreCase(number)) {
                isUnknown = true;
            }

            if (!isUnknown) {
                SendSeparately sendSeparately = new SendSeparately();
                sendSeparately.setNumber(number);
                sendSeparately.setPlaceholderValues(row);
                sendSeparatelyList.add(sendSeparately);
            }
        }

        SendIndiv sendIndiv = new SendIndiv();
        sendIndiv.setIdTemplate(template.getId());
        sendIndiv.setSendSeparatelyList(sendSeparatelyList);
        return sendIndiv;
    }

    public SendIndivWhatsapp generateSendSeparatelyListWhatsapp(Map<String, List<String>> placeholderData, WhatsAppTemplateResponse templateWhatsapp) {
        int rowCount = placeholderData.values().stream().findFirst().map(List::size).orElse(0);
        List<SendWhatsappSeparately> sendSeparatelyList = new ArrayList<>();

        for (int i = 0; i < rowCount; i++) {
            Map<String, String> row = new HashMap<>();
            boolean isUnknown = false;

            for (String placeholder : templateWhatsapp.getPlaceholders()) {
                String value = placeholderData.getOrDefault(placeholder.toLowerCase(), Collections.emptyList()).get(i);
                row.put(placeholder, value);

                if ("unknown".equalsIgnoreCase(value)) {
                    isUnknown = true;
                }
            }

            String number = placeholderData.getOrDefault("whatsapp", Collections.emptyList()).get(i);
            if ("unknown".equalsIgnoreCase(number)) {
                isUnknown = true;
            }

                SendWhatsappSeparately sendSeparately = new SendWhatsappSeparately();
                sendSeparately.setNumber(number);
                sendSeparately.setPlaceholders(new ArrayList<>(row.values()));
                sendSeparatelyList.add(sendSeparately);

        }

        SendIndivWhatsapp sendIndivWhatsapp = new SendIndivWhatsapp();
        sendIndivWhatsapp.setWhatsAppTemplateResponse(templateWhatsapp);
        sendIndivWhatsapp.setSendSeparatelyList(sendSeparatelyList);
        return sendIndivWhatsapp;
    }


}
