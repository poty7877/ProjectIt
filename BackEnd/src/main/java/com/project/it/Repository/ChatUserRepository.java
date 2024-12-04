package com.project.it.Repository;

import com.project.it.domain.ChatRooms;
import com.project.it.domain.ChatUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatUserRepository extends JpaRepository<ChatUsers, Long> {
    List<ChatUsers> findByChatRooms(ChatRooms chatRooms);  // 채팅방에 참여한 사용자들 찾기
}
