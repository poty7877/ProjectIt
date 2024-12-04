package com.project.it.service;

import com.project.it.dto.ChatUserDTO;

import java.util.List;

public interface ChatUsersService {

    // C
    List<Long> register(List<ChatUserDTO> chatUserDTOs);

    // R
    List<ChatUserDTO> getChatUserDTO(Long crno);

    // D
    Long delete(Long mno);

}
