//package com.example.demo.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.example.demo.dto.RoomResponse;
//import com.example.demo.repository.JpaUserRepository;
//import com.example.demo.service.RoomService;
//
//import lombok.extern.slf4j.Slf4j;
//
//@RestController
//@Slf4j
//@Transactional
//public class MainController {
//
//	// 방 생성과 그 방 아이디 이름 참가자? 정도 저장하는 디비가 필요할듯
//	int t = 0;
//
////	@Autowired
////	private JpaUserRepository u;
//
//	@Autowired
//	private RoomService roomService;
//	
//	@GetMapping("/")
//	public ResponseEntity<Object> goChatRoom() {
//		log.info("접속이 되나요??");
////		log.info("{}", u.findAll().get(0).getName());
//		return new ResponseEntity<>("연결확인",HttpStatus.OK);
//	}
//
//	@PostMapping("/room")
//	public ResponseEntity<Object> roomReg(@RequestBody String roomName) {
//		log.info("잘 받아와요{}",roomName);
//		String uuid = String.valueOf(t);
//		try {
////			roomService.regRoom(roomName, uuid);// uuid 나중에 시큐리티 되면 바꿔줘야함
//			return  new ResponseEntity<>(roomName+"방 생성 완료",HttpStatus.OK);
//			
//		}catch (Exception e) {
//			return new ResponseEntity<>("서버 오류",HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}
//
//	@GetMapping("/room/{roomId}")
//	public ResponseEntity<Object> roomAttend(Model model, @PathVariable String roomId) {
//		log.info("roomId {}", roomId);
//		// principalDetails 가 null 이 아니라면 로그인 된 상태!!
//
////		model.addAttribute("room", room);
//		// 임시로 사용자명, 방 아이디, 이름 설정
//		String uuid = String.valueOf(t);// UUID.randomUUID().toString().split("-")[0];
//		t++;
////		model.addAttribute("uuid", uuid);
////		model.addAttribute("roomId", "test");
////		model.addAttribute("roomName", "test");
//		roomService.attendRoom(roomId, uuid);
//		try {
//			String roomName = roomService.attendRoom(roomId, uuid);
//			RoomResponse attendRoomResponse =  RoomResponse.builder().roomId(roomId).roomName("test").uuid(uuid).build();
//			return new ResponseEntity<>(attendRoomResponse,HttpStatus.OK);
//		}catch (Exception e) {
//			return new ResponseEntity<>("서버 오류",HttpStatus.INTERNAL_SERVER_ERROR);
//		}
////		return "test/kurentoroom";
//	}
//
//}



package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.UserDto;
import com.example.demo.kurento.Room;
import com.example.demo.kurento.RoomManager;
import com.example.demo.repository.JpaUserRepository;
import com.example.demo.service.RoomService;
//import com.example.demo.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@Transactional
public class MainController {

	// 방 생성과 그 방 아이디 이름 참가자? 정도 저장하는 디비가 필요할듯
	int t = 0;

	@Autowired
	private JpaUserRepository u;

//	@Autowired
//	private UserService uu;
	@Autowired
	private RoomService roomService;
	
	@Autowired
	private RoomManager roomManager;
	
	@GetMapping("/")
	public ResponseEntity<Object> goChatRoom() {
		log.info("접속이 되나요??");
//		UserDto use = UserDto.builder().email("asd").passwd("1234a").name("asd").build();
//		uu.join(use);
//		log.info("{}", u.findAll().get(0).getName());
//		log.info("{}", u.findAll().get(1).getName());
		return new ResponseEntity<>("연결확인",HttpStatus.OK);
	}

	@PostMapping("/room")
	public ResponseEntity<Object> roomReg(@RequestBody String roomName) {
		log.info("잘 받아와요{}",roomName);
		String uuid = String.valueOf(t);
		try {
//			roomService.regRoom(roomName, uuid);// uuid 나중에 시큐리티 되면 바꿔줘야함
			return  new ResponseEntity<>(roomName+"방 생성 완료",HttpStatus.OK);
			
		}catch (Exception e) {
			return new ResponseEntity<>("서버 오류",HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/room/{roomId}")
	public String roomAttend(Model model, @PathVariable String roomId) {
		log.info("roomId {}", roomId);
		// principalDetails 가 null 이 아니라면 로그인 된 상태!!
		roomManager.getRoom(roomId,true);
//		model.addAttribute("room", room);
		// 임시로 사용자명, 방 아이디, 이름 설정
		String uuid = String.valueOf(t);// UUID.randomUUID().toString().split("-")[0];
		t++;
		model.addAttribute("uuid", uuid);
		model.addAttribute("roomId", roomId);
		model.addAttribute("roomName", "test");
		model.addAttribute("cnt",1);
//		roomService.attendRoom(roomId, uuid);
//		try {
//			String roomName = roomService.attendRoom(roomId, uuid);
//			RoomResponse attendRoomResponse =  RoomResponse.builder().roomId(roomId).roomName("test").uuid(uuid).build();
//			return new ResponseEntity<>(attendRoomResponse,HttpStatus.OK);
//		}catch (Exception e) {
//			return new ResponseEntity<>("서버 오류",HttpStatus.INTERNAL_SERVER_ERROR);
//		}
		return "/test/kurentoroom";
	}

}