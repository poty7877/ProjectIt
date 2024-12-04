package com.project.it.service;

import com.project.it.Repository.DocumentRejectRepository;
import com.project.it.Repository.DocumentRepository;
import com.project.it.domain.Document;
import com.project.it.domain.DocumentReject;
import com.project.it.dto.DocumentDTO;
import com.project.it.dto.DocumentRejectDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Log4j2
public class DocumentRejectServiceImpl implements DocumentRejectService {

    private final DocumentRejectRepository documentRejectRepository;

    private final DocumentService documentService;

    @Override
    // 반려사유 등록
    public Long register(DocumentRejectDTO documentRejectDTO) {
        DocumentReject documentReject = dtoToEntity(documentRejectDTO);
        documentRejectRepository.save(documentReject);
        return documentReject.getDrno();
    }

    @Override
    // dno로 반려사유 가져옴
    public DocumentRejectDTO get(Long dno) {
        DocumentReject documentReject = documentRejectRepository.findByDocumentDno(dno);
        DocumentRejectDTO documentRejectDTO = entityToDto(documentReject);
        log.info(documentRejectDTO);
        return documentRejectDTO;
    }

    @Override
    // 반려 사유 수정
    public Long update(DocumentRejectDTO documentRejectDTO) {
        DocumentReject documentReject = dtoToEntity(documentRejectDTO);
        documentRejectRepository.save(documentReject);
        return documentRejectDTO.getDrno();
    }

    public DocumentReject dtoToEntity(DocumentRejectDTO documentRejectDTO) {
        Document document = documentService.dtoToEntity(documentRejectDTO.getDocumentDTO());
        DocumentReject documentReject = DocumentReject.builder()
                .drno(documentRejectDTO.getDrno())
                .document(document)
                .reason(documentRejectDTO.getReason())
                .rejector(documentRejectDTO.getRejector())
                .build();
        log.info(documentReject);
        return documentReject;
    }

    public DocumentRejectDTO entityToDto(DocumentReject documentReject) {
        DocumentDTO documentDTO = documentService.entityToDto(documentReject.getDocument());
        DocumentRejectDTO documentRejectDTO = DocumentRejectDTO.builder()
                .drno(documentReject.getDrno())
                .documentDTO(documentDTO)
                .reason(documentReject.getReason())
                .rejector(documentReject.getRejector())
                .build();
        log.info(documentRejectDTO);
        return documentRejectDTO;
    }

}
