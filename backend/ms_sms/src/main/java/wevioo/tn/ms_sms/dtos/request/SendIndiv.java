package wevioo.tn.ms_sms.dtos.request;

import lombok.Data;

import java.util.List;

@Data
public class SendIndiv {
    private Long idTemplate;
    private List<SendSeparately> sendSeparatelyList;
}
