package com.project.it.service;

import com.project.it.Repository.DocumentApproverAlarmRepository;
import com.project.it.domain.DocumentApproverAlarm;
import com.project.it.dto.DocumentApproverAlarmDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class DocumentApproverAlarmServiceImpl implements DocumentApproverAlarmService {

    private final DocumentApproverAlarmRepository documentApproverAlarmRepository;

    @Override
    // 문서 등록시 결재자 에게 알람. 결재시 작성자에게 알람
    public void register(DocumentApproverAlarmDTO documentApproverAlarmDTO) {
        DocumentApproverAlarm documentApproverAlarm = dtoToEntity(documentApproverAlarmDTO);
        documentApproverAlarmRepository.save(documentApproverAlarm);
        log.info("알람 등록 : " + documentApproverAlarmDTO);
    }

    @Override
    // mno를 이용해 개수 가져오기
    public Long documentApproverAlarmCount(Long mno) {
        return documentApproverAlarmRepository.countByMno(mno);
    }

    @Override
    // 삭제
    public void delete(Long dno) {
        if(exists(dno)) {
            documentApproverAlarmRepository.deleteByDno(dno);
        }
    }

    @Override
    // 존재하는지 확인
    public boolean exists(Long dno) {
        return documentApproverAlarmRepository.existsByDno(dno);
    }

    public DocumentApproverAlarm dtoToEntity(DocumentApproverAlarmDTO documentApproverAlarmDTO) {
        return DocumentApproverAlarm.builder()
                .aano(documentApproverAlarmDTO.getAano())
                .dno(documentApproverAlarmDTO.getDno())
                .mno(documentApproverAlarmDTO.getMno())
                .build();
    }
}
