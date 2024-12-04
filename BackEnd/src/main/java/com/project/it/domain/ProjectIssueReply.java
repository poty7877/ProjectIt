package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Table(name = "tbl_projectIssueReply")
public class ProjectIssueReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rno; // 댓글 번호

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ino")
    private ProjectIssue projectIssue; // 어떤 프로젝트 이슈의 댓글인지 확인

    private String content; // 댓글 내용

    private String writer; // 작성자

    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now(); // 작성일
}
