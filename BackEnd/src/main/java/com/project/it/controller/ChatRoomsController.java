package com.project.it.controller;

import com.project.it.dto.ChatMessageDTO;
import com.project.it.dto.ChatRoomsDTO;
import com.project.it.service.ChatMessageService;
import com.project.it.service.ChatRoomsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatroom")
@RequiredArgsConstructor
@Log4j2
public class ChatRoomsController {

    private final ChatRoomsService chatRoomsService;


    @GetMapping("/{pno}")
    public ChatRoomsDTO get(@PathVariable Long pno) {

        return chatRoomsService.get(pno);
    }




}
