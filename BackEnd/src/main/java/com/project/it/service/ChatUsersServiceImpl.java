package com.project.it.service;

import com.project.it.Repository.ChatRoomsRepository;
import com.project.it.Repository.ChatUserRepository;
import com.project.it.Repository.ProjectMemberRepository;
import com.project.it.domain.ChatRooms;
import com.project.it.domain.ChatUsers;
import com.project.it.domain.ProjectMember;
import com.project.it.dto.ChatUserDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ChatUsersServiceImpl implements ChatUsersService {

    private final ProjectMemberRepository projectMemberRepository;

    private final ChatRoomsRepository chatRoomsRepository;
    private final ChatUserRepository chatUserRepository;

    @Override
    public List<Long> register(List<ChatUserDTO> chatUserDTOs) {
        chatUserDTOs.forEach(System.out::println);
        List<ChatUsers> chatUsers = chatUserDTOs.stream()
                .map(chatUserDTO -> dtoToEntity(chatUserDTO)) // DTO를 Entity로 변환
                .collect(Collectors.toList()); // 변환된 Entity 객체들을 리스트에 모은다
        chatUsers.forEach(System.out::println);

        // 변환된 chatUsers를 저장하고, 저장된 객체들의 ID를 반환
        List<ChatUsers> savedChatUsers = chatUserRepository.saveAll(chatUsers); // 실제 저장하는 부분
        return savedChatUsers.stream()
                .map(ChatUsers::getCuno) // 저장된 chatUser 객체에서 ID만 추출
                .collect(Collectors.toList()); // ID 리스트로 변환
    }


    @Override
    public List<ChatUserDTO> getChatUserDTO(Long crno) {
        List<ChatUsers> chatUsers = chatUserRepository.findByChatRooms(chatRoomsRepository.findById(crno).orElseThrow());

        List<ChatUserDTO> chatUserDTOSs = chatUsers.stream()
                .map(chatUser -> entityToDto(chatUser))
                .collect(Collectors.toList());

        return chatUserDTOSs;
    }

    @Override
    public Long delete(Long mno) {
        return 0L;
    }

    public ChatUserDTO entityToDto(ChatUsers chatUsers) {
        return ChatUserDTO.builder()
                .cuno(chatUsers.getCuno())
                .crno(chatUsers.getChatRooms().getCrno())
                .mno(chatUsers.getProjectMember().getMno())
                .build();
    }

    public ChatUsers dtoToEntity(ChatUserDTO chatUserDTO) {
        // ChatRoom이 존재하지 않으면 예외를 던짐
        ChatRooms chatRooms = chatRoomsRepository.findById(chatUserDTO.getCrno())
                .orElseThrow();

        System.out.println("룸" + chatUserDTO);
        // ProjectMember가 존재하지 않으면 예외를 던짐
        ProjectMember projectMember = projectMemberRepository.findById(chatUserDTO.getMno())
                .orElseThrow();

        System.out.println("프로젝트멤바" + projectMember);
        // ChatUsers 엔티티를 빌더 패턴을 사용하여 생성
        return ChatUsers.builder()
                .chatRooms(chatRooms)  // 채팅방 설정
                .projectMember(projectMember)  // 프로젝트 멤버 설정
                .build();
    }

}
