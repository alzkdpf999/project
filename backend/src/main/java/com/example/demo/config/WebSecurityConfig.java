//package com.example.demo.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
//
//@Configuration
//@EnableWebSecurity
//public class WebSecurityConfig { 
//
//    @Bean
//    PasswordEncoder passwordEncoder(){
//        return new BCryptPasswordEncoder();
//    }
//    
//    @Bean
//    public SecurityFilterChain filterChain (HttpSecurity http) throws Exception {
//
//        http
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/","/join","/login","/logout").permitAll()
//                        // .requestMatchers("/teach").hasRole("ROLE_TEACHER")
//                        // .requestMatchers("/student").hasRole("ROLE_STUDENT")
//                        .anyRequest().authenticated()
//                );
//        http
//                .formLogin(login -> login.loginPage("/login")
//                        .defaultSuccessUrl("/")
//                );
//        http
//                .logout(logout -> logout
//                        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                        .invalidateHttpSession(true)
//                        .logoutSuccessUrl("/login")
//                );
//        http.csrf(csrf -> csrf.disable());
//        return http.build();
//    }
//
//}
