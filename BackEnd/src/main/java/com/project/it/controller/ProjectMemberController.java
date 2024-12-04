package com.project.it.controller;

import com.project.it.domain.ProjectMember;
import com.project.it.dto.ProjectMemberDTO;
import com.project.it.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pmember")
@Log4j2
@RequiredArgsConstructor
public class ProjectMemberController {
    // ProjectMember같은경우는 id인 pmno를 사용하지않고, pno와 mno를 이용해서 객체를 찾음.

    private final ProjectMemberService projectMemberService;

    @GetMapping("/{pno}")
    public ResponseEntity<List<ProjectMemberDTO>> getList(@PathVariable("pno") Long pno) {
        // pno를 이용해서 참여중인 멤버 리스트를 불러옴
        log.info("ProjectMemberController.getList 메서드 실행");
        return ResponseEntity.ok(projectMemberService.getList(pno));
    }

    @PostMapping("/{pno}")
    public ResponseEntity<String> create(@RequestBody List<ProjectMemberDTO> projectMemberDTOs, @PathVariable Long pno) {
        // 프론트에서 선택한 여러명의 멤버들의 pno를 설정해주고 등록함.
        projectMemberDTOs.forEach(i -> {
            i.setPno(pno);
        });
        projectMemberService.register(projectMemberDTOs);
        return ResponseEntity.ok("SUCCESS");
    }

    @DeleteMapping("/{pno}/{mno}")
    // pno와 mno를 이용해서 프로젝트 참여중인 멤버 삭제
    public ResponseEntity<String> delete(@PathVariable("pno") Long pno, @PathVariable Long mno) {
        projectMemberService.delete(pno, mno);
        return ResponseEntity.ok("SUCCESS");
    }

    @GetMapping("/{pno}/{mno}")
    // pno와 mno를 이용해서 ProjectMemberDTO 객체를 찾아옴.
    public ProjectMemberDTO get(@PathVariable Long mno, @PathVariable("pno") Long pno) {
       return projectMemberService.getOne(mno, pno);
    }
}
