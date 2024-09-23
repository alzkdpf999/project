package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RoomEntity;

public interface JpaRoomRepository extends JpaRepository<RoomEntity, Long> {

}
