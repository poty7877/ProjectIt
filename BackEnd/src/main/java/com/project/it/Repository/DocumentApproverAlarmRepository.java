package com.project.it.Repository;

import com.project.it.domain.DocumentApproverAlarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentApproverAlarmRepository extends JpaRepository<DocumentApproverAlarm, Long> {

    // mno를 이용해 mno와 관련된 이슈가 몇개인지 ?
    Long countByMno(Long mno);

    // dno를 이용해 삭제
    void deleteByDno(Long dno);

    // dno를 이용해 존재하는지 확인
    boolean existsByDno(Long dno);
}
