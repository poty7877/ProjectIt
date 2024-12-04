package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentApproverAlarmDTO {

    // 번호
    private Long aano;

    // 담당자 번호
    private Long mno;

    // 문서 번호
    private Long dno;
}
