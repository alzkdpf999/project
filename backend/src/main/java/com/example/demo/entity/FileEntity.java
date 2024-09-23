package com.example.demo.entity;

import java.util.Date;

import org.hibernate.annotations.DynamicInsert;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@Getter
@Entity
@Builder
@Table(name="files")
public class FileEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "file_id")
	private Long fileId;
	
	@Column(name = "file_name", nullable = false)
    private String fileName;
	

	@Column(name = "file_cont_type", nullable = false)
    private String fileContType;
	
	@ManyToOne
	@JoinColumn(name="user_id",insertable = false, updatable = false)
	private UserEntity user;
	
	@Column(name="user_id")
	private Long userId;
	
	@Column(name= "save_date")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Temporal(TemporalType.TIMESTAMP)
	private Date saveDate;
}
