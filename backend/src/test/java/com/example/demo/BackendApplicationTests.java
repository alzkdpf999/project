package com.example.demo;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.RoomEntity;
import com.example.demo.repository.JpaRoomRepository;
import com.example.demo.repository.JpaUserRepository;

import lombok.extern.slf4j.Slf4j;

@SpringBootTest
@Slf4j
@Transactional
class BackendApplicationTests {

	
	@Autowired
	private JpaUserRepository u;
	@Autowired
	private JpaRoomRepository j;
	
	@Test
	void asd() {
		Optional<RoomEntity> optional = j.findById(10L);
		if(optional.isEmpty()) {
			log.info("없");
		}
//		log.info("{}",);
	}

}
