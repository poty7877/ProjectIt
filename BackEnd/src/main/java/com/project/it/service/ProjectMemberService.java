package com.project.it.service;

import com.project.it.domain.ProjectMember;
import com.project.it.dto.ProjectMemberDTO;

import java.util.List;

public interface ProjectMemberService {
    // C 프로젝트 참여 인원 생성
    List<Long> register(List<ProjectMemberDTO> projectMemberDTOs);

    // R 프로젝트 참여 인원 조회
    List<ProjectMemberDTO> getList(Long projectId);

    // D 프로젝트 참여 인원 삭제
    void delete(Long pno, Long mno);

    // 한명 조회
    ProjectMemberDTO getOne(Long mno, Long pno);

    // 엔티티를 DTO로 변경해줌.
    ProjectMemberDTO entityToDTO(ProjectMember projectMember);
}
