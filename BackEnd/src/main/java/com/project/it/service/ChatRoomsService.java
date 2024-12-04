package com.project.it.service;

import com.project.it.dto.ChatRoomsDTO;

public interface ChatRoomsService {

    // C
    Long register(ChatRoomsDTO chatRoomsDTO);

    // R
    ChatRoomsDTO get(Long pno);

    // D
    Long delete(Long crno);
}
