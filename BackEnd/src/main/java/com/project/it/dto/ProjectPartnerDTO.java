package com.project.it.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProjectPartnerDTO {

    private Long ppno; // 번호

    private ProjectDTO projectDTO; // 프로젝트 정보

    private InfoPartnersDTO infoPartnersDTO; // 고객사 기본 정보

    @NotBlank(message = "담당자 이름은 필수입니다.")
    @Size(min = 2, max = 10, message = "담당지 이름은 2~10자 사이여야 합니다.")
    private String name; // 고객사 담당자

    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email; // 담당자 이메일

    @Pattern(regexp = "^\\d{3}-\\d{3,4}-\\d{4}$", message = "유효한 전화번호를 입력해주세요. 예: 010-1111-2222")
    private String phone; // 담당자 연락처

    @Size(max = 500, message = "요청사항은 500자 이하로 입력해주세요.")
    private String request; // 고객사 요청사항

}
