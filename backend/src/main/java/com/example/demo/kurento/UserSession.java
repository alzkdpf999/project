package com.example.demo.kurento;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import org.kurento.client.Continuation;
import org.kurento.client.EventListener;
import org.kurento.client.IceCandidate;
import org.kurento.client.IceCandidateFoundEvent;
import org.kurento.client.ListenerSubscription;
import org.kurento.client.MediaPipeline;
import org.kurento.client.RecorderEndpoint;
import org.kurento.client.StoppedEvent;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.kurento.module.chroma.ChromaFilter;
import org.kurento.module.chroma.WindowParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.google.gson.JsonObject;

/**
 *
 * @author Ivan Gracia (izanmail@gmail.com)
 * @since 4.3.1
 */

public class UserSession implements Closeable {
	
	
	
	private static final Logger log = LoggerFactory.getLogger(UserSession.class);

	private String name;
	private WebSocketSession session;
	private boolean chromaOnOff = false;
	private MediaPipeline pipeline;
//	private ChromaFilter chromaFilter;
	private String roomName;
	private RecorderEndpoint recorderEndpoint;
	private WebRtcEndpoint outgoingMedia;
	private ConcurrentMap<String, WebRtcEndpoint> incomingMedia = new ConcurrentHashMap<>();
	private ConcurrentMap<String, ChromaFilter> chromaFilter = new ConcurrentHashMap<>();

	public UserSession(final String name, String roomName, final WebSocketSession session, MediaPipeline pipeline) {
		this.pipeline = pipeline;
		this.name = name;
		this.session = session;
		this.roomName = roomName;
		this.outgoingMedia = new WebRtcEndpoint.Builder(pipeline).useDataChannels().build();
//		this.chromaFilter = chromaFilter;
		this.outgoingMedia.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {
			@Override
			public void onEvent(IceCandidateFoundEvent event) {
				JsonObject response = new JsonObject();
				response.addProperty("id", "iceCandidate");
				response.addProperty("name", name);
				response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
				try {
					synchronized (session) {
						session.sendMessage(new TextMessage(response.toString()));
					}
				} catch (IOException e) {
					log.debug(e.getMessage());
				}
			}
		});

	}

	public void setChromaOnOff(boolean onOff) {
		this.chromaOnOff = onOff;
	}

	public boolean getChromaOnOff() {
		return this.chromaOnOff;
	}

	public MediaPipeline getPipeline() {
		return pipeline;
	}

	public WebRtcEndpoint getOutgoingWebRtcPeer() {

		return outgoingMedia;
	}

	public String getName() {
		return name;
	}

	public WebSocketSession getSession() {
		return session;
	}

