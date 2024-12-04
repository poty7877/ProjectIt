package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatUserDTO {

    private Long cuno; // 채팅방 유저 번호

    private Long crno; // 채팅방 번호

    private Long mno; // 멤버 번호

}
