package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.security.JwtAuthFilter;
import com.guts.socialpulse.security.TenantContextFilter;
import com.guts.socialpulse.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * WebMvcTest for AuditLogController.
 * Quality Sentinel: Validates OWASP A01 (Broken Access Control)
 * Ensures only SUPER_ADMIN can view global logs.
 */
@WebMvcTest(
    controllers = AuditLogController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = {JwtAuthFilter.class, TenantContextFilter.class}
    )
)
@EnableMethodSecurity
@AutoConfigureMockMvc(addFilters = true)
class AuditLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuditLogService auditLogService;

    @Test
    @WithMockUser(roles = "SUPER_ADMIN")
    void getGlobalAuditLogs_AsSuperAdmin_Success() throws Exception {
        mockMvc.perform(get("/api/v1/audit-logs/global")
                        .with(csrf()))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "CM")
    void getGlobalAuditLogs_AsCM_Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/audit-logs/global")
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AVOCAT")
    void getAuditLogsForPost_AsAuthedUser_Success() throws Exception {
        UUID postId = UUID.randomUUID();
        mockMvc.perform(get("/api/v1/audit-logs/posts/" + postId)
                        .with(csrf()))
                .andExpect(status().isOk());
    }
}
