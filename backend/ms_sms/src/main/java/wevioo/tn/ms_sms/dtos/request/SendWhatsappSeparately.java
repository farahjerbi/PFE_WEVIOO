package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class SendWhatsappSeparately {
    private String number;
    private List<String> placeholders;
}
