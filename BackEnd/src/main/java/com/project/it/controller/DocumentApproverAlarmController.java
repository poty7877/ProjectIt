package com.project.it.controller;

import com.project.it.service.DocumentApproverAlarmService;
import com.project.it.service.DocumentWriterAlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document/alarm")
@RequiredArgsConstructor
@Log4j2
public class DocumentApproverAlarmController {

    private final DocumentApproverAlarmService documentApproverAlarmService;

    private final DocumentWriterAlarmService documentWriterAlarmService;

    // mno 멤버 번호로 알람 개수 가져옴
    @GetMapping("/count/{mno}")
    public Long getDocumentApproverAlarmCount(@PathVariable Long mno) {
        return documentApproverAlarmService.documentApproverAlarmCount(mno);
    }

    // dno 문서번호를 이용해 알람 제거
    @DeleteMapping("/{dno}")
    public ResponseEntity<String> deleteDocumentApproverAlarm(@PathVariable Long dno) {
        documentApproverAlarmService.delete(dno);
        return ResponseEntity.ok("SUCCESS");
    }

    // 작성자를 이용해 알람 개수 가져옴
    @GetMapping("/wcount/{writer}")
    public Long getDocumentWriterAlarmCount(@PathVariable String writer) {
        return documentWriterAlarmService.documentWriterAlarmCount(writer);
    }

    // dno 문서 번호를 이용해 알림 제거
    @DeleteMapping("/w/{dno}")
    public ResponseEntity<String> deleteDocumentWriterAlarm(@PathVariable Long dno) {
        documentWriterAlarmService.delete(dno);
        return ResponseEntity.ok("SUCCESS");
    }
}
