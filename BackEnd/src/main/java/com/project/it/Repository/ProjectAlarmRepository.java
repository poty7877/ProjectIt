package com.project.it.Repository;

import com.project.it.domain.ProjectAlarm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectAlarmRepository extends JpaRepository<ProjectAlarm, Long> {

    // pno를 이용해서 pno와 관련된 이슈가 몇개인지 ?
    Long countByPno(Long pno);

    // ino를 이용해서 지우는 메서드
    void deleteByIno(Long ino);

    // ino를 이용해서 가져오는 메서드
    boolean existsByIno(Long ino);

}
