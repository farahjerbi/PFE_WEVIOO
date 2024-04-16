package wevioo.tn.ms_sms.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class SmsTemplate implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String subject;
    private String language;
    private String content;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<Long> userFavoriteSms = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<String> placeholders = new HashSet<>();
}
