package com.edushare.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and() // Enable CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/user/**",
                                "/oauth2/**",
                                "/api/user/**",
                                "/api/posts/**",
                                "/learningPlan/**",
                                "/api/events/**",
                                "/api/likes/**",
                                "/api/notifications/**",
                                "/api/comments/**",
                                "/api/attendees/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                ); // Fixed missing semicolon
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedMethod("*"); 
        config.addAllowedHeader("*"); 
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}