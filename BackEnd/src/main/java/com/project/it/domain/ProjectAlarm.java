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
@Table(name = "tbl_projectAlarm")
public class ProjectAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pano; // 번호

    private Long pno; // 어떤 프로젝트인지

    private Long ino; // 어떤 이슈인지 [new] 띄우기 위함.

}
