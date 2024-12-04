package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_project_member")
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pmno; // 인덱스용 번호
    // 프로젝트 아이디
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_pno")
    private Project project;
    // 사원번호
    private Long mno;
    // 이름
    private String name;
    // 소속
    private String team;
    // 직위
    private String memberRole;

}
