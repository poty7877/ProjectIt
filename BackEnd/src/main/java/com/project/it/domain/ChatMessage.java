package com.project.it.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "chatMessages")
public class ChatMessage {

    @Id
    private Long cmno; // 메시지 번호

    private Long crno; // 채팅방 번호

    private Long cuno; // 메세지 보낸사람

    private String message; // 메시지 내용

    private LocalDateTime timestamp; // 메시지 작성 시간


}
