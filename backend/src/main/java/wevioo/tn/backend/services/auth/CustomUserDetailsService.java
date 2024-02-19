package wevioo.tn.backend.services.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import wevioo.tn.backend.entities.Role;
import wevioo.tn.backend.entities.UserEntity;
import wevioo.tn.backend.repositories.UserRepository;

import java.util.Collection;
import java.util.Collections;
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("Username not found"));
        Collection<GrantedAuthority> authorities = roleToAuthorities(user.getRole());
        return new User(user.getEmail(),user.getPassword(),authorities);
    }

    private Collection<GrantedAuthority> roleToAuthorities(Role role) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role.toString());
        return Collections.singletonList(authority);
    }
}
