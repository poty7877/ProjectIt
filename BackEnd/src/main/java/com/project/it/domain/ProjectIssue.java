package com.project.it.domain;

import com.project.it.constant.ProjectIssueStatus;
import com.project.it.constant.ProjectPriority;
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
@ToString(exclude = "replies")
@Table(name = "tbl_project_issue")
public class ProjectIssue extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ino; // issue 번호

    private String title; // 제목

    private String content; // 내용

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno")
    private Project project; // 어떤 프로젝트의 이슈인지

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mno")
    private ProjectMember projectMember; // 담당자. 누구에게 넘길껀지

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectIssueStatus status = ProjectIssueStatus.REGISTERED; // 상태

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProjectPriority priority = ProjectPriority.LOW; // 우선순위 결정.

    @Builder.Default
    private boolean isFiles = false; // 첨부파일 있는지 ?

    @OneToMany(mappedBy = "projectIssue", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ProjectIssueReply> replies = new ArrayList<>();


    // 내용 변경
    public void changeContent(String content) {
        this.content = content;
    }

    // 상태 변경
    public void changeStatus(ProjectIssueStatus status) {
        this.status = status;
    }

    // 우선순위 변경
    public void changePriority(ProjectPriority priority) {
        this.priority = priority;
    }

    // 파일 첨부여부 변경
    public void changeIsFiles(boolean isFiles) {
        this.isFiles = isFiles;
    }

}
