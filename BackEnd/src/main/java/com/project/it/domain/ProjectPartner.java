package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "tbl_project_partner")
public class ProjectPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ppno; // id

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno")
    private Project project; // 프로젝트

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno")
    private InfoPartners infoPartners; // 고객사
    
    private String name; // 고객사 담당자
    
    private String email; // 담당자 이메일
    
    private String phone; // 담당자 연락처
    
    private String request; // 고객사 요청사항
}
