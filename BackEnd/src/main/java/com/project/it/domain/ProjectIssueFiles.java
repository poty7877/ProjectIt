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
@Table(name = "tbl_projectIssueFiles")
public class ProjectIssueFiles extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fno; // 파일번호

    // 서버에 저장된 파일 이름
    private String fileName;

    // 원본 파일이름
    private String oldFileName;

    // 파일 경로
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ino")
    private ProjectIssue projectIssue; // 프로젝트 이슈 연결

}
