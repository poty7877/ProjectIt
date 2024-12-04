package com.project.it.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString
@Setter
public class ProjectEventDTO {

    private Long eno; // 이벤트 번호

    private Long pno; // 프로젝트 번호

    @NotBlank(message = "제목은 필수 입력사항 입니다.")
    @Size(min = 2, max = 50, message = "제목은 2~50자 사이여야 합니다.")
    private String title; // 이벤트 내용이자 제목

    @Builder.Default
    private Boolean isFirst = false; // 처음으로 만들어진 이벤트인가 ?

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "시작일을 선택하세요")
    private LocalDate start; // 이벤트 시작 날짜

    @JsonFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "종료일을 선택하세요")
    private LocalDate end; // 이벤트 종료 날짜

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate regDate; // 이벤트 작성 날짜

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate updateDate; // 이벤트 수정 날짜

    @AssertTrue(message = "종료일은 시작일 이후여야 합니다.")
    public boolean isEndDateAfterStartDate() {
        if (start == null || end == null) {
            return true; // 시작일과 마감일이 비어있는 경우, 다른 제약조건에서 처리됨
        }
        return !end.isBefore(start); // 마감일이 시작일 이전인지 확인
    }

}
