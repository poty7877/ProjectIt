package com.project.it.Repository;

import com.project.it.domain.ProjectIssueFiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectIssueFileRepository extends JpaRepository<ProjectIssueFiles, Long> {

    // ino와 연결된 List 불러오기
    List<ProjectIssueFiles> findAllByProjectIssueIno(Long ino);

}
