package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.RoomEntity;
import com.example.demo.entity.UserRoomEntity;
import com.example.demo.kurento.RoomManager;
import com.example.demo.repository.JpaRoomRepository;
import com.example.demo.repository.JpaUserRoomRepository;

import jakarta.transaction.Transactional;

@Service
public class RoomService {
	@Autowired
	private JpaRoomRepository jpaRoomRepository;
	@Autowired
	private JpaUserRoomRepository jpaUserRoomRepository;

	@Autowired
	private RoomManager roomManager;

	@Transactional
	public String attendRoom(String roomId, String userId) {
		RoomEntity roomEntity = jpaRoomRepository.findById(Long.parseLong(roomId)).get(); // 방 존재 여부 확인
		roomEntity.setCnt(roomEntity.getCnt() + 1); // 참가인원 늘려주기
		roomManager.getRoom(roomId,true); // webrtc에 방 만들기

		// user와 room 관계 연결해주기
		UserRoomEntity userRoomEntity = UserRoomEntity.builder().userId(Long.parseLong(userId))
				.roomId(roomEntity.getRoomId()).build();
		jpaUserRoomRepository.save(userRoomEntity);
		return roomEntity.getRoomName();
	}

	@Transactional
	public void regRoom(String roomName, String userId) {
		// 방 생성하자마자 추가
		RoomEntity roomEntity = RoomEntity.builder().cnt(1).roomName(roomName).build();
		Long roomId = jpaRoomRepository.save(roomEntity).getRoomId();
		roomManager.getRoom(String.valueOf(roomId),false); // webrtc에 방 만들기

		// user와 room 관계 연결해주기
		UserRoomEntity userRoomEntity = UserRoomEntity.builder().userId(Long.parseLong(userId)).roomId(roomId)
				.build();
		jpaUserRoomRepository.save(userRoomEntity);
		
	}
	@Transactional
	public boolean vaildRoom(String roomName) {
		String vaildName = roomName.replaceAll("\"", "");
		return jpaRoomRepository.existsByRoomName(vaildName);
	}
}
