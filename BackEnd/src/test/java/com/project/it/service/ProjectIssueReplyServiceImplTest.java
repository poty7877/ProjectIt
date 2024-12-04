package com.project.it.service;

import com.project.it.domain.ProjectIssueReply;
import com.project.it.dto.ProjectIssueReplyDTO;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Log4j2
class ProjectIssueReplyServiceImplTest {

    @Autowired
    private ProjectIssueReplyService projectIssueReplyService;

    @Test
    public void insert () {
        ProjectIssueReplyDTO projectIssueReplyDTO = ProjectIssueReplyDTO.builder()
                .ino(131L)
                .writer("테스트")
                .content("테스트")
                .build();
        projectIssueReplyService.register(projectIssueReplyDTO);
    }

    @Test
    public void get() {
        Long rno = 3L;
        ProjectIssueReplyDTO projectIssueReplyDTO = projectIssueReplyService.get(rno);
        System.out.println(projectIssueReplyDTO);
    }

    @Test
    public void update() {
        ProjectIssueReplyDTO projectIssueReplyDTO = ProjectIssueReplyDTO.builder()
                .rno(3L)
                .ino(131L)
                .content("수정 테스트")
                .writer("테스트")
                .build();
        projectIssueReplyService.update(projectIssueReplyDTO);
        System.out.println(projectIssueReplyDTO);
    }

}