package com.project.it.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.it.dto.ChatMessageDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

@Component
public class AlarmHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("WebSocket connection established: " + session.getId());
    }


    public void sendAlarmUpdate(Map<String, Long> alarmData) {
        // ObjectMapper를 사용해 Map을 JSON 형식으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonMessage = "";
        try {
            jsonMessage = objectMapper.writeValueAsString(alarmData); // Map을 JSON 문자열로 변환
        } catch (IOException e) {
            e.printStackTrace();
        }

        // WebSocket 메시지로 전송
        TextMessage message = new TextMessage(jsonMessage);

        synchronized (sessions) {
            Iterator<WebSocketSession> iterator = sessions.iterator();
            while (iterator.hasNext()) {
                WebSocketSession session = iterator.next();
                if (!session.isOpen()) {
                    iterator.remove();  // 닫힌 세션은 목록에서 제거
                } else {
                    try {
                        session.sendMessage(message);  // JSON 형식의 메시지 전송
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    // 클라이언트로부터 메시지를 수신했을 때 호출되는 메서드
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 클라이언트가 보낸 메시지 로깅
        System.out.println("받은 메시지: " + message.getPayload());

        // 받은 메시지를 모든 연결된 클라이언트에 방송하기
        TextMessage responseMessage = new TextMessage("서버에서 받은 메시지: " + message.getPayload());
        session.sendMessage(responseMessage);
    }

    // 연결된 모든 클라이언트에게 메시지를 전송하는 메서드
    public void broadcastMessage(ChatMessageDTO messageDTO) throws Exception {
        // ObjectMapper를 사용하여 객체를 JSON 문자열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonMessage = objectMapper.writeValueAsString(messageDTO);

        // 연결된 모든 클라이언트에게 메시지 전송
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(jsonMessage));  // JSON 문자열로 전송
            }
        }
    }
}