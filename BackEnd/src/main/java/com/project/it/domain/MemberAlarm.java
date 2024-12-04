package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Service
@Table(name = "tbl_memberAlarm")
public class MemberAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mano; // 번호

    private Long mno; // 멤버 번호

    private Long ino; // 이슈 번호

}
