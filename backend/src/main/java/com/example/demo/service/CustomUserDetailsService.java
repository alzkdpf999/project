// package com.example.demo.service;

// import java.util.Collections;

// import com.example.demo.config.CustomUserDetails;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.stereotype.Service;

// import com.example.demo.entity.UserEntity;
// import com.example.demo.repository.JpaUserRepository;

// @Service
// public class CustomUserDetailsService implements UserDetailsService {

//     private final JpaUserRepository userRepository;

//     @Autowired
//     public CustomUserDetailsService(JpaUserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

//         UserEntity userEntity = userRepository.findByUserEmail(email).orElseThrow(()->{
//             return new UsernameNotFoundException("회원정보 찾을 수 없음");
//         });

//         return new CustomUserDetails(userEntity);
//     }
// }
