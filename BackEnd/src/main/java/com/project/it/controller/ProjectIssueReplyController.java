package com.project.it.controller;

import com.project.it.dto.ProjectIssueReplyDTO;
import com.project.it.service.ProjectIssueReplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reply")
@Log4j2
public class ProjectIssueReplyController {

    private final ProjectIssueReplyService projectIssueReplyService;

    @GetMapping("/{rno}")
    public ProjectIssueReplyDTO read(@PathVariable Long rno) {
        return projectIssueReplyService.get(rno);
    }

    @PostMapping("/")
    public ResponseEntity<String> register(@Valid @RequestBody ProjectIssueReplyDTO projectIssueReplyDTO) {
        projectIssueReplyService.register(projectIssueReplyDTO);
        return ResponseEntity.ok("SUCCESS");
    }

    @PutMapping("/{rno}")
    public ResponseEntity<String> update(@RequestBody ProjectIssueReplyDTO projectIssueReplyDTO) {
        projectIssueReplyService.update(projectIssueReplyDTO);
        return ResponseEntity.ok("SUCCESS");
    }
}
