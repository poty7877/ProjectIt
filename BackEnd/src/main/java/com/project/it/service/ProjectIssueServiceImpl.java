package com.project.it.service;

import com.project.it.Repository.ProjectIssueRepository;
import com.project.it.Repository.ProjectMemberRepository;
import com.project.it.Repository.ProjectRepository;
import com.project.it.domain.*;
import com.project.it.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class ProjectIssueServiceImpl implements ProjectIssueService {

    private final ProjectIssueRepository projectIssueRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final ProjectRepository projectRepository;

    private final ProjectMemberService projectMemberService;

    private final ProjectAlarmService projectAlarmService;

    private final MemberAlarmService memberAlarmService;

    private final ProjectIssueReplyService projectIssueReplyService;

    @Override
    // ProjectIssueDTO 받아서 엔티티로 변경후 DB에 저장
    public Long register(ProjectIssueDTO projectIssueDTO) {
        ProjectIssue projectIssue = dtoToEntity(projectIssueDTO);
        log.info("Register project issue: " + projectIssue);
        projectIssueRepository.save(projectIssue);
        Long ino = projectIssue.getIno();
        Long pno = projectIssue.getProject().getPno();
        Long mno = 0L;

        // 프로젝트 이슈에 멤버선택안할시 (공통사항 으로 출력될 예정)
        if (projectIssue.getProjectMember() == null) {
            mno = 0L;
        } else {
            mno = projectIssue.getProjectMember().getMno();
        }
        // 이슈 등록되면 프로젝트와 해당 담당자에게 알림 등록 !
        ProjectAlarmDTO projectAlarmDTO = ProjectAlarmDTO.builder()
                .pno(pno)
                .ino(ino)
                .build();
        MemberAlarmDTO memberAlarmDTO = MemberAlarmDTO.builder()
                .mno(mno)
                .ino(ino)
                .build();
        projectAlarmService.register(projectAlarmDTO);
        memberAlarmService.register(memberAlarmDTO);
        return projectIssue.getIno();
    }

    @Override
    // ino를 이용해서 한개의 Issue를 가져온다음 DTO로 변경후 리턴
    public ProjectIssueDTO get(Long ino) {
        ProjectIssue projectIssue = projectIssueRepository.findById(ino).orElseThrow();

        List<ProjectIssueReply> replies = projectIssue.getReplies();
        List<ProjectIssueReplyDTO> repliesDTO = new ArrayList<>();

        replies.forEach(projectIssueReply -> {
            ProjectIssueReplyDTO replyDTO = projectIssueReplyService.entityToDto(projectIssueReply);
            repliesDTO.add(replyDTO);  // repliesDTO 리스트에 추가
        });

        ProjectIssueDTO projectIssueDTO = entityToDto(projectIssue);

        projectIssueDTO.setReplies(repliesDTO);

        log.info("Get project issue: " + projectIssue);
        return projectIssueDTO;
    }

    @Override
    // DTO를 받아서 엔티티로 변경후 정보 변경후 DB에 덮어씌움.
    public Long update(ProjectIssueDTO projectIssueDTO) {
        ProjectIssue projectIssue = dtoToEntity(projectIssueDTO);
        projectIssue.changeContent(projectIssueDTO.getContent());
        projectIssue.changeStatus(projectIssueDTO.getStatus());
        projectIssue.changePriority(projectIssueDTO.getPriority());
        projectIssueRepository.save(projectIssue);
        return projectIssue.getIno();
    }

    @Override
    public Long delete(Long ino) {
        // ino를 받아 삭제하는 메서드
        projectIssueRepository.deleteById(ino);
        return ino;
    }

    @Override
    // pno에 관련된 이슈가 몇개인지 알려주는 메서드
    public int count(Long pno) {
        int count = projectIssueRepository.countByProjectPno(pno);
        log.info(count);
        return count;
    }

    @Override
    public int mcount(Long pno) {
        return projectIssueRepository.countByProjectPnoAndMnoIsNull(pno);
    }

    @Override
    // pno를 이용해 pno와 관련된 모든 이슈를 페이징 처리후 리턴.
    public PageResponseDTO<ProjectIssueDTO> getList(Long pno, PageRequestDTO pageRequestDTO) {
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "ino";
        Pageable pageable = null;

        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        Page<ProjectIssue> result = projectIssueRepository.findByProjectPno(pno, pageable);

        List<ProjectIssueDTO> dtoList = result.stream().map(projectIssue -> {
                    ProjectIssueDTO projectIssueDTO = entityToDto(projectIssue);
                    boolean exist = projectAlarmService.exists(projectIssueDTO.getIno());
                    projectIssueDTO.setNewIssue(exist);
                    return projectIssueDTO;
                }
        ).toList();

        int totalCount = (int) result.getTotalElements();

        return PageResponseDTO.<ProjectIssueDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    @Override
    // mno를 이용해 mno와 관련된 모든 이슈를 페이징 처리후 리턴
    public PageResponseDTO<ProjectIssueDTO> getMyList(Long mno, PageRequestDTO pageRequestDTO) {
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "ino";
        Pageable pageable = null;

        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        Page<ProjectIssue> result = projectIssueRepository.findByProjectMemberMno(mno, pageable);
        List<ProjectIssueDTO> dtoList = result.stream().map(projectIssue -> {
            ProjectIssueDTO projectIssueDTO = entityToDto(projectIssue);
            boolean exist = memberAlarmService.exists(projectIssueDTO.getIno());
            System.out.println("과연" + exist);
            projectIssueDTO.setNewIssue(exist);
            return projectIssueDTO;
        }).toList();


        int totalCount = (int) result.getTotalElements();

        return PageResponseDTO.<ProjectIssueDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }

    @Override
    public PageResponseDTO<ProjectIssueDTO> getNullList(Long pno, PageRequestDTO pageRequestDTO) {
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "ino";
        Pageable pageable = null;

        if (!pageRequestDTO.getOrder()) {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).descending());
        } else {
            pageable = PageRequest.of(pageRequestDTO.getPage() - 1, pageRequestDTO.getSize(),
                    Sort.by(sortBy).ascending());
        }

        Page<ProjectIssue> result = projectIssueRepository.findByProjectPnoAndProjectMemberIsNull(pno, pageable);
        List<ProjectIssueDTO> dtoList = result.stream().map(projectIssue -> {
            ProjectIssueDTO projectIssueDTO = entityToDto(projectIssue);
            boolean exist = memberAlarmService.exists(projectIssueDTO.getIno());
            System.out.println("과연" + exist);
            projectIssueDTO.setNewIssue(exist);
            return projectIssueDTO;
        }).toList();


        int totalCount = (int) result.getTotalElements();

        return PageResponseDTO.<ProjectIssueDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }


    // DTO를 엔티티로 변경
    public ProjectIssue dtoToEntity(ProjectIssueDTO projectIssueDTO) {
        Project project = projectRepository.findById(projectIssueDTO.getPno()).orElseThrow();

        ProjectMember projectMember = projectMemberRepository.findByMnoAndProject_Pno(projectIssueDTO.getProjectMember().getMno(), projectIssueDTO.getPno());

        return ProjectIssue.builder()
                .ino(projectIssueDTO.getIno())
                .title(projectIssueDTO.getTitle())
                .content(projectIssueDTO.getContent())
                .project(project)
                .projectMember(projectMember)
                .priority(projectIssueDTO.getPriority())
                .isFiles(projectIssueDTO.isFiles())
                .status(projectIssueDTO.getStatus())
                .build();
    }

    // 엔티티를 DTO로 변경
    public ProjectIssueDTO entityToDto(ProjectIssue projectIssue) {

        ProjectMemberDTO projectMemberDTO = projectMemberService.entityToDTO(projectIssue.getProjectMember());
        return ProjectIssueDTO.builder()
                .ino(projectIssue.getIno())
                .title(projectIssue.getTitle())
                .content(projectIssue.getContent())
                .priority(projectIssue.getPriority())
                .status(projectIssue.getStatus())
                .projectMember(projectMemberDTO)
                .isFiles(projectIssue.isFiles())
                .pno(projectIssue.getProject().getPno())
                .build();
    }


}
