package com.project.it.Repository;

import com.project.it.domain.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long>, ProjectRepositoryCustom {

    // 프로젝트 삭제 여부에 따라 리스트 불러오기
    Page<Project> findAllByIsDeleted(Boolean isDeleted, Pageable pageable);

}
