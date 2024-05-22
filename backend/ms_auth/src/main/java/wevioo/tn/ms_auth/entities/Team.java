package wevioo.tn.ms_auth.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Table(name="Teams")
@NoArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String avatar;
    @OneToMany(mappedBy = "team")
    private List<Member> members;
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private UserEntity user;
}
