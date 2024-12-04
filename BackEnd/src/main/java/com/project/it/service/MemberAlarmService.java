package com.project.it.service;

import com.project.it.dto.MemberAlarmDTO;

public interface MemberAlarmService {

    // C
    void register(MemberAlarmDTO memberAlarmDTO);

    // R
    Long memberAlarmCount(Long mno);

    // R
    Long allCount();

    // D
    void delete(Long ino);

    // ino 있는지 확인
    boolean exists(Long ino);
}
