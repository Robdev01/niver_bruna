package com.niverbruna.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class CorsConfig {
  @Value("${app.cors.allowed-origins}")
  private String[] allowedOrigins;

  @Bean
  WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");
        registry.addMapping("/media/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "OPTIONS")
            .allowedHeaders("*");
      }

      @Override
      public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String mediaPath = Path.of("backend", "media").toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/media/**")
            .addResourceLocations(mediaPath);
      }
    };
  }
}
