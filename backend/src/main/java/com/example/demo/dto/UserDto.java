package com.example.demo.dto;

import lombok.*;

import java.util.Date;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String email;
    private String name;
    private String passwd;
}
