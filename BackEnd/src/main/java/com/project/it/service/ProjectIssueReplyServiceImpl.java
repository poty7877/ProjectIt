package com.project.it.service;

import com.project.it.Repository.ProjectIssueReplyRepository;
import com.project.it.Repository.ProjectIssueRepository;
import com.project.it.domain.ProjectIssue;
import com.project.it.domain.ProjectIssueReply;
import com.project.it.dto.ProjectIssueReplyDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ProjectIssueReplyServiceImpl implements ProjectIssueReplyService {

    private final ProjectIssueReplyRepository projectIssueReplyRepository;

    private final ProjectIssueRepository projectIssueRepository;

    @Override
    public Long register(ProjectIssueReplyDTO projectIssueReplyDTO) {
        ProjectIssueReply projectIssueReply = dtoToEntity(projectIssueReplyDTO);
        projectIssueReplyRepository.save(projectIssueReply);
        return projectIssueReplyDTO.getRno();
    }

    @Override
    public ProjectIssueReplyDTO get(Long rno) {
        ProjectIssueReply projectIssueReply = projectIssueReplyRepository.findById(rno).orElseThrow();
        ProjectIssueReplyDTO projectIssueReplyDTO = entityToDto(projectIssueReply);
        log.info(projectIssueReplyDTO);
        return projectIssueReplyDTO;
    }

    @Override
    public void update(ProjectIssueReplyDTO projectIssueReplyDTO) {
        ProjectIssueReply projectIssueReply = dtoToEntity(projectIssueReplyDTO);
        projectIssueReplyRepository.save(projectIssueReply);
    }


    public ProjectIssueReply dtoToEntity(ProjectIssueReplyDTO projectIssueReplyDTO) {

        Long ino = projectIssueReplyDTO.getIno();
        ProjectIssue projectIssue = projectIssueRepository.findById(ino).orElseThrow();

        ProjectIssueReply projectIssueReply = ProjectIssueReply.builder()
                .rno(projectIssueReplyDTO.getRno())
                .projectIssue(projectIssue)
                .regDate(projectIssueReplyDTO.getRegDate())
                .writer(projectIssueReplyDTO.getWriter())
                .content(projectIssueReplyDTO.getContent())
                .build();

        log.info(projectIssueReply);

        return projectIssueReply;

    }

    public ProjectIssueReplyDTO entityToDto(ProjectIssueReply projectIssueReply) {
        ProjectIssueReplyDTO projectIssueReplyDTO = ProjectIssueReplyDTO.builder()
                .rno(projectIssueReply.getRno())
                .content(projectIssueReply.getContent())
                .ino(projectIssueReply.getProjectIssue().getIno())
                .regDate(projectIssueReply.getRegDate())
                .writer(projectIssueReply.getWriter())
                .build();
        log.info(projectIssueReplyDTO);
        return projectIssueReplyDTO;
    }
}
