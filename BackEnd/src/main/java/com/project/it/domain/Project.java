package com.project.it.domain;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import com.project.it.constant.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "tbl_project")
@ToString
public class Project extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno; // 프로젝트 번호

    private String title; // 프로젝트 제목

    @Column(name = "start_date")
    private LocalDate startDate; // 프로젝트 시작일

    @Column(name = "due_date")
    private LocalDate dueDate; // 프로젝트 마감일

    private String content; // 프로젝트 내용

    @Enumerated
    @Builder.Default
    private ProjectStatus status = ProjectStatus.PROGRESS; // 프로젝트 진행상태, 기본값 진행중!

    // private List<SoftWare> softwares = new ArrayList(); // 소프트웨어
    @Builder.Default
    private String version = "1.0.0"; // 버젼관리

    @Builder.Default
    @JsonSetter(nulls = Nulls.SKIP)  // null이 들어오면 건너뜀
    private Boolean isDeleted = false; // 삭제여부, 기본값 false

    private double progress; // 진행률

    private Boolean projectType; // 외부프로젝트인지 ? 내부 프로젝트인지?

    private Long mno; // 프로젝트 담당자 번호
    
    private String name; // 담당자 이름

    // 삭제여부 변경
    public void changeIsDelete(Boolean isDeleted) { this.isDeleted = isDeleted; }

    // 상태변경
    public void changeStatus(ProjectStatus status) {
        this.status = status;
    }

    // 제목 변경
    public void changeTitle(String title) { // 제목변경
        this.title = title;
    }

    // 내용 변경
    public void changeContent(String content) { // 내용변경
        this.content = content;
    }

    // 마감일 변경
    public void changeDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    // 버젼 변경
    public void changeVersion(String version) {
        this.version = version;
    }





}
