package com.project.it.Repository;

import com.project.it.domain.InfoPartners;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InfoPartnersRepository extends JpaRepository<InfoPartners, Long> {
    //고객사 검색(회사명+전화번호)
    @Query("select p from InfoPartners p where p.comName=:comName and p.phone=:phone")
    InfoPartners searchPartners(@Param("comName") String comName, @Param("phone") String phone);
}
