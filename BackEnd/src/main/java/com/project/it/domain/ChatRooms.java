package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(exclude = "project")
@Table(name = "tbl_chatRooms")
public class ChatRooms {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long crno;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno")
    private Project project;

    private String name; // 채팅방 이름

    @OneToMany(mappedBy = "chatRooms", cascade = CascadeType.ALL)
    private List<ChatUsers> chatUsers = new ArrayList<>();

}
