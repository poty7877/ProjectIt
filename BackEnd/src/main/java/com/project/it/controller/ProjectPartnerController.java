package com.project.it.controller;

import com.project.it.dto.ProjectPartnerDTO;
import com.project.it.service.ProjectPartnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projectpartner")
public class ProjectPartnerController {

    private final ProjectPartnerService projectPartnerService;

    @GetMapping("/{pno}")
    // pno 프로젝트 번호를 이용해 고객사 정보 가져옴
    public ProjectPartnerDTO get(@PathVariable("pno") Long pno) {
        try { // 프로젝트 생성중 다음으로 건너뛰었을경우를 대비
            ProjectPartnerDTO projectPartnerDTO = projectPartnerService.get(pno);
            return projectPartnerDTO;
        } catch (Exception e) {
            return null;
        }

    }

    @PostMapping("/")
    // 프로젝트 고객사 정보 등록
    public ResponseEntity<String> register(@Valid @RequestBody ProjectPartnerDTO projectPartnerDTO) {
        projectPartnerService.register(projectPartnerDTO);
        return ResponseEntity.ok("SUCCESS");
    }

    @PutMapping("/{ppno}")
    // 고객사 정보 수정
    public ResponseEntity<String> update(@PathVariable("ppno") Long ppno, @Valid @RequestBody ProjectPartnerDTO projectPartnerDTO) {
        projectPartnerDTO.setPpno(ppno);
        projectPartnerService.update(projectPartnerDTO);
        return ResponseEntity.ok("SUCCESS");
    }

}
