package com.project.it.controller;

import com.project.it.dto.ProjectEventDTO;
import com.project.it.service.ProjectEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Transactional
@RestController
@RequestMapping("/api/pevent")
@Log4j2
@RequiredArgsConstructor
public class ProjectEventController {

    private final ProjectEventService projectEventService;

    @PostMapping("/")
    public ResponseEntity<String> register(@Valid @RequestBody ProjectEventDTO projectEventDTO) {
        // DTO를 받아서 등록함.
        log.info(projectEventDTO.getPno());
        log.info(projectEventDTO);
        projectEventService.register(projectEventDTO);
        return ResponseEntity.ok("SUCCESS");
    }

    @GetMapping("/{eno}")
    public ResponseEntity<ProjectEventDTO> getEvent(@PathVariable("eno") Long eno) {
        // eno, 이벤트 번호를 이용해 해당 객체만 불러옴
        ProjectEventDTO projectEventDTO = projectEventService.get(eno);
        return ResponseEntity.ok(projectEventDTO);
    }

    @GetMapping("/list/{pno}")
    public ResponseEntity<List<ProjectEventDTO>> getEvents(@PathVariable("pno") Long pno) {
        // pno, 프로젝트 번호를 이용해 모든이벤트리스트를 불러옴
        log.info("pno값: " + pno);
        List<ProjectEventDTO> projectEventDTOs = projectEventService.getAll(pno);
        log.info("배열값" + projectEventDTOs);
        return ResponseEntity.ok(projectEventDTOs);
    }

    @PutMapping("/{eno}")
    public ResponseEntity<String> update(@Valid @RequestBody ProjectEventDTO projectEventDTO){
        // 한개의 이벤트를 수정
        projectEventService.update(projectEventDTO);
        return ResponseEntity.ok("SUCCESS");
    }

    @DeleteMapping("/{eno}")
    public ResponseEntity<String> delete(@PathVariable("eno") Long eno) {
        // 한개의 이벤트를 삭제함.
        projectEventService.delete(eno);
        return ResponseEntity.ok("SUCCESS");
    }

    @GetMapping("/mylist/{mno}")
    // mno를 이용해 내 event만 가져옴(프로젝트일정의 대표만 가져옴)
    public List<ProjectEventDTO> getMyList(@PathVariable("mno") Long mno) {
        return projectEventService.getMyList(mno);
    }



}
