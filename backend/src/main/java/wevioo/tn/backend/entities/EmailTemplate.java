package wevioo.tn.backend.entities;

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
public class EmailTemplate implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String language;
    private State state;
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER , orphanRemoval = true)
    @JoinColumn(name = "template_body_id", referencedColumnName = "id")
    private TemplateBody templateBody;
}
