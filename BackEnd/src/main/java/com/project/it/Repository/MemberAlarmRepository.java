package com.project.it.Repository;

import com.project.it.domain.MemberAlarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberAlarmRepository extends JpaRepository<MemberAlarm, Long> {

    // mno를 이용해서 mno와 관련된 이슈가 몇개인지 ?
    Long countByMno(Long mno);

    // ino를 이용해서 지우는 메서드
    void deleteByIno(Long ino);

    // ino를 이용해 존재하는지 확인
    boolean existsByIno(Long ino);


}
