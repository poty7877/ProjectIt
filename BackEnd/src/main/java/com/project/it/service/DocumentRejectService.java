package com.project.it.service;

import com.project.it.domain.DocumentReject;
import com.project.it.dto.DocumentRejectDTO;

public interface DocumentRejectService {

    // C 반려사유 등록
    Long register(DocumentRejectDTO documentRejectDTO);

    // R  dno를 이용해 반려사유 가져옴
    DocumentRejectDTO get(Long dno);

    // U 반려사유 업데이트
    Long update(DocumentRejectDTO documentRejectDTO);
}
