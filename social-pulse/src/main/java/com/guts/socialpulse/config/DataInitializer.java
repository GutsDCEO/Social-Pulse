package com.guts.socialpulse.config;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CabinetRepository cabinetRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.initial-admin-password:admin123}")
    private String initialAdminPassword;

    @Value("${app.security.initial-cm-password:cm123}")
    private String initialCmPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            Cabinet demoCabinet = Cabinet.builder()
                    .name("Cabinet Stagiaire & Associés")
                    .barreau("Barreau de Paris")
                    .status("ACTIF")
                    .build();
            cabinetRepository.save(demoCabinet);

            User admin = User.builder()
                    .fullName("Admin User")
                    .username("admin")
                    .email("admin@socialpulse.fr")
                    .password(passwordEncoder.encode(initialAdminPassword))
                    .isActive(true)
                    .build();
            admin.getCabinetRoles().put(demoCabinet, Role.ADMIN);
            userRepository.save(admin);
            
            User cm = User.builder()
                    .fullName("CM User")
                    .username("cm")
                    .email("cm@socialpulse.fr")
                    .password(passwordEncoder.encode(initialCmPassword))
                    .isActive(true)
                    .build();
            cm.getCabinetRoles().put(demoCabinet, Role.CM);
            userRepository.save(cm);
        }
    }
}
