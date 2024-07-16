package wevioo.tn.ms_sms.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class WhatsAppTemplate extends SmsTemplate implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private boolean allowCategoryChange=false;
    private String name;
    private String language;
    @ManyToOne
    private Structure structure;
    private Category category;
    private Long businessAccountId;
    private String status;
    private String quality;
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> placeholders = new HashSet<>();
}
