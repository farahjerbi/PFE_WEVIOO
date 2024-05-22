package wevioo.tn.ms_auth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wevioo.tn.ms_auth.entities.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member,Long> {
}
