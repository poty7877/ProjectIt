package com.project.it.Repository;

import com.project.it.domain.InfoPartnersFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InfoPartnersFileRepository extends JpaRepository<InfoPartnersFile, Long> {

    // cno 고객사 번호로 파일을 가져옴
    List<InfoPartnersFile> findAllByInfoPartnersCno(Long cno);
}
