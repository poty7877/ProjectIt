package com.project.it.Repository;

import com.project.it.domain.Project;
import com.project.it.domain.ProjectEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectEventRepository extends JpaRepository<ProjectEvent, Long> {

    // pno, 프로젝트 번호를 이용해서 event(일정) 을 모두 불러옴.
    @Query("select pe from ProjectEvent pe where pe.project.pno = :pno ")
    List<ProjectEvent> findByProjectPno(@Param("pno") Long pno);

    // mno를 이용해 Project를 가져옴. Project와 ProjectEvent의 Project가 같은 ProjectEvent를 가져옴
    @Query("select pe from ProjectEvent pe " +
            "left join Project p " +
            "on pe.project.pno = p.pno " +
            "where p.mno = :mno " +
            "and pe.isFisrt = true")
    List<ProjectEvent> findAllByMno( @Param("mno") Long mno);

}
