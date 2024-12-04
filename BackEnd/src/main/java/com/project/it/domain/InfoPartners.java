package com.project.it.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "partners_info", indexes = {@Index(name = "idx_company_name", columnList = "comName")})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class InfoPartners { //협력사 등 회사 정보 저장용
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno; // 번호
    
    private String comName; // 업장 이름
    private String coNum; // 사업자 번호
    private String phone; // 전화번호
    private String site; // 홈페이지 주소
    private String address; // 업장 주소
    private String bizType; // 어떤 업장인지 ?
    private String ceoName; // 대표자

    //변경용 method
    public void changeComName(String comName){
        this.comName = comName;
    }
    public void changeCoNum(String coNum){
        this.coNum = coNum;
    }
    public void changePhone(String phone){
        this.phone = phone;
    }
    public void changeSite(String site){
        this.site = site;
    }
    public void changeAddress(String address){
        this.address = address;
    }
    public void changeBizType(String bizType){
        this.bizType = bizType;
    }
}

//    cno bigint not null auto_increment,
//        address varchar(255),
//        biz_type varchar(255),
//        co_num varchar(255),
//        com_name varchar(255),
//        phone varchar(255),
//        site varchar(255),
//        primary key (cno)