package com.project.it.service;

import com.project.it.dto.ChatMessageDTO;

import java.util.List;

public interface ChatMessageService {

    // C 메시지 작성
    Long register(ChatMessageDTO chatMessageDTO);

    // R 메시지 보기
    ChatMessageDTO get(Long cmno);

    // R 특정 채팅방의 메시지 리스트
    List<ChatMessageDTO> getAll(Long crno);
}
