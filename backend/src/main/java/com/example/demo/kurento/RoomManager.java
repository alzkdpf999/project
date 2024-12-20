package com.example.demo.kurento;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.kurento.client.KurentoClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Ivan Gracia (izanmail@gmail.com)
 * @since 4.3.1
 */

public class RoomManager {

	private final Logger log = LoggerFactory.getLogger(RoomManager.class);

	@Autowired
	private KurentoClient kurento;

	private final ConcurrentMap<String, Room> rooms = new ConcurrentHashMap<>();

	/**
	 * Looks for a room in the active room list.
	 *
	 * @param roomName the name of the room
	 * @return the room if it was already created, or a new one if it is the first
	 *         time this room is accessed
	 */
	public Room getRoom(String roomName,Boolean check) {
		log.debug("Searching for room {}", roomName);
		log.info("getRoom실행?");
		Room room = rooms.get(roomName);
		log.info("{}",room);
		if (room == null && check) {
			log.debug("Room {} not existent. Will create now!", roomName);
			room = new Room(roomName, kurento.createMediaPipeline());
			rooms.put(roomName, room);
		}
		log.debug("Room {} found!", roomName);
		return room;
	}

	/**
	 * Removes a room from the list of available rooms.
	 *
	 * @param room the room to be removed
	 */
	public void removeRoom(Room room) {
		this.rooms.remove(room.getName());
		room.close();
		log.info("Room {} removed and closed", room.getName());
	}

}