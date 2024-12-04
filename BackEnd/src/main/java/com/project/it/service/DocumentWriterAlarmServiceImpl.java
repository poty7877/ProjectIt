package com.project.it.service;

import com.project.it.Repository.DocumentWriterAlarmRepository;
import com.project.it.domain.DocumentWriterAlarm;
import com.project.it.dto.DocumentWriterAlarmDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class DocumentWriterAlarmServiceImpl implements DocumentWriterAlarmService {

    private final DocumentWriterAlarmRepository documentWriterAlarmRepository;


    @Override
    // 알림 등록
    public void register(DocumentWriterAlarmDTO documentWriterAlarmDTO) {
        DocumentWriterAlarm documentWriterAlarm = dtoToEntity(documentWriterAlarmDTO);
        documentWriterAlarmRepository.save(documentWriterAlarm);

    }

    @Override
    // 개수
    public Long documentWriterAlarmCount(String writer) {
        return documentWriterAlarmRepository.countByWriter(writer);
    }

    @Override
    // 알림 클릭시 삭제
    public void delete(Long dno) {
        if (exists(dno)) {
            documentWriterAlarmRepository.deleteByDno(dno);
        }
    }

    @Override
    // dno 있는지 확인
    public boolean exists(Long dno) {
        return documentWriterAlarmRepository.existsByDno(dno);
    }

    public DocumentWriterAlarm dtoToEntity(DocumentWriterAlarmDTO documentWriterAlarmDTO) {
        return DocumentWriterAlarm.builder()
                .wano(documentWriterAlarmDTO.getWano())
                .dno(documentWriterAlarmDTO.getDno())
                .writer(documentWriterAlarmDTO.getWriter())
                .build();
    }
}
