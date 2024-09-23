package com.example.demo.kurento;

import java.io.IOException;
import java.util.Collection;

import org.kurento.client.EventListener;
import org.kurento.client.IceCandidate;
import org.kurento.client.MediaProfileSpecType;
import org.kurento.client.MediaType;
import org.kurento.client.PausedEvent;
import org.kurento.client.RecorderEndpoint;
import org.kurento.client.RecordingEvent;
import org.kurento.client.StoppedEvent;
import org.kurento.client.WebRtcEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

/**
 * 
 * @author Ivan Gracia (izanmail@gmail.com)
 * @since 4.3.1
 */
public class CallHandler extends TextWebSocketHandler {

	private static final Logger log = LoggerFactory.getLogger(CallHandler.class);

	private static final Gson gson = new GsonBuilder().create();

	@Autowired
	private RoomManager roomManager;

	@Autowired
	private UserRegistry registry;

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		final JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);

		final UserSession user = registry.getBySession(session);
	
		if (user != null) {
			log.debug("Incoming message from user '{}': {}", user.getName(), jsonMessage);
		} else {
			log.debug("Incoming message from new user: {}", jsonMessage);
		}

		switch (jsonMessage.get("id").getAsString()) {
		case "joinRoom":
			joinRoom(jsonMessage, session);
			break;
		case "receiveVideoFrom":
			final String senderName = jsonMessage.get("sender").getAsString();
			final UserSession sender = registry.getByName(senderName);
			final String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
			user.receiveVideoFrom(sender, sdpOffer);
			break;
		case "leaveRoom":
			leaveRoom(user);
			break;
		case "onIceCandidate":
			JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();

			if (user != null) {
				IceCandidate cand = new IceCandidate(candidate.get("candidate").getAsString(),
						candidate.get("sdpMid").getAsString(), candidate.get("sdpMLineIndex").getAsInt());
				user.addCandidate(cand, jsonMessage.get("name").getAsString());
			}
			break;
		case "startShare":
			String senderShareName = jsonMessage.get("name").getAsString();
			UserSession senderShare = registry.getByName(senderShareName);
			sendShare(user, jsonMessage, session, true, senderShare);
			break;
		case "stopShare":
			String senderStopName = jsonMessage.get("name").getAsString();
			UserSession shareStop = registry.getByName(senderStopName);
			sendShare(user, jsonMessage, session, false, shareStop);
			break;
		case "startChroma":
			startChroma(jsonMessage);
			break;
		case "stopChroma":
			stopChroma(jsonMessage);
			break;
		case "recording":
//			Room room = roomManager.getRoom(jsonMessage.get("roomId").getAsString()); 
			recording(jsonMessage, session);
//			room.recordRoom();
			break;
		case "stopRec":

			String senderRec = jsonMessage.get("name").getAsString();
			UserSession userRec = registry.getByName(senderRec);
			userRec.stop();

			break;
		default:
			break;
		}
	}

	private void startChroma(JsonObject jsonMessage) {
		String roomId = jsonMessage.get("room").getAsString();
		String name = jsonMessage.get("name").getAsString();
		UserSession sender = registry.getByName(name);
		Room room = roomManager.getRoom(roomId,true);
		Collection<UserSession> users = room.getParticipants();
		sender.setChromaOnOff(true);
		sender.startChroma(users);
	}

	private void stopChroma(JsonObject jsonMessage) {
		String roomId = jsonMessage.get("room").getAsString();
		String name = jsonMessage.get("name").getAsString();
		UserSession sender = registry.getByName(name);
		Room room = roomManager.getRoom(roomId,true);

		Collection<UserSession> users = room.getParticipants();
		sender.setChromaOnOff(false);
		sender.stopChroma(users);
	}

	// 공유시작 또는 공유 종료시 그 방 사람들에게 보내주는 용도
	private void sendShare(UserSession user, JsonObject jsonMessage, WebSocketSession session, boolean onOff,
			UserSession sender) {
		String roomId = jsonMessage.get("room").getAsString();
		Room room = roomManager.getRoom(roomId,true);

		if (sender.getChromaOnOff() && onOff) {
			// 공유한 사람이 크로마를 킨 경우

			stopChroma(jsonMessage);
			sender.setChromaOnOff(true);
		} else if (sender.getChromaOnOff() && !onOff) {
			// 크로마 킨 사람이 공유를 끈 경우

			startChroma(jsonMessage);
		}
		room.sendShare(session, user, roomId, onOff);

	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		log.info("이거니?");
		UserSession user = registry.removeBySession(session);

		Room room =roomManager.getRoom(user.getRoomName(),false);
		if (room !=null) {
			room.leave(user);
		}
	}

	private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
		final String roomName = params.get("room").getAsString();
		final String name = params.get("name").getAsString();
		log.info("PARTICIPANT {}: trying to join room {}", name, roomName);

		Room room = roomManager.getRoom(roomName,true);
		final UserSession user = room.join(name, session);
		registry.register(user);
	}

	private void leaveRoom(UserSession user) throws IOException {
		
		Room room = roomManager.getRoom(user.getRoomName(),true);
		room.leave(user);
		if (room.getParticipants().isEmpty()) {
			roomManager.removeRoom(room);
		}
		log.info("방을 나갔음");;
	}

	private void recording(JsonObject jsonMessage, WebSocketSession session) {
		final String roomId = jsonMessage.get("room").getAsString();
		final String userName = jsonMessage.get("name").getAsString();
		UserSession userRec = registry.getByName(userName);
		log.info("roomId {}, username {}, mode {}", roomId, userName, jsonMessage.get("mode").getAsString());

		// String path = os.path.join(os.path.expanduser("~"), "Downloads");
		Room room = roomManager.getRoom(roomId,true);
		UserSession user = room.getParticipant(userName);
		MediaProfileSpecType profile = getMediaProfileFromMessage(jsonMessage);
		// kms에 file:///tmp/HelloWorldRecorded.webm 이 위치에 영상이 저장?
		RecorderEndpoint recorder = new RecorderEndpoint.Builder(user.getPipeline(),
				"file:///tmp/HelloWorldRecorded.webm").withMediaProfile(profile).build();

		recorder.addRecordingListener(new EventListener<RecordingEvent>() {

			@Override
			public void onEvent(RecordingEvent event) {
				JsonObject response = new JsonObject();
				response.addProperty("id", "recording");
				for (UserSession participant : room.getParticipants()) {
					try {
						synchronized (participant) {
							participant.sendMessage(response);
						}
					} catch (IOException e) {
						log.error(e.getMessage());
					}
				}

			}

		});

		recorder.addStoppedListener(new EventListener<StoppedEvent>() {

			@Override
			public void onEvent(StoppedEvent event) {
				JsonObject response = new JsonObject();
				response.addProperty("id", "stopped");

				try {
					synchronized (session) {
						session.sendMessage(new TextMessage(response.toString()));
						log.debug("recoder 저장 확인 {}", recorder);
					}
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			}

		});

		recorder.addPausedListener(new EventListener<PausedEvent>() {

			@Override
			public void onEvent(PausedEvent event) {
				JsonObject response = new JsonObject();
				response.addProperty("id", "paused");
				try {
					synchronized (session) {
						session.sendMessage(new TextMessage(response.toString()));
					}
				} catch (IOException e) {
					log.error(e.getMessage());
				}
			}

		});

		connectAccordingToProfile(userRec.getOutgoingWebRtcPeer(), recorder, profile);
		userRec.setRecorderEndpoint(recorder);
		recorder.record();
	}

	private MediaProfileSpecType getMediaProfileFromMessage(JsonObject jsonMessage) {

		MediaProfileSpecType profile;
		switch (jsonMessage.get("mode").getAsString()) {
		case "audio-only":
			profile = MediaProfileSpecType.WEBM_AUDIO_ONLY;
			break;
		case "video-only":
			profile = MediaProfileSpecType.WEBM_VIDEO_ONLY;
			break;
		default:
			profile = MediaProfileSpecType.WEBM;
		}

		return profile;
	}

	private void connectAccordingToProfile(WebRtcEndpoint webRtcEndpoint, RecorderEndpoint recorder,
			MediaProfileSpecType profile) {
		switch (profile) {
		case WEBM:
			webRtcEndpoint.connect(recorder, MediaType.AUDIO);
			webRtcEndpoint.connect(recorder, MediaType.VIDEO);
			break;
		case WEBM_AUDIO_ONLY:
			webRtcEndpoint.connect(recorder, MediaType.AUDIO);
			break;
		case WEBM_VIDEO_ONLY:
			webRtcEndpoint.connect(recorder, MediaType.VIDEO);
			break;
		default:
			throw new UnsupportedOperationException("Unsupported profile for this tutorial: " + profile);
		}
	}

}
