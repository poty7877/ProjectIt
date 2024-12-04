package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "chatRooms")
@Table(name = "tbl_chatUsers")
public class ChatUsers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cuno; // 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crno")
    private ChatRooms chatRooms; // 채팅방

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mno")
    private ProjectMember projectMember; // 프로젝트 참여인원
}
