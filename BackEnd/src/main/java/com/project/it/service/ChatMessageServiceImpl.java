package com.project.it.service;

import com.project.it.Repository.ChatMessageRepository;
import com.project.it.domain.ChatMessage;
import com.project.it.dto.ChatMessageDTO;
import com.project.it.handler.AlarmHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    private final AlarmHandler alarmHandler;

    @Override
    public Long register(ChatMessageDTO chatMessageDTO) {
        ChatMessage chatMessage = dtoToDocument(chatMessageDTO);
        chatMessageRepository.save(chatMessage);
        // 저장된 메시지를 DTO로 변환하여 WebSocket으로 전송
        ChatMessageDTO savedChatMessageDTO = documentToDTO(chatMessage);

        return chatMessage.getCmno();
    }

    @Override
    public ChatMessageDTO get(Long cmno) {
        return null;
    }

    @Override
    public List<ChatMessageDTO> getAll(Long crno) {
        List<ChatMessage> chatMessageList = chatMessageRepository.findByCrno(crno);
        List<ChatMessageDTO> chatMessageDTOList = new ArrayList<>();

        for(ChatMessage chatMessage : chatMessageList){
            ChatMessageDTO chatMessageDTO = documentToDTO(chatMessage);
            chatMessageDTOList.add(chatMessageDTO);
        }

        return chatMessageDTOList;
    }

    public ChatMessageDTO documentToDTO(ChatMessage chatMessage) {
        ChatMessageDTO chatMessageDTO = ChatMessageDTO.builder()
                .message(chatMessage.getMessage())
                .cuno(chatMessage.getCuno())
                .cmno(chatMessage.getCmno())
                .createdAt(chatMessage.getTimestamp())
                .crno(chatMessage.getCrno())
                .build();
        log.info(chatMessageDTO);
        return chatMessageDTO;
    }

    public ChatMessage dtoToDocument(ChatMessageDTO chatMessageDTO) {
        ChatMessage chatMessage = ChatMessage.builder()
                .message(chatMessageDTO.getMessage())
                .cuno(chatMessageDTO.getCuno())
                .cmno(chatMessageDTO.getCmno())
                .timestamp(chatMessageDTO.getCreatedAt())
                .crno(chatMessageDTO.getCrno())
                .build();
        log.info(chatMessage);
        return chatMessage;
    }
}
