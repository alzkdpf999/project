package com.example.demo.entity;

import java.util.Date;

import org.hibernate.annotations.DynamicInsert;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Entity
@Builder
@DynamicInsert
@Table(name="users")
public class UserEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "user_id")
	private Long userId;
	
	@Column(name = "email", nullable = false, unique = true)
    private String email;
	
	@Column(name = "name", nullable = false)
    private String name;
	
	@Column(name = "user_role", nullable = false)
    private String userRole;
	
	@Column(name = "passwd", nullable = false)
    private String passwd;
	
	@Column(name= "create_date")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createDate;
}
