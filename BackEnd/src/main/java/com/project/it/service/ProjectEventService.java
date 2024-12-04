package com.project.it.service;

import com.project.it.domain.ProjectEvent;
import com.project.it.dto.ProjectEventDTO;

import java.util.List;


public interface ProjectEventService {

    // C 이벤트 생성
    Long register(ProjectEventDTO projectEventDTO);

    // R 이벤트 조회
    ProjectEventDTO get(Long eno);

    // List 이벤트 리스트
    List<ProjectEventDTO> getAll(Long pno);

    // U 이벤트 수정
    Long update(ProjectEventDTO projectEventDTO);

    // D 이벤트 삭제
    Long delete(Long eno);

    // List 내 프로젝트 이벤트 리스트
    List<ProjectEventDTO> getMyList(Long mno);
}
