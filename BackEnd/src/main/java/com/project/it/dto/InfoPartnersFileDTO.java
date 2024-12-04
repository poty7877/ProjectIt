package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InfoPartnersFileDTO {

    private Long fno; // 파일 번호

    private String oldFileName; // 원본 파일 이름

    private String fileName; // 저장되는 파일 이름

    private String filePath; // 파일 경로

    private Long cno; // 고객사 번호

}
