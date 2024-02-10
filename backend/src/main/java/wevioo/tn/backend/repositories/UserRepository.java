package wevioo.tn.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wevioo.tn.backend.entities.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    Optional<UserEntity> findByEmail(String email);
    Boolean existsByEmail(String email);

}
