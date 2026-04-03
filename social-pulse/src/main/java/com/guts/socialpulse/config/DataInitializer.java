package com.guts.socialpulse.config;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("seed-data") // Changed from "dev" so it does NOT run automatically. Run with this profile if you explicitly want the seeded data.
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
                    .status(CabinetStatus.ACTIF)
                    .build();
            cabinetRepository.save(demoCabinet);

            User admin = User.builder()
                    .fullName("Admin User")
                    .username("admin")
                    .email("admin@socialpulse.fr")
                    .password(passwordEncoder.encode(initialAdminPassword))
                    .isActive(true)
                    .build();
            admin.addCabinetRole(demoCabinet, Role.ADMIN);
            userRepository.save(admin);

            User cm = User.builder()
                    .fullName("CM User")
                    .username("cm")
                    .email("cm@socialpulse.fr")
                    .password(passwordEncoder.encode(initialCmPassword))
                    .isActive(true)
                    .build();
            cm.addCabinetRole(demoCabinet, Role.CM);
            userRepository.save(cm);
        }
    }
}
