package wevioo.tn.ms_sms.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledSMSInfo {
    private String jobId;
    private Long templateId;
    private String templateName;
    private String username;
    private Long userId;
    private  String[]  numbers;
    private Date nextTimeFired;
}
