package com.guts.socialpulse.config;

import com.guts.socialpulse.security.SimulationModeInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final SimulationModeInterceptor simulationModeInterceptor;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost", "http://localhost:80")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("X-Cabinet-Context")
                .allowCredentials(true);
    }

    /**
     * Register the SimulationModeInterceptor so that any endpoint annotated with
     * {@code @SimulationReadOnly} blocks write operations when {@code isSimulating=true}.
     *
     * Why here and not a Filter? HandlerInterceptors have access to {@link org.springframework.web.method.HandlerMethod}
     * and therefore to method-level annotations. Servlet Filters cannot.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(simulationModeInterceptor)
                .addPathPatterns("/api/**");
    }
}
