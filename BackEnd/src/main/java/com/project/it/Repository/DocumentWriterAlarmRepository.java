package com.project.it.Repository;

import com.project.it.domain.DocumentWriterAlarm;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentWriterAlarmRepository extends JpaRepository<DocumentWriterAlarm, Long> {

    // writer와 관련된 이슈가 몇개인지 ?
    Long countByWriter(String writer);

    // dno를 이용해 삭제
    void deleteByDno(Long dno);

    // dno를 이용해 존재하는지 확인
    boolean existsByDno(Long dno);
}
