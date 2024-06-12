package wevioo.tn.ms_auth.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

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
    private String auth;
    private String Endpoint;
    private String publicKey;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Member member = (Member) obj;
        return Objects.equals(id, member.id);
    }
}
