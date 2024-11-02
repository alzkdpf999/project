package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RoomEntity;

public interface JpaRoomRepository extends JpaRepository<RoomEntity, Long> {
	boolean existsByRoomName(String roomName);
}
