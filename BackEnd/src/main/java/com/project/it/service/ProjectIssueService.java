package com.project.it.service;

import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.dto.ProjectIssueDTO;

public interface ProjectIssueService {

    // C
    Long register(ProjectIssueDTO projectIssueDTO);

    // R
    ProjectIssueDTO get(Long ino);

    // U
    Long update(ProjectIssueDTO projectIssueDTO);

    // D
    Long delete(Long ino);

    // Count
    int count(Long pno);

    // mno null count
    int mcount(Long pno);

    // List
    PageResponseDTO<ProjectIssueDTO> getList(Long pno, PageRequestDTO pageRequestDTO);

    // MyList
    PageResponseDTO<ProjectIssueDTO> getMyList(Long mno, PageRequestDTO pageRequestDTO);

    // NullList
    PageResponseDTO<ProjectIssueDTO> getNullList(Long pno, PageRequestDTO pageRequestDTO);

}
