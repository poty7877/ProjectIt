package com.project.it.service;

import com.project.it.Repository.ProjectEventRepository;
import com.project.it.Repository.ProjectRepository;
import com.project.it.domain.Project;
import com.project.it.domain.ProjectEvent;
import com.project.it.dto.ProjectDTO;
import com.project.it.dto.ProjectEventDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ProjectEventServiceImpl implements ProjectEventService {

    private final ProjectEventRepository projectEventRepository;

    private final ProjectRepository projectRepository;

    @Override
    public Long register(ProjectEventDTO projectEventDTO) {
        // DTO를 받아, 엔티티로 변경후 DB에 저장
        ProjectEvent projectEvent = dtoToEntity(projectEventDTO);
        projectEventRepository.save(projectEvent);
        log.info("ProjectEventService.register() 메서드 실행");
        return projectEvent.getEno();
    }

    @Override
    public ProjectEventDTO get(Long eno) {
        // eno, 이벤트번호를 이용하여 객체를 찾아온후 리턴
        ProjectEvent projectEvent = projectEventRepository.findById(eno).orElseThrow();
        ProjectEventDTO projectEventDTO = entityToDto(projectEvent);
        log.info("ProjectEventService.get() 메서드 실행" + projectEventDTO);
        return projectEventDTO;
    }

    @Override
    public List<ProjectEventDTO> getAll(Long pno) {
        // pno, 프로젝트 번호를 이용하여, 해당 프로젝트와 관련된 모든 이벤트(일정)를 불러옴
        log.info("ProjectEventService.getAll() 메서드 실행");
        List<ProjectEvent> projectEvents = projectEventRepository.findByProjectPno(pno);
        List<ProjectEventDTO> projectEventDTOs = new ArrayList<>();
        projectEvents.forEach(projectEvent -> {
            ProjectEventDTO projectEventDTO = entityToDto(projectEvent);
            projectEventDTOs.add(projectEventDTO);
        });
        return projectEventDTOs;
    }


    @Override
    public Long update(ProjectEventDTO projectEventDTO) {
        // DTO를 이용하여 특정 이벤트를 수정
        log.info("ProjectEventService.update() 메서드 실행");
        ProjectEvent projectEvent = dtoToEntity(projectEventDTO);
        log.info("=================" + projectEvent);
        projectEvent.changeTitle(projectEventDTO.getTitle());
        projectEvent.changeStart(projectEventDTO.getStart());
        projectEvent.changeEnd(projectEventDTO.getEnd());

        // 만약 event가 처음 만들어진 이벤트이면 ?
        if(projectEvent.getIsFisrt()) {
            // 이벤트가 수정될때 pno, 즉 프로젝트의 마감일도 같이 변경되어야함.
            Project project = projectRepository.findById(projectEventDTO.getPno()).orElseThrow();
            project.changeDueDate(projectEventDTO.getEnd());
            projectRepository.save(project);
        }

        projectEventRepository.save(projectEvent);
        return projectEvent.getEno();
    }

    @Override
    public Long delete(Long eno) {
        // 삭제
        log.info("ProjectEventService.delete() 메서드 실행");
        projectEventRepository.deleteById(eno);
        return eno;
    }

    @Override
    public List<ProjectEventDTO> getMyList(Long mno) {
        List<ProjectEvent> result = projectEventRepository.findAllByMno(mno);
        return result.stream().map(this::entityToDto).toList();
    }


    // DTO를 엔티티로 변환하는 메서드
    public ProjectEvent dtoToEntity(ProjectEventDTO projectEventDTO) {
        log.info(projectEventDTO.getPno());
        Project project = projectRepository.findById(projectEventDTO.getPno()).orElseThrow();
        return ProjectEvent.builder()
                .eno(projectEventDTO.getEno())
                .title(projectEventDTO.getTitle())
                .project(project)
                .end(projectEventDTO.getEnd())
                .isFisrt(projectEventDTO.getIsFirst())
                .start(projectEventDTO.getStart())
                .build();
    }

    // 엔티티를 DTO로 변환하는 메서드
    public ProjectEventDTO entityToDto(ProjectEvent projectEvent) {
        return ProjectEventDTO.builder()
                .eno(projectEvent.getEno())
                .title(projectEvent.getTitle())
                .end(projectEvent.getEnd())
                .isFirst(projectEvent.getIsFisrt())
                .start(projectEvent.getStart())
                .regDate(projectEvent.getRegDate())
                .updateDate(projectEvent.getUpdateDate())
                .pno(projectEvent.getProject().getPno())
                .build();
    }
}
