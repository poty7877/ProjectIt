package com.project.it.controller;

import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.dto.ProjectDTO;
import com.project.it.dto.ProjectEventDTO;
import com.project.it.service.ProjectEventService;
import com.project.it.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
@Log4j2
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    private final ProjectEventService projectEventService;

    @PostMapping("/")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody ProjectDTO projectDTO) {
        log.info("프로젝트 컨트롤러 등록 메서드 실행중");
        log.info(projectDTO);
        Long pno = projectService.registerProject(projectDTO);
        log.info(projectDTO);
        if (pno == null || pno == 0) {
            // 실패시
            return new ResponseEntity<>(Map.of("status","FAIL"), HttpStatus.BAD_REQUEST);
        } else { // 성공시 success메시지와 함께 200코드 리턴
            Map<String, Object> response = new HashMap<>();

            // 프로젝트 생성시, 기본 프로젝트 이벤트(일정) 자동 생성.!
            ProjectEventDTO projectEventDTO = ProjectEventDTO.builder()
                    .title(projectDTO.getTitle() + "(메인 프로젝트 기간)")
                    .pno(pno)
                    .start(projectDTO.getStartDate())
                    .end(projectDTO.getDueDate())
                    .isFirst(true)
                    .build();
            projectEventService.register(projectEventDTO);

            response.put("status","SUCCESS");
            response.put("pno",pno);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/list")
    // 리스트 불러오기
    public PageResponseDTO<ProjectDTO> list(PageRequestDTO pageRequestDTO) {
        System.out.println("====================================================================");
        System.out.println(pageRequestDTO.getSort());
        System.out.println(pageRequestDTO.getOrder());
        log.info("list....." + pageRequestDTO);

        return projectService.searchProjects(pageRequestDTO);

    }

    @GetMapping("/deletedList")
    // 삭제된 리스트 불러오기
    public PageResponseDTO<ProjectDTO> deletedList(PageRequestDTO pageRequestDTO) {
        log.info("list....." + pageRequestDTO);
        return projectService.getDeletedList(pageRequestDTO);
    }

    @GetMapping("/{pno}")
    // pno를 이용해서 프로젝트 조회하기
    public ResponseEntity<ProjectDTO> read(@PathVariable("pno") Long pno) {
        log.info("read....." + pno);
        ProjectDTO projectDTO = projectService.getProject(pno);
        return new ResponseEntity<>(projectDTO, HttpStatus.OK);
    }

    @PutMapping("/{pno}")
    // 프로젝트 수정
    public ResponseEntity<String> update(@RequestBody ProjectDTO projectDTO) {
        log.info("update....." + projectDTO);
        projectService.updateProject(projectDTO);
        return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
    }

    @PutMapping("/delete/{pno}")
    // 프로젝트 삭제 상태 true로 변경
    public ResponseEntity<String> delete(@PathVariable("pno") Long pno) {
        log.info("delete......" + pno);
        projectService.deleteProject(pno);
        return new ResponseEntity<>("DELETE", HttpStatus.OK);
    }

    @PutMapping("/deleteCancel/{pno}")
    // 프로젝트 삭제 상태 false로 변경
    public ResponseEntity<String> deleteCancel(@PathVariable("pno") Long pno) {
        log.info("delete......" + pno);
        projectService.deleteCancelProject(pno);
        return new ResponseEntity<>("DELETE CANCEL", HttpStatus.OK);
    }

    @DeleteMapping("/{pno}")
    // 프로젝트 영구 삭제
    public ResponseEntity<String> deleteForever(@PathVariable("pno") Long pno) {
        log.info("delete......" + pno);
        projectService.foreverDeleteProject(pno);
        return new ResponseEntity<>("DELETE FOREVER", HttpStatus.OK);
    }

    @GetMapping("/list/{mno}")
    // 로그인 한 객체의 리스트만 표시
    public PageResponseDTO<ProjectDTO> myList(@PathVariable Long mno, PageRequestDTO pageRequestDTO) {
        log.info("list....." + mno);
        return projectService.searchMyProjects(mno, pageRequestDTO);
    }

}
