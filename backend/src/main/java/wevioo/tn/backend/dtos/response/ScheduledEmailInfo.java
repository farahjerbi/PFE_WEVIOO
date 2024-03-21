package wevioo.tn.backend.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledEmailInfo {
    private String jobId;
    private Long templateId;
    private String templateName;
    private String username;
    private Long userId;
    private String requestBody;
    private  String[]  recipients;
    private  String[]  cc;
    private String replyTo;
    private String addSignature;
    private Date nextTimeFired;

}