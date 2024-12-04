package com.project.it.Repository;

import com.project.it.domain.ProjectPartner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectPartnerRepository extends JpaRepository<ProjectPartner, Long> {

    // Pno 프로젝트 번호를 이용해 프로젝트와 연결된 고객사를 가져옴
    ProjectPartner findByProjectPno(Long pno);


}
