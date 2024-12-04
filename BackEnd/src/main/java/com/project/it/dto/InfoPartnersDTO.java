package com.project.it.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InfoPartnersDTO { //고객사 정보 관리용DTO
    private Long cno; // 번호 id

    @Size(min = 2, max = 50, message = "회사명은 2~50자 사이여야 합니다.")
    private String comName; // 회사 이름
    @Pattern(regexp = "\\d{3}-\\d{2}-\\d{5}", message = "사업자 번호는 000-00-00000 형식이어야 합니다.")
    private String coNum; // 사업자 번호
    private String phone; // 전화번호
    private String site; // 홈페이지 주소
    @Size(min = 5, message = "주소는 최소 5자 이상이어야 합니다.")
    private String address; // 회사 주소
    @Size(min = 2, max = 30, message = "업태(종목)는 2~30자 사이여야 합니다.")
    private String bizType; // 어떤 업장인지 ?
    @Pattern(regexp = "^[가-힣a-zA-Z]+$", message = "대표 이름은 한글 또는 영문만 가능합니다.")
    private String ceoName; // 대표 이름
}
