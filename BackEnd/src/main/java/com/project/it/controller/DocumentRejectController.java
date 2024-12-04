package com.project.it.controller;

import com.project.it.dto.DocumentRejectDTO;
import com.project.it.service.DocumentRejectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document/reject")
@RequiredArgsConstructor
@Log4j2
public class DocumentRejectController {

    private final DocumentRejectService documentRejectService;
    // 반려 사유 가져오기
    @GetMapping("/{drno}")
    public ResponseEntity<DocumentRejectDTO> getDocumentReject(@PathVariable("drno") Long drno) {
        DocumentRejectDTO documentRejectDTO = documentRejectService.get(drno);
        return ResponseEntity.ok(documentRejectDTO);
    }
    // 반려 사유 등록
    @PostMapping("/")
    public ResponseEntity<String> registerDocumentReject(@RequestBody DocumentRejectDTO documentRejectDTO) {
        documentRejectService.register(documentRejectDTO);
        return ResponseEntity.ok("SUCCESS");
    }
    // 반려 사유 수정
    @PutMapping("/{drno}")
    public ResponseEntity<String> updateDocumentReject(@RequestBody DocumentRejectDTO documentRejectDTO) {
        documentRejectService.update(documentRejectDTO);
        return ResponseEntity.ok("SUCCESS");
    }

}
