package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentWriterAlarmDTO {

    private Long wano; // 번호

    private String writer; // 작성자

    private Long dno; // 문서번호
}
