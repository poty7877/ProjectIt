package com.project.it.Repository;

import com.project.it.domain.ChatMessage;
import com.project.it.domain.ChatRooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, Long> {
    List<ChatMessage> findByCrno(Long crno);  // 특정 채팅방에 있는 메시지들 찾기
}
