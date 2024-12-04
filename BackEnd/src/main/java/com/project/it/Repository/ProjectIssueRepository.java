package com.project.it.Repository;

import com.project.it.domain.ProjectIssue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectIssueRepository extends JpaRepository<ProjectIssue, Long> {

    // 조회 메서드는 불러온다음 프론트에서 ino 받아온다음 진행

    // 리스트가 두개가 필요함.
    // 첫번째는 pno와 관련된 리스트가 필요하고
    // 두번째는 mno, 내앞으로 요청이 온 이슈를 모아서 조회할수있어야 빠른처리가 가능함.
    // 페이징 처리 할것.

    // pno와 연결된 이슈의 개수 구하기
    int countByProjectPno(Long pno);

    // pno와 견결되있는 이슈의 개수 구하기 (mno Is Null)
    @Query("select count(*) from ProjectIssue pi where pi.project.pno = :pno and pi.projectMember IS NULL ")
    int countByProjectPnoAndMnoIsNull(Long pno);

    // pno와 연결된 이슈 리스트 페이징 할때 담당자 이름 가져오기
    Page<ProjectIssue> findByProjectPno(Long pno, Pageable pageable);

    // mno와 연결된 이슈 리스트 페이징
    Page<ProjectIssue> findByProjectMemberMno(Long mno, Pageable pageable);

    // 해당프로젝트 pno와 연결이 되있고, mno가 null인 List
    Page<ProjectIssue> findByProjectPnoAndProjectMemberIsNull(Long pno, Pageable pageable);


    @Query("select pi from ProjectIssue pi left join fetch pi.replies where pi.ino = :ino")
    ProjectIssue findByIdWithReply(@Param("ino") Long ino);


}
