package com.project.it.service;

import com.project.it.domain.ProjectIssueReply;
import com.project.it.dto.ProjectIssueReplyDTO;

import java.util.List;

public interface ProjectIssueReplyService {

    // C
    Long register(ProjectIssueReplyDTO projectIssueReplyDTO);

    // R
    ProjectIssueReplyDTO get(Long rno);

    // U
    void update(ProjectIssueReplyDTO projectIssueReplyDTO);

    // dtoToEntity
    ProjectIssueReply dtoToEntity(ProjectIssueReplyDTO projectIssueReplyDTO);

    // entityToDto
    ProjectIssueReplyDTO entityToDto(ProjectIssueReply projectIssueReply);
}
