package com.project.it.service;

import com.project.it.Repository.MemberAlarmRepository;
import com.project.it.domain.MemberAlarm;
import com.project.it.dto.MemberAlarmDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class MemberAlarmServiceImpl implements MemberAlarmService {
    private final MemberAlarmRepository memberAlarmRepository;

    @Override
    // 알림 등록
    public void register(MemberAlarmDTO memberAlarmDTO) {
        MemberAlarm memberAlarm = dtoToEntity(memberAlarmDTO);
        memberAlarmRepository.save(memberAlarm);
        log.info("멤버 알람 등록 : " + memberAlarm);
    }

    @Override
    // mno이용해 개수 파악
    public Long memberAlarmCount(Long mno) {
        return memberAlarmRepository.countByMno(mno);
    }

    @Override
    // 전체 개수파악
    public Long allCount() {
        return memberAlarmRepository.count();
    }

    @Override
    // 알람 삭제
    public void delete(Long ino) {
        boolean exist = memberAlarmRepository.existsByIno(ino);
        if (exist) {
            memberAlarmRepository.deleteByIno(ino);
        }
    }

    @Override
    // 존재 여부 확인
    public boolean exists(Long ino) {
        return memberAlarmRepository.existsByIno(ino);
    }

    public MemberAlarm dtoToEntity(MemberAlarmDTO memberAlarmDTO) {
        return MemberAlarm.builder()
                .mano(memberAlarmDTO.getMano())
                .mno(memberAlarmDTO.getMno())
                .ino(memberAlarmDTO.getIno())
                .build();
    }

}
