package com.example.demo.config;

import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

import com.example.demo.kurento.CallHandler;
import com.example.demo.kurento.RoomManager;
import com.example.demo.kurento.UserRegistry;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSocket // 웹 소켓에 대해 자동 설정
@RequiredArgsConstructor
public class WebRtcConfig implements WebSocketConfigurer{
	
	
	@Bean
	  public UserRegistry registry() {
	    return new UserRegistry();
	  }

	  @Bean
	  public RoomManager roomManager() {
	    return new RoomManager();
	  }

	  @Bean
	  public CallHandler groupCallHandler() {
	    return new CallHandler();
	  }

	  @Bean
	  public KurentoClient kurentoClient() {
	    return KurentoClient.create("ws://localhost:8888/kurento");
	  }
	  @Bean
	  public ServletServerContainerFactoryBean createServletServerContainerFactoryBean() {
	    ServletServerContainerFactoryBean container = new ServletServerContainerFactoryBean();
	    container.setMaxTextMessageBufferSize(32768);
	    return container;
	  }


	  @Override
	  public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
	    registry.addHandler(groupCallHandler(), "/signal").setAllowedOrigins("*");;
	  }
}
