package com.project.it.dto;

import com.project.it.constant.ProjectIssueStatus;
import com.project.it.constant.ProjectPriority;
import com.project.it.constant.ProjectStatus;
import com.project.it.domain.ProjectIssue;
import com.project.it.domain.ProjectIssueReply;
import com.project.it.domain.ProjectMember;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Member;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectIssueDTO {

    // 이슈 번호
    private Long ino;

    // 프로젝트 번호
    private Long pno;

    // 멤버
    private ProjectMemberDTO projectMember;

    // 제목
    @NotBlank(message = "제목은 필수 입력사항 입니다.")
    @Size(min = 2, max = 50, message = "제목은 2~50자 사이여야합니다.")
    private String title;

    // 내용
    @NotBlank(message = "내용은 필수 입력사항 입니다.")
    @Size(min = 2, max = 500, message = "내용은 2~500자 사이여야 합니다.")
    private String content;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    // 상태
    private ProjectIssueStatus status = ProjectIssueStatus.REGISTERED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    // 우선순위
    private ProjectPriority priority = ProjectPriority.LOW;

    // 첨부파일 여부
    @Builder.Default
    private boolean isFiles = false;

    // 새로운 이슈인가 ?
    private boolean newIssue;

    private List<ProjectIssueReplyDTO> replies;

}
