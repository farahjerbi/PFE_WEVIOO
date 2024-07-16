package wevioo.tn.ms_sms.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Structure implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Format header;

    @OneToOne
    private Format body;

    @OneToOne
    private Format footer;
    private String type = "TEXT";
}