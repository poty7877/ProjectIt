package com.project.it.controller;

import com.project.it.service.MemberAlarmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member/alarm")
@Log4j2
@RequiredArgsConstructor
public class MemberAlarmController {

    private final MemberAlarmService memberAlarmService;
    // mno를이용해 이슈 등록시 알림등록
    @GetMapping("/count/{mno}")
    public Long getMemberAlarmCount(@PathVariable("mno") Long mno) {
        return memberAlarmService.memberAlarmCount(mno);
    }
    // ino 이슈 번호로 알림 삭제
    @DeleteMapping("/{ino}")
    public ResponseEntity<String> deleteMemberAlarm(@PathVariable("ino") Long ino) {
        memberAlarmService.delete(ino);
       return ResponseEntity.ok().body("SUCCESS");
    }
    // 전체 개수
    @GetMapping("/all")
    public Long allCount() {
        return memberAlarmService.allCount();
    }
}
