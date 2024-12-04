package com.project.it.service;

import com.project.it.Repository.DocumentApproverAlarmRepository;
import com.project.it.Repository.DocumentRepository;
import com.project.it.constant.DocumentStatus;
import com.project.it.constant.ProjectStatus;
import com.project.it.domain.Document;
import com.project.it.domain.Project;
import com.project.it.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;

    private final DocumentApproverAlarmService documentApproverAlarmService;

    private final DocumentWriterAlarmService documentWriterAlarmService;

    @Override
    // DTO를 받아서 엔티티로 변경후 저장
    public Long register(DocumentDTO documentDTO) {
        Document document = dtoToEntity(documentDTO);
        Long mno = Long.valueOf(document.getMno());
        documentRepository.save(document);
        Long dno = document.getDno();
        DocumentApproverAlarmDTO documentApproverAlarmDTO = DocumentApproverAlarmDTO.builder()
                .mno(mno)
                .dno(dno)
                .build();
        documentApproverAlarmService.register(documentApproverAlarmDTO);
        return document.getDno();
    }

    @Override
    // dno 문서 번호를 받아서 객체를 찾고 DTO로 변경후 리턴
    public DocumentDTO get(Long dno) {
        Document document = documentRepository.findById(dno).orElseThrow();

        return entityToDto(document);
    }

    @Override
    // DTO를 받아 엔티티로 변경후 업데이트
    // 업데이트는 결재상태와, 결재일만 업데이트 됨.
    public Long update(DocumentDTO documentDTO) {
        log.info(documentDTO);
        log.info("업데이트!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        Document document = dtoToEntity(documentDTO);
        document.changeApproved(documentDTO.getApproved());
        document.changeApprovalDate(LocalDate.now());
        documentRepository.save(document);

        DocumentWriterAlarmDTO documentWriterAlarmDTO = DocumentWriterAlarmDTO.builder()
                .dno(document.getDno())
                .writer(document.getWriter())
                .build();
        documentWriterAlarmService.register(documentWriterAlarmDTO);
        return document.getDno();
    }

    @Override
    // dno를 받아 삭제
    public Long delete(Long dno) {
        documentRepository.deleteById(dno);
        return dno;
    }

    @Override
    // 결재 요청, 결재대기중인 리스트만 출력.
    public PageResponseDTO<DocumentDTO> getRequestedList(PageRequestDTO pageRequestDTO) {
        log.info("요청 리스트 출력 메서드 실행");
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Document> result = documentRepository.searchDocumentByApproved(DocumentStatus.REQUESTED, pageRequestDTO, pageable);

        List<DocumentDTO> dtoList = result.stream().map(
                document -> entityToDto(document)
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<DocumentDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    // 결재 완료 된 문서 리스트 출력
    public PageResponseDTO<DocumentDTO> getApprovedList(PageRequestDTO pageRequestDTO) {
        log.info("결재 완료 리스트 출력");
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Document> result = documentRepository.searchDocumentByApproved(DocumentStatus.APPROVED,pageRequestDTO, pageable);

        List<DocumentDTO> dtoList = result.stream().map(
                document -> entityToDto(document)
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<DocumentDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    // 결재 반려된 문서 리스트 출력
    public PageResponseDTO<DocumentDTO> getRejectedList(PageRequestDTO pageRequestDTO) {
        log.info("결재 반려 리스트 출력");
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Document> result = documentRepository.searchDocumentByApproved(DocumentStatus.REJECTED,pageRequestDTO,pageable);


        List<DocumentDTO> dtoList = result.stream().map(
                document -> entityToDto(document)
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<DocumentDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<DocumentDTO> getApproverList(Long mno, PageRequestDTO pageRequestDTO) {
        log.info("결재자 리스트 출력");
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Document> result = documentRepository.searchDocumentByMno(mno, pageRequestDTO, pageable);

        List<DocumentDTO> dtoList = result.stream().map(
                document -> {
                    DocumentDTO documentDTO = entityToDto(document);
                    boolean exist = documentApproverAlarmService.exists(documentDTO.getDno());
                    documentDTO.setNewIssue(exist);
                    return documentDTO;
                }
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<DocumentDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    @Override
    public PageResponseDTO<DocumentDTO> getWriterList(String writer, PageRequestDTO pageRequestDTO) {
        log.info("결재 반려 리스트 출력");
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Document> result = documentRepository.searchDocumentByWriter(writer, pageRequestDTO ,pageable);

        List<DocumentDTO> dtoList = result.stream().map(
                document -> {
                    DocumentDTO documentDTO = entityToDto(document);
                    boolean exist = documentWriterAlarmService.exists(documentDTO.getDno());
                    documentDTO.setNewIssue(exist);
                    return documentDTO;
                }
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<DocumentDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }

    // dto를 엔티티로 변경
    public Document dtoToEntity(DocumentDTO documentDTO) {
        Document document = Document.builder()
                .dno(documentDTO.getDno())
                .hano(documentDTO.getHano())
                .sano(documentDTO.getSano())
                .writer(documentDTO.getWriter())
                .description(documentDTO.getDescription())
                .approver(documentDTO.getApprover())
                .title(documentDTO.getTitle())
                .mno(documentDTO.getMno())
                .visibility(documentDTO.getVisibility())
                .approvalDate(documentDTO.getApprovalDate())
                .approved(documentDTO.getApproved())
                .build();
        log.info(document.toString());
        return document;
    }

    // 엔티티를 dto로 변경
    public DocumentDTO entityToDto(Document document) {
        DocumentDTO documentDTO = DocumentDTO.builder()
                .dno(document.getDno())
                .hano(document.getHano())
                .sano(document.getSano())
                .writer(document.getWriter())
                .description(document.getDescription())
                .title(document.getTitle())
                .approver(document.getApprover())
                .mno(document.getMno())
                .visibility(document.getVisibility())
                .approvalDate(document.getApprovalDate())
                .approved(document.getApproved())
                .regDate(document.getRegDate())
                .approvalDate(document.getApprovalDate())
                .build();
        log.info(documentDTO.toString());
        return documentDTO;
    }
}
