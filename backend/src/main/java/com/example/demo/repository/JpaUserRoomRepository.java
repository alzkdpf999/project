package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserRoomEntity;

public interface JpaUserRoomRepository extends JpaRepository<UserRoomEntity, Long> {

}
