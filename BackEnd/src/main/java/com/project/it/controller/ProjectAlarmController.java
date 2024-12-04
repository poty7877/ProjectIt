package com.project.it.controller;

import com.project.it.service.ProjectAlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project/alarm")
@Log4j2
@RequiredArgsConstructor
public class ProjectAlarmController {

    private final ProjectAlarmService projectAlarmService;

    @GetMapping("/count/{pno}")
    // 파라미터로 pno를 받아서 새 이슈 개수 가져옴
    public Long getProjectAlarmCount(@PathVariable Long pno) {
        return projectAlarmService.projectAlarmCount(pno);
    }

    @DeleteMapping("/{ino}")
    // 파라미터로 ino 받아서 삭제 함.
    public ResponseEntity<String> deleteProjectAlarm(@PathVariable Long ino) {
        projectAlarmService.delete(ino);
        return ResponseEntity.ok().body("SUCCESS");
    }

    @GetMapping("/all")
    // 전체 개수
    public Long getAllCount() {
        return projectAlarmService.allProjectCount();
    }


}
