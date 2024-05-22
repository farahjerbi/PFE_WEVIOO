package wevioo.tn.ms_auth.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Members")
@NoArgsConstructor
@Data
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String phone;
    private String whatsapp;
    private String email;
    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;
}
