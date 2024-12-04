package com.project.it.controller;

import com.project.it.dto.DocumentDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.handler.AlarmHandler;
import com.project.it.service.DocumentApproverAlarmService;
import com.project.it.service.DocumentService;
import com.project.it.service.DocumentWriterAlarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/document")
@RequiredArgsConstructor
@Log4j2
public class DocumentController {

    private final DocumentService documentService;
    private final AlarmHandler alarmHandler;

    private final DocumentApproverAlarmService documentApproverAlarmService;

    private final DocumentWriterAlarmService documentWriterAlarmService;

    @GetMapping("/requested") // 결재 요청중 리스트
    public PageResponseDTO<DocumentDTO> getRequestlist(PageRequestDTO pageRequestDTO) {
        return documentService.getRequestedList(pageRequestDTO);
    }

    @GetMapping("/approved") // 결재 완료 리스트
    public PageResponseDTO<DocumentDTO> getApprovedlist(PageRequestDTO pageRequestDTO) {
        return documentService.getApprovedList(pageRequestDTO);
    }

    @GetMapping("/rejected") // 결재 반려 리스트
    public PageResponseDTO<DocumentDTO> getRejectedlist(PageRequestDTO pageRequestDTO) {
        return documentService.getRejectedList(pageRequestDTO);
    }

    @GetMapping("/approver/{mno}")
    public PageResponseDTO<DocumentDTO> getApproverlist(@PathVariable("mno") Long mno, PageRequestDTO pageRequestDTO) {
        return documentService.getApproverList(mno, pageRequestDTO);
    }

    @GetMapping("/writer/{writer}")
    public PageResponseDTO<DocumentDTO> getWriterlist(@PathVariable("writer") String writer, PageRequestDTO pageRequestDTO) {
        return documentService.getWriterList(writer, pageRequestDTO);
    }

    @PostMapping("/")
    // DTO를 받아서 등록
    public ResponseEntity<String> register(@Valid @RequestBody DocumentDTO documentDTO) {
        System.out.println("dto확인" + documentDTO);
        documentService.register(documentDTO);
        Map<String, Long> alarmData = new HashMap<String, Long>();
        Long alarm = documentApproverAlarmService.documentApproverAlarmCount(documentDTO.getMno());
        alarmData.put("approverAlarm", alarm);
        alarmHandler.sendAlarmUpdate(alarmData);
        return ResponseEntity.ok("SUCCESS");
    }

    @GetMapping("/{dno}")
    // dno로 객체 조회
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable Long dno) {

        return ResponseEntity.ok(documentService.get(dno));
    }

    @PutMapping("/{dno}")
    // 주소만 dno를 사용, DTO를 받아서 업데이트 함 
    public ResponseEntity<String> updateDocument(@PathVariable Long dno, @RequestBody DocumentDTO documentDTO) {
        log.info("@@@@@@@@@" + documentDTO);
        documentService.update(documentDTO);

        Map<String, Long> alarmData = new HashMap<String, Long>();
        Long alarm = documentWriterAlarmService.documentWriterAlarmCount(documentDTO.getWriter());
        alarmData.put("writerAlarm", alarm);
        alarmHandler.sendAlarmUpdate(alarmData);
        return ResponseEntity.ok("SUCCESS");
    }

    @DeleteMapping("/{dno}")
    // dno를 받아서 삭제 하는 메서드
    public ResponseEntity<String> deleteDocument(@PathVariable Long dno) {
        documentService.delete(dno);
        return ResponseEntity.ok("SUCCESS");
    }

}
