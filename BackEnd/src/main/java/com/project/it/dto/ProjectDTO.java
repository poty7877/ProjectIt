package com.project.it.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.project.it.constant.ProjectStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectDTO {
    private Long pno; // 아이디

    @NotBlank(message = "제목은 필수 입니다.")
    @Size(min = 2, max = 100, message = "제목은 2~100자 사이여야 합니다.")
    private String title; // 제목

    @JsonFormat(pattern = "yyyy-MM-dd")  // 날짜 포맷 지정
    private LocalDate regDate; // 생성일

    @JsonFormat(pattern = "yyyy-MM-dd")  // 날짜 포맷 지정
    private LocalDate updateDate; // 수정일

    @JsonFormat(pattern = "yyyy-MM-dd")  // 날짜 포맷 지정
    @NotNull(message = "프로젝트 시작일을 선택하세요")
    private LocalDate startDate; // 프로젝트 시작일

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "프로젝트 마감일을 선택하세요")
    private LocalDate dueDate; // 마감일

    @NotBlank(message = "내용은 필수 입니다.")
    private String content; // 내용

    @Builder.Default
    private Boolean isDeleted = false; // 삭제여부 ?

    @Builder.Default
    private String version = "1.0.0"; // 버전

    @Builder.Default
    private ProjectStatus status = ProjectStatus.PROGRESS; // 상품상태

    private Double progress; // 진행률

    @NotNull(message = "프로젝트 타입 선택은 필수입니다.")
    private Boolean projectType; // 외부프로젝트인지 내부 프로젝트인지

    private int issueCount; // 이슈카운트
    
    private Long newIssueCount; // 새로운 이슈

    private Long mno; // 담당자 번호
    
    private String name; // 담당자 이름

    @AssertTrue(message = "마감일은 시작일 이후여야 합니다.")
    public boolean isEndDateAfterStartDate() {
        if (startDate == null || dueDate == null) {
            return true; // 시작일과 마감일이 비어있는 경우, 다른 제약조건에서 처리됨
        }
        return !dueDate.isBefore(startDate); // 마감일이 시작일 이전인지 확인
    }


}
