package wevioo.tn.ms_sms.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;


@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Format implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String format;
    private String text;
    @OneToOne(mappedBy = "header")
    private Structure structureHeader;

    @OneToOne(mappedBy = "body")
    private Structure structureBody;

    @OneToOne(mappedBy = "footer")
    private Structure structureFooter;
}