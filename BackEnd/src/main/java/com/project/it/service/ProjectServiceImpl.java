package com.project.it.service;

import com.project.it.Repository.ProjectEventRepository;
import com.project.it.Repository.ProjectIssueRepository;
import com.project.it.constant.ProjectStatus;
import com.project.it.domain.Project;
import com.project.it.domain.ProjectEvent;
import com.project.it.dto.ChatRoomsDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.dto.ProjectDTO;
import com.project.it.Repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@Transactional
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectEventRepository projectEventRepository;
    private final ProjectIssueRepository projectIssueRepository;
    private final ProjectAlarmService projectAlarmService;
    private final ChatRoomsService chatRoomsService;

    @Override
    // 등록하는 메서드
    // DTO를 받아서 entity로 변환후 등록 함
    public Long registerProject(ProjectDTO projectDTO) {
        Double progress = progressRate(projectDTO);
        projectDTO.setProgress(progress);
        Project project = dtoToEntity(projectDTO);
        log.info("ProjectServiceImpl.registerProject()메서드 실행 ");
        // 저장
        projectRepository.save(project);
        log.info(project.getProgress());
        ChatRoomsDTO chatRoomsDTO = ChatRoomsDTO.builder()
                .name(project.getTitle() + "채팅방")
                .pno(project.getPno())
                .build();
        chatRoomsService.register(chatRoomsDTO);
        return project.getPno();
    }

    @Override
    // 조회 메서드
    // id를 받아서 entity를 조회후 dto로 변환해서 보내줌
    public ProjectDTO getProject(Long pno) {
        log.info("ProjectServiceImpl.getProject()메서드 실행 ");
        Optional<Project> result = projectRepository.findById(pno);
        Project project = result.orElseThrow();// 객체 찾아옴
        ProjectDTO projectDTO = entityToDTO(project); // DTO로 변환
        projectDTO.setProgress(progressRate(projectDTO));
        log.info("projectDTO : " + projectDTO);
        return projectDTO; // 리턴
    }

    @Override
    // 수정 메서드
    // DTO를 받아  entity로 변환후 바뀐정보만 업데이트후 저장
    public void updateProject(ProjectDTO projectDTO) {
        Double progress = progressRate(projectDTO);
        log.info("ProjectServiceImpl.updateProject() 메서드 실행");
        Optional<Project> result = projectRepository.findById(projectDTO.getPno());
        Project project = result.orElseThrow(); // 객체 찾아옴

        // 정보 변경 하기
        project.changeTitle(projectDTO.getTitle());
        project.changeStatus(projectDTO.getStatus());
        project.changeContent(projectDTO.getContent());
        project.setProgress(progress);
        String newVersion = incrementVersion(projectDTO.getVersion());
        project.changeVersion(newVersion);

        // 먼저 DTO에서 pno를 이용해 project객체 조회
        // projectDTO와 project의 마감일을 비교해 서로 다르면
        // 기존 프로젝트의 마감일과, DTO로 받은 날짜가 다르면
        if (!project.getDueDate().equals(projectDTO.getDueDate())) {
            project.changeDueDate(projectDTO.getDueDate());
            // 업데이트 후 삭제불가능한 첫번째 이벤트의 마감일을 변경함.
            List<ProjectEvent> projectEvents = projectEventRepository.findByProjectPno(projectDTO.getPno());
            projectEvents.stream()
                    .filter(projectEvent -> Boolean.TRUE.equals(projectEvent.getIsFisrt()))
                    .findFirst()
                    .ifPresent(event -> event.setEnd(projectDTO.getDueDate()));
            projectEventRepository.saveAll(projectEvents);
        }
        if(progress == 100.0) {
            project.changeStatus(ProjectStatus.COMPLETE);
        }


        // 변경된 정보 저장
        projectRepository.save(project);
        log.info("project" + project);
    }

    @Override
    // 삭제 메서드
    // 번호를 받아 객체의 삭제여부를 true로 변경
    public void deleteProject(Long pno) {
        Optional<Project> result = projectRepository.findById(pno);
        Project project = result.orElseThrow();
        project.setIsDeleted(true);
        projectRepository.save(project);
    }

    @Override
    // 영구 삭제 메서드
    // 번호를 받아 객체를 db에서 삭제
    public void foreverDeleteProject(Long pno) {
        projectRepository.deleteById(pno);
    }

    @Override
    // 삭제 복원 메서드
    // 번호를 받아 객체의 삭제여부를 false로 변경
    public void deleteCancelProject(Long pno) {
        Optional<Project> result = projectRepository.findById(pno);
        Project project = result.orElseThrow();
        project.setIsDeleted(false);
        projectRepository.save(project);
    }


    @Override
    public PageResponseDTO<ProjectDTO> getDeletedList(PageRequestDTO pageRequestDTO) {
        log.info("true 리스트 출력 메서드 실행");
        // page와 size받아서 pno로 내림차순 정렬
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                Sort.by("pno").descending());

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Project> result = projectRepository.findAllByIsDeleted(true, pageable);

        // 찾아온 엔티티를 DTO로 변환후 리스트화
        List<ProjectDTO> dtoList = result.stream().map(
                project -> entityToDTO(project)
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<ProjectDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();

    }

    @Override
    public PageResponseDTO<ProjectDTO> searchMyProjects(Long mno, PageRequestDTO pageRequestDTO) {
        log.info("내 리스트 출력 메서드 실행");

        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "pno";
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        // pageable 이용해서 페이지 불러옴. (1페이지, 10개)
        Page<Project> result = projectRepository.searchMyProjects(mno,pageRequestDTO, pageable);

        List<ProjectDTO> dtoList = result.stream().map(
                project -> {
                    ProjectDTO dto = entityToDTO(project); // DTO 생성
                    dto.setProgress(progressRate(dto));    // 진행률 설정
                    dto.setIssueCount(count(dto.getPno()));

                    // 진행률이 100%인 경우만 처리
                    if (dto.getProgress() == 100.0 && !dto.getStatus().equals(ProjectStatus.COMPLETE)) {
                        dto.setStatus(ProjectStatus.COMPLETE);
                        updateProject(dto);
                        projectRepository.save(project);  // 변경된 프로젝트만 저장
                        System.out.println("Project marked as COMPLETE and updated: " + dto.getPno());
                    }

                    Long newIssueCount = projectAlarmService.projectAlarmCount(dto.getPno());
                    dto.setNewIssueCount(newIssueCount);
                    return dto;
                }
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<ProjectDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }


    // 엔티티를 dto로 바꿔주는 메서드
    public ProjectDTO entityToDTO(Project project) {
        return ProjectDTO.builder()
                .pno(project.getPno())
                .title(project.getTitle())
                .content(project.getContent())
                .regDate(project.getRegDate())
                .updateDate(project.getUpdateDate())
                .startDate(project.getStartDate())
                .progress(project.getProgress())
                .projectType(project.getProjectType())
                .name(project.getName())
                .dueDate(project.getDueDate())
                .content(project.getContent())
                .version(project.getVersion())
                .status(project.getStatus())
                .mno(project.getMno())
                .isDeleted(project.getIsDeleted())
                .build();
    }

    // dto를 entity로 바꿔주는 메서드
    public Project dtoToEntity(ProjectDTO projectDTO) {
        return Project.builder()
                .pno(projectDTO.getPno())
                .title(projectDTO.getTitle())
                .content(projectDTO.getContent())
                .startDate(projectDTO.getStartDate())
                .dueDate(projectDTO.getDueDate())
                .projectType(projectDTO.getProjectType())
                .progress(projectDTO.getProgress())
                .content(projectDTO.getContent())
                .version(projectDTO.getVersion())
                .name(projectDTO.getName())
                .status(projectDTO.getStatus())
                .isDeleted(projectDTO.getIsDeleted())
                .mno(projectDTO.getMno())
                .build();
    }

    @Override
    public PageResponseDTO<ProjectDTO> searchProjects(PageRequestDTO pageRequestDTO) {
        log.info("sort 확인 해야겠음" + pageRequestDTO.getSort());
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "pno";
        log.info("두번째" + sortBy);
        Pageable pageable = null;
        // page와 size받아서 pno로 내림차순 정렬
        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        log.info("페이지어블" + pageable);

        // 검색 조건을 기반으로 프로젝트 리스트를 검색
        Page<Project> result = projectRepository.searchProjects(pageRequestDTO, pageable);

        List<ProjectDTO> dtoList = result.stream().map(
                project -> {
                    ProjectDTO dto = entityToDTO(project); // DTO 생성
                    if (project.getProgress() != dto.getProgress()) {
                        project.setProgress(progressRate(dto));
                        dto.setProgress(progressRate(dto));    // 진행률 설정
                    }
                    dto.setIssueCount(count(dto.getPno()));
                    // 진행률이 100%인 경우만 처리
                    if (dto.getProgress() == 100.0 && !dto.getStatus().equals(ProjectStatus.COMPLETE)) {
                        dto.setStatus(ProjectStatus.COMPLETE);
                        updateProject(dto);
                        projectRepository.save(project);  // 변경된 프로젝트만 저장
                        System.out.println("Project marked as COMPLETE and updated: " + dto.getPno());
                    }

                    Long newIssueCount = projectAlarmService.projectAlarmCount(dto.getPno());
                    dto.setNewIssueCount(newIssueCount);
                    return dto;
                }
        ).toList();

        int totalCount = (int) result.getTotalElements();

        // 리스트 리턴!
        return PageResponseDTO.<ProjectDTO>withAll().dtoList(dtoList)
                .pageRequestDTO(pageRequestDTO)
                .totalCount(totalCount)
                .build();
    }


    // 버전 올려주는 메서드
    public String incrementVersion(String version) {
        String[] versionParts = version.split("\\.");
        int major = Integer.parseInt(versionParts[0]);
        int minor = Integer.parseInt(versionParts[1]);
        int patch = Integer.parseInt(versionParts[2]);

        if (patch < 9) {
            patch++;
        } else {
            patch = 0;
            minor++;
        }
        version = major + "." + minor + "." + patch;
        return version;
    }

    // 진행률 계산하는 메서드
    public Double progressRate(ProjectDTO projectDTO) {
        long totalDays = ChronoUnit.DAYS.between(projectDTO.getStartDate(), projectDTO.getDueDate());
        long dueDays = ChronoUnit.DAYS.between(LocalDate.now(), projectDTO.getDueDate());
        // 시작일이 오늘 이전이라면 진행률 0%
        if (projectDTO.getStartDate().isAfter(LocalDate.now())) {
            return 0.0;
        }

        // 마감일이 지났으면 진행률 100%
        if (dueDays < 0) {
            return 100.0;
        }

        double progressRate = (double) (totalDays - dueDays) / totalDays * 100; // 퍼센트로 계산
        progressRate = Math.round(progressRate * 100.0) / 100.0;
        log.info("진행율" + progressRate);
        return progressRate;
    }

    // Project와 관련된 issue 개수가 몇개인지 ?
    public int count(Long pno) {
        int count = projectIssueRepository.countByProjectPno(pno);
        log.info(count);
        return count;
    }

}
