package com.guts.socialpulse.service;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;
import com.guts.socialpulse.exception.CabinetNotFoundException;
import com.guts.socialpulse.exception.DuplicateResourceException;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.repository.UserCabinetRepository;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.entity.UserCabinet;
import com.guts.socialpulse.security.TenantContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import com.guts.socialpulse.service.impl.CabinetServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link CabinetServiceImpl}.
 *
 * All dependencies are mocked — no Spring context needed.
 * TenantContext (ThreadLocal) is manually set and cleaned after each test.
 *
 * FIRST Principles:
 *  ✅ Fast       — Mockito only, no DB or network.
 *  ✅ Independent — TenantContext cleared in @AfterEach; Mockito resets mocks per test.
 *  ✅ Repeatable  — no external state.
 *  ✅ Self-Validating — AssertJ assertions.
 *  ✅ Timely     — written alongside CabinetServiceImpl.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CabinetServiceImpl Unit Tests")
class CabinetServiceTest {

    @Mock
    private CabinetRepository cabinetRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserCabinetRepository userCabinetRepository;

    @InjectMocks
    private CabinetServiceImpl cabinetService;

    private UUID existingCabinetId;
    private Cabinet existingCabinet;

    @BeforeEach
    void setup() {
        existingCabinetId = UUID.randomUUID();
        existingCabinet = Cabinet.builder()
                .name("Test Cabinet")
                .barreau("Barreau de Paris")
                .email("test@cabinet.fr")
                .status(CabinetStatus.ACTIF)
                .specializations("Droit de la famille,Droit fiscal")
                .build();
        // Simulate a persisted entity by setting the ID via reflection isn't needed;
        // we can use the builder now that UUID is assigned lazily.
    }

    @AfterEach
    void tearDown() {
        // CRITICAL: Always clear TenantContext after each test to prevent ThreadLocal leakage
        TenantContext.clear();
    }

    // ── createCabinet Tests ───────────────────────────────────────────────────

    @Nested
    @DisplayName("createCabinet()")
    class CreateCabinetTests {

        @Test
        @DisplayName("✅ Returns DTO with correct fields after successful save")
        void createCabinet_shouldSaveAndReturnDTO() {
            CreateCabinetRequest req = new CreateCabinetRequest();
            req.setName("New Cabinet");
            req.setBarreau("Barreau de Lyon");
            req.setEmail("new@law.fr");
            req.setSpecializations(List.of("Droit fiscal", "Droit commercial"));

            when(cabinetRepository.existsByEmail("new@law.fr")).thenReturn(false);
            when(cabinetRepository.save(any(Cabinet.class))).thenAnswer(inv -> {
                Cabinet c = inv.getArgument(0);
                return c; // Return the same entity (ID will be null in unit test)
            });

            // Mock SecurityContext
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("testuser");
            SecurityContext securityContext = mock(SecurityContext.class);
            when(securityContext.getAuthentication()).thenReturn(auth);
            SecurityContextHolder.setContext(securityContext);

            User mockUser = new User();
            mockUser.setUsername("testuser");
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
            when(userCabinetRepository.save(any(UserCabinet.class))).thenAnswer(inv -> inv.getArgument(0));

            CabinetDTO result = cabinetService.createCabinet(req);

            assertThat(result.getName()).isEqualTo("New Cabinet");
            assertThat(result.getBarreau()).isEqualTo("Barreau de Lyon");
            assertThat(result.getSpecializations())
                    .containsExactly("Droit fiscal", "Droit commercial");

            verify(cabinetRepository, times(1)).existsByEmail("new@law.fr");
            verify(cabinetRepository, times(1)).save(any(Cabinet.class));
        }

        @Test
        @DisplayName("❌ Throws DuplicateResourceException when email already exists")
        void createCabinet_shouldThrow_whenEmailAlreadyExists() {
            CreateCabinetRequest req = new CreateCabinetRequest();
            req.setName("Duplicate Cabinet");
            req.setBarreau("Barreau de Nantes");
            req.setEmail("existing@law.fr");

            when(cabinetRepository.existsByEmail("existing@law.fr")).thenReturn(true);

            assertThatThrownBy(() -> cabinetService.createCabinet(req))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("existing@law.fr");

            verify(cabinetRepository, never()).save(any());
        }

        @Test
        @DisplayName("✅ Null specializations saved gracefully (no NPE)")
        void createCabinet_shouldHandleNullSpecializations() {
            CreateCabinetRequest req = new CreateCabinetRequest();
            req.setName("Simple Cabinet");
            req.setBarreau("Barreau de Nice");
            req.setSpecializations(null);

            when(cabinetRepository.save(any(Cabinet.class))).thenAnswer(inv -> inv.getArgument(0));

            // Mock SecurityContext
            Authentication auth = mock(Authentication.class);
            when(auth.getName()).thenReturn("testuser");
            SecurityContext securityContext = mock(SecurityContext.class);
            when(securityContext.getAuthentication()).thenReturn(auth);
            SecurityContextHolder.setContext(securityContext);

            User mockUser = new User();
            mockUser.setUsername("testuser");
            when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
            when(userCabinetRepository.save(any(UserCabinet.class))).thenAnswer(inv -> inv.getArgument(0));

            CabinetDTO result = cabinetService.createCabinet(req);

            assertThat(result.getSpecializations()).isEmpty();
        }
    }

    // ── getMyCabinet Tests ────────────────────────────────────────────────────

    @Nested
    @DisplayName("getMyCabinet()")
    class GetMyCabinetTests {

        @Test
        @DisplayName("✅ Returns DTO for the cabinet in TenantContext")
        void getMyCabinet_shouldReturnDTO_whenCabinetExists() {
            TenantContext.setCabinetId(existingCabinetId);
            when(cabinetRepository.findById(existingCabinetId))
                    .thenReturn(Optional.of(existingCabinet));

            CabinetDTO result = cabinetService.getMyCabinet();

            assertThat(result.getName()).isEqualTo("Test Cabinet");
            assertThat(result.getSpecializations())
                    .containsExactlyInAnyOrder("Droit de la famille", "Droit fiscal");

            verify(cabinetRepository, times(1)).findById(existingCabinetId);
        }

        @Test
        @DisplayName("❌ Throws CabinetNotFoundException when TenantContext ID not in DB")
        void getMyCabinet_shouldThrow_whenCabinetNotFound() {
            TenantContext.setCabinetId(existingCabinetId);
            when(cabinetRepository.findById(existingCabinetId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> cabinetService.getMyCabinet())
                    .isInstanceOf(CabinetNotFoundException.class)
                    .hasMessageContaining(existingCabinetId.toString());

            verify(cabinetRepository, times(1)).findById(existingCabinetId);
        }

        @Test
        @DisplayName("❌ Throws IllegalStateException when TenantContext has no cabinet ID")
        void getMyCabinet_shouldThrow_whenTenantContextIsEmpty() {
            // TenantContext.getCabinetId() returns null — no X-Cabinet-Context was set

            assertThatThrownBy(() -> cabinetService.getMyCabinet())
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("TenantContext has no active cabinet ID");

            verify(cabinetRepository, never()).findById(any());
        }
    }
}
