package wevioo.tn.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class TemplateBody implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subject;
    @Column(columnDefinition = "TEXT")
    private String content;
    @JsonIgnore
    @OneToOne(mappedBy = "templateBody")
    private EmailTemplate emailTemplate;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER , orphanRemoval = true)
    @JoinColumn(name = "signature_id")
    private Image signature;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER , orphanRemoval = true)
    @JoinColumn(name = "logo_id")
    private Image logo;

}
