package com.example.demo.entity;

import org.hibernate.annotations.DynamicInsert;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name="user_room")
public class UserRoomEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name= "id")
	private Long id;
		
	@ManyToOne
	@JoinColumn(name="user_id",insertable = false,updatable =  false)
	private UserEntity user;
	
	@ManyToOne
	@JoinColumn(name="room_id",insertable = false,updatable =  false)
	private RoomEntity room;
	
	@Column(name="user_id")
	private Long userId;
	
	@Column(name="room_id")
	private Long roomId;
}
