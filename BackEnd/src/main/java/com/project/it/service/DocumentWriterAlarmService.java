package com.project.it.service;

import com.project.it.dto.DocumentWriterAlarmDTO;

public interface DocumentWriterAlarmService {

    // C
    void register(DocumentWriterAlarmDTO documentWriterAlarmDTO);

    // R
    Long documentWriterAlarmCount(String writer);

    // D
    void delete(Long dno);

    // dno 있는지 확인
    boolean exists(Long dno);
}
