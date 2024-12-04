package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomsDTO {

    private Long crno; // 채팅방 번호

    private String name; // 방제목

    private Long pno; // 프로젝트 번호

    private List<Long> chatUsersIds; // 참여중인 멤버 리스트


}
