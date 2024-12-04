package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Builder
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_project_event")
public class ProjectEvent extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eno; // 이벤트 번호 (조회, 수정, 삭제용)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_pno")
    private Project project; // 프로젝트 번호(fk) 매핑

    private String title; // 제목

    private LocalDate start; // 이벤트 시작일

    private LocalDate end; // 이벤트 종료일

    @Builder.Default
    private Boolean isFisrt = false; // 처음으로 만들어진 이벤트인가 ?

    // 제목(내용) 변경 메서드
    public void changeTitle(String title) {
        this.title = title;
    }
    
    // 시작일 변경 메서드
    public void changeStart(LocalDate start) {
        this.start = start;
    }

    // 종료일 변경 메서드
    public void changeEnd(LocalDate end) {
        this.end = end;
    }

}
