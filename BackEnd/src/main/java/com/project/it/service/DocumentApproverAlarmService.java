package com.project.it.service;

import com.project.it.dto.DocumentApproverAlarmDTO;

public interface DocumentApproverAlarmService {

    // C 등록
    void register(DocumentApproverAlarmDTO documentApproverAlarmDTO);

    // R 카운트 개수 조회
    Long documentApproverAlarmCount(Long mno);
    
    // D 삭제
    void delete(Long dno);

    // dno 있는 확인
    boolean exists(Long dno);
}
