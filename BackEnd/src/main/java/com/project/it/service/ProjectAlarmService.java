package com.project.it.service;

import com.project.it.domain.ProjectAlarm;
import com.project.it.dto.ProjectAlarmDTO;

import java.util.List;

public interface ProjectAlarmService {

    // C
    void register(ProjectAlarmDTO projectAlarmDTO);
    
    // R 새이슈가 몇개인지 ? 
    Long projectAlarmCount(Long pno);

    // R 전체 이슈개수
    Long allProjectCount();

    // 수정은 필요없음.
    // D
    void delete(Long ino);

    // ino가 있는지 확인후 있으면 new표시
    boolean exists(Long ino);

}
