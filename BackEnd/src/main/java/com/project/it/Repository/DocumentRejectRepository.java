package com.project.it.Repository;

import com.project.it.domain.DocumentReject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRejectRepository extends JpaRepository<DocumentReject, Long> {

    // dno 문서 번호를 이용해 반려사유를 찾아옴
    DocumentReject findByDocumentDno(Long dno);

}
