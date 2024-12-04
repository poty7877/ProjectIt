package com.project.it.service;

import com.project.it.Repository.ChatRoomsRepository;
import com.project.it.Repository.ProjectRepository;
import com.project.it.domain.ChatRooms;
import com.project.it.domain.ChatUsers;
import com.project.it.dto.ChatRoomsDTO;
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
public class ChatRoomServiceImpl implements ChatRoomsService{

    private final ProjectRepository projectRepository;

    private final ChatRoomsRepository chatRoomsRepository;
    @Override
    public Long register(ChatRoomsDTO chatRoomsDTO) {
        ChatRooms chatRooms = dtoToEntity(chatRoomsDTO);
        chatRoomsRepository.save(chatRooms);
        return chatRooms.getCrno();
    }

    @Override
    public ChatRoomsDTO get(Long pno) {
        ChatRoomsDTO chatRoomsDTO = entityToDTO(chatRoomsRepository.findByProject(projectRepository.findById(pno).orElseThrow()));
        return chatRoomsDTO;
    }

    @Override
    public Long delete(Long crno) {
        chatRoomsRepository.deleteById(crno);
        return crno;
    }

    public ChatRoomsDTO entityToDTO(ChatRooms chatRooms) {
        List<Long> chatUsersIds = new ArrayList<>();
        // 채팅방에 속한 사용자들을 가져와서 ID만 추출
        for (ChatUsers chatUser : chatRooms.getChatUsers()) {
            chatUsersIds.add(chatUser.getProjectMember().getMno());  // 또는 적절한 필드로 설정
        }
        return new ChatRoomsDTO(
                chatRooms.getCrno(),
                chatRooms.getName(),
                chatRooms.getProject().getPno(),
                chatUsersIds
        );
    }

    public ChatRooms dtoToEntity(ChatRoomsDTO chatRoomsDTO) {
        return ChatRooms.builder()
                .name(chatRoomsDTO.getName())
                .crno(chatRoomsDTO.getCrno())
                .project(projectRepository.findById(chatRoomsDTO.getPno()).orElseThrow())
                .build();

    }
}
