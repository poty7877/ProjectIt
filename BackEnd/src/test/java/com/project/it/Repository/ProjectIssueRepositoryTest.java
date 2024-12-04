package com.project.it.Repository;

import com.project.it.domain.ProjectIssue;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Log4j2
class ProjectIssueRepositoryTest {

    @Autowired
    private ProjectIssueRepository repository;

    @Test
    @Transactional
    public void getList() {
        Page<ProjectIssue> result = repository.findByProjectPnoAndProjectMemberIsNull(869L, PageRequest.of(1,10));
        result.forEach(System.out::println);

    }

    @Test
    @Transactional
    public void get() {
        ProjectIssue projectIssue = repository.findByIdWithReply(131L);
        System.out.println(projectIssue);
        projectIssue.getReplies().forEach(reply -> System.out.println("Reply: " + reply));
    }

    @Test
    @Transactional
    public void get2() {
        Optional<ProjectIssue> result = repository.findById(132L);
        result.ifPresent(System.out::println);
    }

}