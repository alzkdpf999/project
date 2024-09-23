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
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Entity
@Builder
@Setter
@DynamicInsert
@Table(name="room")
public class RoomEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "room_id")
	private Long roomId;
	
	@Column(name = "room_name", nullable = false)
    private String roomName;
	
	@Column(name= "cnt")
	private int cnt;
	
	@Column(name= "create_date")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createDate;
	
	
}
