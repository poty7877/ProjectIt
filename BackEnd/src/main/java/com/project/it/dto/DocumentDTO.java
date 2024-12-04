package com.project.it.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.it.constant.DocumentStatus;
import com.project.it.constant.DocumentVisibility;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DocumentDTO {

    private Long dno; // 문서 번호

    @NotBlank(message = "문서 제목은 필수입니다.")
    @Size(min =2, max= 50, message = "문서 제목은 2~50자 사이여야 합니다.")
    private String title; // 문서 제목

    @NotBlank(message = "문서 내용은 필수입니다.")
    @Size(min =2, max= 800, message = "문서 내용은 2~800자 사이여야 합니다.")
    private String description; // 문서 내용

    private String writer; // 작성자 (loginMember)

    private List<String> sano; // SoftWare Asset Id (license_asset)

    private List<String> hano; // HardWare Asset Id

    private Long mno; // 결재자 (MemberList Mno)

    private String approver;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate approvalDate; // 결재 날짜

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate regDate; // 생성일

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate; // 수정일

    @Builder.Default
    private DocumentStatus approved = DocumentStatus.REQUESTED; // 결재 완료 여부

    private DocumentVisibility visibility; // 공개 여부

    private Boolean newIssue; // 새로운 문서(결재요청) 확인 ?
}
