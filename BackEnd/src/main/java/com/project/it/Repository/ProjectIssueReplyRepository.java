package com.project.it.Repository;

import com.project.it.domain.ProjectIssue;
import com.project.it.domain.ProjectIssueReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectIssueReplyRepository extends JpaRepository<ProjectIssueReply, Long> {



}
