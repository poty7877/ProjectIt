package com.project.it.controller;

import com.project.it.dto.ChatMessageDTO;
import com.project.it.handler.AlarmHandler;
import com.project.it.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    private final AlarmHandler alarmHandler;

    @PostMapping("/send")
    public ChatMessageDTO handleMessage(@RequestBody ChatMessageDTO chatMessageDTO) {
        chatMessageService.register(chatMessageDTO);
        // 받은 메시지를 AlarmHandler를 통해 모든 클라이언트에 방송
        try {
            alarmHandler.broadcastMessage(chatMessageDTO);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return chatMessageDTO;
    }

    @GetMapping("/{crno}")
    public List<ChatMessageDTO> getMessages(@PathVariable Long crno) {
        return chatMessageService.getAll(crno);
    }
}
