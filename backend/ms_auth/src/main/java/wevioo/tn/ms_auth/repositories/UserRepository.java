package wevioo.tn.ms_auth.repositories;

import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import wevioo.tn.ms_auth.entities.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);
    Boolean existsByEmail(String email);
    @Query("SELECT u FROM UserEntity u JOIN FETCH u.teams WHERE u.id = :id")
    UserEntity findByIdWithTeams(Long id);

}
