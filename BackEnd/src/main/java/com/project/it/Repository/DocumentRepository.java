package com.project.it.Repository;

import com.project.it.constant.DocumentStatus;
import com.project.it.domain.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long>, DocumentRepositoryCustom {



}
