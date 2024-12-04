package com.project.it.dto;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ProjectIssueFilesDTO {

    private Long fno; // 파일 번호

    private String oldFileName; // 원본 파일 이름

    private String fileName; // 파일이름

    private String filePath; // 파일경로

    private Long ino; // 이슈 번호

}
