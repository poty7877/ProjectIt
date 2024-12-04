package com.project.it.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectIssueReplyDTO {

    private Long rno;

    private Long ino;

    @NotBlank(message = "내용은 필수 입력 사항입니다.")
    private String content;

    private String writer;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @Builder.Default
    private LocalDateTime regDate = LocalDateTime.now();

}
