package com.project.it.Repository;

import com.project.it.domain.Project;
import com.project.it.dto.PageRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProjectRepositoryCustom {
    // 검색조건 활성화 위함.
    Page<Project> searchProjects(PageRequestDTO pageRequestDTO, Pageable pageable);

    // 검색조건 활성화 (나의 프로젝트 보기)
    Page<Project> searchMyProjects(Long mno, PageRequestDTO pageRequestDTO, Pageable pageable);
}
