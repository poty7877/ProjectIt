package com.project.it.Repository;

import com.project.it.constant.DocumentStatus;
import com.project.it.domain.Document;
import com.project.it.dto.PageRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DocumentRepositoryCustom {

    // Approved : 결재 상태에 따른 페이징 검색결과처리
    Page<Document> searchDocumentByApproved(DocumentStatus status, PageRequestDTO pageRequestDTO, Pageable pageable);

    // Mno : 결재자 리스트 페이징 검색결과 처리
    Page<Document> searchDocumentByMno(Long mno, PageRequestDTO pageRequestDTO, Pageable pageable);

    // Writer :  작성자 리스트 페이징 검색 결과 처리
    Page<Document> searchDocumentByWriter(String writer, PageRequestDTO pageRequestDTO, Pageable pageable);
}
