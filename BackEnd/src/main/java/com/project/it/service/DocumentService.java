package com.project.it.service;

import com.project.it.domain.Document;
import com.project.it.dto.DocumentDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;

public interface DocumentService {

    // C
    Long register(DocumentDTO documentDTO);

    // R
    DocumentDTO get(Long dno);

    // U
    Long update(DocumentDTO documentDTO);

    // D
    Long delete(Long dno);

    // 결재 요청 리스트
    PageResponseDTO<DocumentDTO> getRequestedList(PageRequestDTO pageRequestDTO);

    // 결재 승인 리스트
    PageResponseDTO<DocumentDTO> getApprovedList(PageRequestDTO pageRequestDTO);

    // 결재 반려 리스트
    PageResponseDTO<DocumentDTO> getRejectedList(PageRequestDTO pageRequestDTO);

    // 결재자 리스트
    PageResponseDTO<DocumentDTO> getApproverList(Long mno, PageRequestDTO pageRequestDTO);

    // 작성자 리스트
    PageResponseDTO<DocumentDTO> getWriterList(String writer, PageRequestDTO pageRequestDTO);

    // dtoToEntity
    Document dtoToEntity(DocumentDTO documentDTO);

    // entityToDto
    DocumentDTO entityToDto(Document document);

}
