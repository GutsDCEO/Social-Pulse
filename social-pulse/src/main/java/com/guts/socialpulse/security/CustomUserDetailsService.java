package com.guts.socialpulse.security;

import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // For now, we don't put cabinet-specific roles in UserDetails authorities
        // as the effective role depends on the X-Cabinet-Context header.
        // We'll handle that in the AuthFilter or a custom SecurityContext.
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isActive(),
                true, true, true,
                new ArrayList<>() // Empty authorities initially
        );
    }
}
