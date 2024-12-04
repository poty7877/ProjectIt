package com.project.it.Repository;


import com.project.it.domain.ChatRooms;
import com.project.it.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomsRepository extends JpaRepository<ChatRooms, Long> {
    ChatRooms findByProject(Project project);  // 프로젝트에 해당하는 채팅방 찾기
}
