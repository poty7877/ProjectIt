package com.project.it.controller;

import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.dto.ProjectIssueDTO;
import com.project.it.dto.ProjectMemberDTO;
import com.project.it.service.ProjectIssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pissue")
@Transactional
@Log4j2
@RequiredArgsConstructor
public class ProjectIssueController {

    private final ProjectIssueService projectIssueService;

    @PostMapping("/")
    // JSON 타입으로 DTO 받은후 등록.
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody ProjectIssueDTO projectIssueDTO) {
        log.info("이슈DTO확인 : " + projectIssueDTO);


        // projectMember가 null이면 기본값을 설정
        if (projectIssueDTO.getProjectMember() == null) {
            projectIssueDTO.setProjectMember(
                    ProjectMemberDTO.builder()
                            .pno(projectIssueDTO.getPno()) // 프로젝트 번호 설정
                            .mno(0L) // 기본 멤버 번호 설정
                            .name("공통사항") // 기본 이름 설정
                            .team("") // 기본 팀 설정
                            .memberRole("") // 기본 직책 설정
                            .build()
            );
        }


        Long ino = projectIssueService.register(projectIssueDTO);
       
        Map<String,Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("ino", ino);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/{ino}")
    // ino를 이용해서 한개의 이슈를 읽어옴.
    public ResponseEntity<ProjectIssueDTO> get(@PathVariable Long ino) {

        return ResponseEntity.ok().body(projectIssueService.get(ino));
    }

    @PutMapping("/{ino}")
    // DTO를 받아와 한개의 객체를 업데이트 함.
    public ResponseEntity<String> update(@PathVariable Long ino,@Valid @RequestBody ProjectIssueDTO projectIssueDTO) {

        projectIssueDTO.setIno(ino);
        projectIssueService.update(projectIssueDTO);
        return ResponseEntity.ok().body("MODIFY_SUCCESS");
    }

    @DeleteMapping("/{ino}")
    // ino를 이용해 한개의 이슈를 삭제함
    public ResponseEntity<String> delete(@PathVariable Long ino) {
        projectIssueService.delete(ino);
        return ResponseEntity.ok().body("DELETE_SUCCESS");
    }

    @GetMapping("/count/{pno}")
    // pno를 이용해서 issue 개수가 몇개인지 가져옴.
    public int count(@PathVariable Long pno) {
        return projectIssueService.count(pno);
    }

    @GetMapping("/list/{pno}")
    // pno를 이용해서 pno와 관련된 리스트를 불러옴
    public PageResponseDTO<ProjectIssueDTO> getList(@PathVariable Long pno, PageRequestDTO pageRequestDTO) {
        return projectIssueService.getList(pno, pageRequestDTO);
    }

    @GetMapping("/mylist/{mno}")
    // mno를 이용해서 내 앞으로 지정된 이슈 리스트를 불러옴.
    public PageResponseDTO<ProjectIssueDTO> getMyList(@PathVariable Long mno, PageRequestDTO pageRequestDTO) {
        return projectIssueService.getMyList(mno, pageRequestDTO);
    }

    @GetMapping("/all/{pno}")
    // pno와 가 일치하고 mno가 null인 이슈의 개수를 가져옴(공통사항 이슈 개수 파악)
    public int getCount (@PathVariable Long pno) {
        return projectIssueService.mcount(pno);
    }

    @GetMapping("/nulllist/{pno}")
    public PageResponseDTO<ProjectIssueDTO> getNullList(@PathVariable Long pno, PageRequestDTO pageRequestDTO) {
        return projectIssueService.getNullList(pno, pageRequestDTO);
    }
}
