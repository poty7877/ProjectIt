package com.project.it.Repository;

import com.project.it.domain.ProjectIssue;
import com.project.it.domain.ProjectIssueReply;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Log4j2
class ProjectIssueReplyRepositoryTest {

    @Autowired
    private ProjectIssueReplyRepository projectIssueReplyRepository;

    @Autowired
    private ProjectIssueRepository projectIssueRepository;

    @Test
    @Transactional
    public void insert() {
        ProjectIssue projectIssue = projectIssueRepository.findById(131L).orElseThrow();

        ProjectIssueReply projectIssueReply = ProjectIssueReply.builder()
                .projectIssue(projectIssue)
                .content("테스트 댓글")
                .writer("나요")
                .build();
        projectIssueReplyRepository.save(projectIssueReply);
        System.out.println(projectIssueReply);
    }
}