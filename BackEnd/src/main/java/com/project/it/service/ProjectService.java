package com.project.it.service;

import com.project.it.domain.Project;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.dto.ProjectDTO;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface ProjectService {

    // C 프로젝트 생성
    Long registerProject(ProjectDTO projectDTO);

    // R 프로젝트 조회
    ProjectDTO getProject(Long pno);

    // U 프로젝트 수정
    void updateProject(ProjectDTO projectDTO);

    // DU 프로젝트 삭제 상태 변경
    void deleteProject(Long pno);

    // D 프로젝트 영구 삭제
    void foreverDeleteProject(Long pno);

    // DC 프로젝트 삭제 상태 복구
    void deleteCancelProject(Long pno);

    // 삭제된 List
    PageResponseDTO<ProjectDTO> getDeletedList(PageRequestDTO pageRequestDTO);

    // 엔티티를 dto로 바꿈
     ProjectDTO entityToDTO(Project project);

    // dto를 엔티티로 바꿈
     Project dtoToEntity(ProjectDTO projectDTO);

    // 검색 조건을 포함한 프로젝트 리스트 조회
    PageResponseDTO<ProjectDTO> searchProjects(PageRequestDTO pageRequestDTO);

    // 검색 조건을 포함한 나의 프로젝트 리스트 조회
    PageResponseDTO<ProjectDTO> searchMyProjects(Long mno, PageRequestDTO pageRequestDTO);


}
