package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class RoomResponse {
	private String uuid;
	private String roomName;
	private String roomId;
}
