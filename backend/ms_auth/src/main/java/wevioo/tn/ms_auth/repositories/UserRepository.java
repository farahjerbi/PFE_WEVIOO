package wevioo.tn.ms_auth.repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import wevioo.tn.ms_auth.entities.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.teams t " +
            "LEFT JOIN FETCH t.members " +
            "WHERE u.id = :userId")
    UserEntity findByIdWithTeamsAndMembers(@Param("userId") Long userId);
}
