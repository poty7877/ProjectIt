package com.project.it.service;

import com.project.it.domain.InfoPartners;
import com.project.it.dto.InfoPartnersDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface InfoPartnersService { //고객사 정보 관리 서비스
    //C: 고객사 등록
    Long register(InfoPartnersDTO infoPartnersDTO);
    //R_one: 고객사 정보 불러오기
    InfoPartnersDTO getOne(String comName, String phone); //회사명+phone검색
    //R_one2: 고객사 정보 불러오기
    InfoPartnersDTO getOneByCno(Long cno);
    //R_all : 고객사 리스트 불러오기
    PageResponseDTO<InfoPartnersDTO> getList(PageRequestDTO pageRequestDTO);
    //U : 고객사 정보 변경
    void update(InfoPartnersDTO infoPartnersDTO);
    //D : 고객사 삭제
    void remove(Long cno);
    //entityToDto
    InfoPartnersDTO entityToDto(InfoPartners infoPartners);
    //dtoToEntity
    InfoPartners dtoToEntity(InfoPartnersDTO infoPartnersDTO);
    // just List
    List<InfoPartnersDTO> getList();
}
