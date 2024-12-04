package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentRejectDTO {

    private Long drno; // 반려번호

    private DocumentDTO documentDTO; // 문서

    private String rejector; // 반려자

    private String reason; // 반려 사유
}
