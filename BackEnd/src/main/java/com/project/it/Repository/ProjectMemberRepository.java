package com.project.it.Repository;

import com.project.it.domain.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    // 프로젝트 번호로 찾아와야함
    // pno가 일치하는 멤버만 찾아옴.
    @Query("select pm from ProjectMember pm where pm.project.pno = :pno ")
    List<ProjectMember> findByProjectId(Long pno);

    // pno와 mno가 일치하는 멤버
    ProjectMember findByMnoAndProject_Pno(Long mno, @Param("pno") Long pno);

    // 프로젝트 번호, 멤버 번호를 이용해 객체를 찾아 삭제.
    // 추후에 pmno, 즉 ProjectMember의 pk로 변경할예정.
    @Modifying
    @Query("delete from ProjectMember pm where pm.project.pno = :pno and pm.mno = :mno")
    void deleteByPnoWithMno(Long pno, Long mno);

}
