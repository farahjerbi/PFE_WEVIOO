package wevioo.tn.ms_sms.entities;

import lombok.Data;

import java.util.Optional;
@Data
public class Structure {
    private Format header;
    private Format body;
    private Format footer;
    private String type;
}
