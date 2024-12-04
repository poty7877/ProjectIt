package com.project.it.service;

import com.project.it.Repository.ProjectAlarmRepository;
import com.project.it.domain.ProjectAlarm;
import com.project.it.dto.ProjectAlarmDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ProjectAlarmServiceImpl implements ProjectAlarmService {

    private final ProjectAlarmRepository projectAlarmRepository;

    @Override
    // 알람 등록
    public void register(ProjectAlarmDTO projectAlarmDTO) {
        // pno와 ino만 입력해서 넘겨주면 됨.
        // DTO에는 두가지 정보밖에 없음
        ProjectAlarm projectAlarm = dtoToEntity(projectAlarmDTO);
        projectAlarmRepository.save(projectAlarm);
        log.info("알람 등록 : " + projectAlarm);
    }

    @Override
    public Long projectAlarmCount(Long pno) {
    // 알람 몇개인지 가져옴
        return projectAlarmRepository.countByPno(pno);
    }

    @Override
    // 전체개수
    public Long allProjectCount() {
        return projectAlarmRepository.count();
    }

    @Override
    public void delete(Long ino) {
        // ino가 존재하는지 확인후 있으면 삭제.
        boolean exist = projectAlarmRepository.existsByIno(ino);
        if(exist) {
            projectAlarmRepository.deleteByIno(ino);
        }
    }

    @Override
    public boolean exists(Long ino) {
        // ino가 존재하는지 확인.
        return projectAlarmRepository.existsByIno(ino);
    }


    // dto를 엔티티로 변경
    public ProjectAlarm dtoToEntity(ProjectAlarmDTO projectAlarmDTO) {
        return ProjectAlarm.builder()
                .pano(projectAlarmDTO.getPano())
                .ino(projectAlarmDTO.getIno())
                .pno(projectAlarmDTO.getPno())
                .build();
    }


}