//	public ChromaFilter getFilter() {
//		return chromaFilter;
//	}

	/**
	 * The room to which the user is currently attending.
	 *
	 * @return The room
	 */
	public String getRoomName() {
		return this.roomName;
	}

	public void receiveVideoFrom(UserSession sender, String sdpOffer) throws IOException {
		log.info("USER {}: connecting with {} in room {}", this.name, sender.getName(), this.roomName);
		log.trace("USER {}: SdpOffer for {} is {}", this.name, sender.getName(), sdpOffer);
		WebRtcEndpoint webRtcEndpoint = this.getEndpointForUser(sender);
		final String ipSdpAnswer = webRtcEndpoint.processOffer(sdpOffer);
		final JsonObject scParams = new JsonObject();
		scParams.addProperty("id", "receiveVideoAnswer");
		scParams.addProperty("name", sender.getName());
		scParams.addProperty("sdpAnswer", ipSdpAnswer);

		log.trace("USER {}: SdpAnswer for {} is {}", this.name, sender.getName(), ipSdpAnswer);
		this.sendMessage(scParams);
		log.debug("gather candidates");
		webRtcEndpoint.gatherCandidates();
	}

	private WebRtcEndpoint getEndpointForUser(final UserSession sender) {
		// log.info("몇번 연결되는걸까?{} {}",sender.getName,this.name );
		if (sender.getName().equals(name)) {
			return outgoingMedia;
		}
		log.debug("PARTICIPANT {}: receiving video from {}", this.name, sender.getName());

		WebRtcEndpoint incoming = incomingMedia.get(sender.getName());
		ChromaFilter ch = chromaFilter.get(sender.getName());
		if (incoming == null) {

			log.debug("PARTICIPANT {}: creating new endpoint for {}", this.name, sender.getName());
			incoming = new WebRtcEndpoint.Builder(pipeline).useDataChannels().build();
//			log.info("몇번 연결되는걸까? {}",this.name );
			incoming.addIceCandidateFoundListener(new EventListener<IceCandidateFoundEvent>() {

				@Override
				public void onEvent(IceCandidateFoundEvent event) {
					JsonObject response = new JsonObject();
					response.addProperty("id", "iceCandidate");
					response.addProperty("name", sender.getName());
					response.add("candidate", JsonUtils.toJsonObject(event.getCandidate()));
					try {
						synchronized (session) {
							session.sendMessage(new TextMessage(response.toString()));
						}
					} catch (IOException e) {
						log.debug(e.getMessage());
					}
				}
			});

			incomingMedia.put(sender.getName(), incoming);

		}
		if (ch == null) {
			ch = new ChromaFilter.Builder(pipeline, new WindowParam(5, 5, 40, 40)).build();
			ch.setBackground("https://raw.githubusercontent.com/Kurento/test-files/main/img/mario.jpg");
			this.chromaFilter.put(sender.getName(), ch);
		}

//		log.debug("PARTICIPANT {}: obtained endpoint for {}", this.name, sender.getName());
		log.info("PARTICIPANT {}: obtained endpoint for {}", this.name, sender.getName());

		if (sender.getChromaOnOff()) {
			log.info("{}입니다", sender.getChromaOnOff());
			sender.getOutgoingWebRtcPeer().connect(ch);
			ch.connect(incoming);
		} else {
//		log.info("흠{}",sender.getChromaOnOff());
			sender.getOutgoingWebRtcPeer().connect(incoming);
		}

		return incoming;
	}

	public void setOutgoingWebRtcPeer(WebRtcEndpoint webRtcEndpoint) {
		this.outgoingMedia = webRtcEndpoint;

	}

	public void startChroma(Collection<UserSession> users) {
		log.info("{}", incomingMedia.entrySet());
		for (UserSession user : users) {
			if (!user.getName().equals(name)) {
				this.getOutgoingWebRtcPeer().disconnect(user.getIncomigMedia().get(name));
				this.getOutgoingWebRtcPeer().connect(user.getFilter().get(name));
				user.getFilter().get(name).connect(user.getIncomigMedia().get(name));
			}

		}
	}

	public ConcurrentMap<String, ChromaFilter> getFilter() {
		return this.chromaFilter;
	}

	public void stopChroma(Collection<UserSession> users) {
		for (UserSession user : users) {
			if (!user.getName().equals(name)) {
				this.getOutgoingWebRtcPeer().disconnect(user.getFilter().get(name));
				user.getFilter().get(name).disconnect(user.getIncomigMedia().get(name));
				this.getOutgoingWebRtcPeer().connect(user.getIncomigMedia().get(name));
			}
		}
	}

	public void cancelVideoFrom(final UserSession sender) {
		this.cancelVideoFrom(sender.getName());
	}

	public void cancelVideoFrom(final String senderName) {
		log.debug("PARTICIPANT {}: canceling video reception from {}", this.name, senderName);
		final WebRtcEndpoint incoming = incomingMedia.remove(senderName);
		final ChromaFilter ch = chromaFilter.remove(senderName);
		log.debug("PARTICIPANT {}: removing endpoint for {}", this.name, senderName);
		if (ch !=null) {
			ch.release(new Continuation<Void>() {
				@Override
				public void onSuccess(Void result) throws Exception {
					log.trace("PARTICIPANT {}: Released successfully chromaFilter EP for {}", UserSession.this.name,
							senderName);
				}

				@Override
				public void onError(Throwable cause) throws Exception {
					log.warn("PARTICIPANT {}: Could not release chromaFilter EP for {}", UserSession.this.name, senderName);
				}
			});
		}
		
		if (incoming !=null) {
			incoming.release(new Continuation<Void>() {
				@Override
				public void onSuccess(Void result) throws Exception {
					log.trace("PARTICIPANT {}: Released successfully incoming EP for {}", UserSession.this.name,
							senderName);
				}

				@Override
				public void onError(Throwable cause) throws Exception {
					log.warn("PARTICIPANT {}: Could not release incoming EP for {}", UserSession.this.name, senderName);
				}
			});
		}
		
	}

	@Override
	public void close() throws IOException {
		log.debug("PARTICIPANT {}: Releasing resources", this.name);
		for (final String remoteParticipantName : incomingMedia.keySet()) {

			log.trace("PARTICIPANT {}: Released incoming EP for {}", this.name, remoteParticipantName);

			final WebRtcEndpoint ep = this.incomingMedia.get(remoteParticipantName);
			ChromaFilter ch = this.chromaFilter.get(remoteParticipantName);
			if (ch != null) {
				ch.release(new Continuation<Void>() {

					@Override
					public void onSuccess(Void result) throws Exception {
						log.trace("PARTICIPANT {}: Released successfully ch EP for {}", UserSession.this.name,
								remoteParticipantName);
					}

					@Override
					public void onError(Throwable cause) throws Exception {
						log.warn("PARTICIPANT {}: Could not release ch EP for {}", UserSession.this.name,
								remoteParticipantName);
					}
				});
			}
			

			ep.release(new Continuation<Void>() {

				@Override
				public void onSuccess(Void result) throws Exception {
					log.trace("PARTICIPANT {}: Released successfully incoming EP for {}", UserSession.this.name,
							remoteParticipantName);
				}

				@Override
				public void onError(Throwable cause) throws Exception {
					log.warn("PARTICIPANT {}: Could not release incoming EP for {}", UserSession.this.name,
							remoteParticipantName);
				}
			});
		}

		outgoingMedia.release(new Continuation<Void>() {

			@Override
			public void onSuccess(Void result) throws Exception {
				log.trace("PARTICIPANT {}: Released outgoing EP", UserSession.this.name);
			}

			@Override
			public void onError(Throwable cause) throws Exception {
				log.warn("USER {}: Could not release outgoing EP", UserSession.this.name);
			}

		});
	}

	public void sendMessage(JsonObject message) throws IOException {
		log.debug("USER {}: Sending message {}", name, message);
		synchronized (session) {
			session.sendMessage(new TextMessage(message.toString()));
		}
	}

	public void addCandidate(IceCandidate candidate, String name) {
		if (this.name.compareTo(name) == 0) {
			outgoingMedia.addIceCandidate(candidate);
		} else {
			WebRtcEndpoint webRtc = incomingMedia.get(name);
			if (webRtc != null) {
				webRtc.addIceCandidate(candidate);
			}
		}
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {

		if (this == obj) {
			return true;
		}
		if (obj == null || !(obj instanceof UserSession)) {
			return false;
		}
		UserSession other = (UserSession) obj;
		boolean eq = name.equals(other.name);
		eq &= roomName.equals(other.roomName);
		return eq;
	}

	/*
	 * (non-Javadoc)
	 *
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		int result = 1;
		result = 31 * result + name.hashCode();
		result = 31 * result + roomName.hashCode();
		return result;
	}

	public ConcurrentMap<String, WebRtcEndpoint> getIncomigMedia() {
		return incomingMedia;
	}

	public void setIncomigMedia(ConcurrentMap<String, WebRtcEndpoint> incomingMedia) {
		this.incomingMedia = incomingMedia;
	}

	
	
	
	/*
	 * 화면 녹화부분입니다.
	 */
	public void setRecorderEndpoint(RecorderEndpoint recorderEndpoint) {
		this.recorderEndpoint = recorderEndpoint;
	}

	public RecorderEndpoint getRecorderEndpoint() {
		return recorderEndpoint;
	}

	public void stop() throws IOException {
		log.info("멈춰주세여");
		
		
		
		if (recorderEndpoint != null) {
			final CountDownLatch stoppedCountDown = new CountDownLatch(1);
			ListenerSubscription subscriptionId = recorderEndpoint
					.addStoppedListener(new EventListener<StoppedEvent>() {

						@Override
						public void onEvent(StoppedEvent event) {
							stoppedCountDown.countDown();
						}
					});
			recorderEndpoint.stop();
			
			outgoingMedia.disconnect(recorderEndpoint);
			JsonObject stopRec = new JsonObject();
			stopRec.addProperty("id", "stopRec");
			stopRec.addProperty("name", name);
			//파일 이름 일단 임시로 넣어줌 나중에 수정 필요
			stopRec.addProperty("fileName", "HelloWorldRecorded.webm");
			this.sendMessage(stopRec);
			try {
				if (!stoppedCountDown.await(5, TimeUnit.SECONDS)) {
					log.error("Error waiting for recorder to stop");
				}
			} catch (InterruptedException e) {
				log.error("Exception while waiting for state change", e);
			}
			recorderEndpoint.removeStoppedListener(subscriptionId);
		}
	}
	
}
