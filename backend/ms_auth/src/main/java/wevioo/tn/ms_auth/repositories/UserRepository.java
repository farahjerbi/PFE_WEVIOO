package wevioo.tn.ms_auth.repositories;

import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import wevioo.tn.ms_auth.entities.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {

    @Query("SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.members m " +
            "LEFT JOIN FETCH m.teams " +
            "WHERE u.email = :email")
    Optional<UserEntity> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM UserEntity u " +
            "LEFT JOIN FETCH u.members m " +
            "LEFT JOIN FETCH m.teams " +
            "WHERE u.id = :id")
    Optional<UserEntity> findById(@Param("id") Long id);
    Boolean existsByEmail(String email);
    @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.members")
    List<UserEntity> findAllWithMembers();


}
