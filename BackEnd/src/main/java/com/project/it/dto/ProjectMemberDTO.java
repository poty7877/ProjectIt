package com.project.it.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectMemberDTO {
    // 기존 멤버같은경우, 멤버와, 멤버상태등 굉장히 많은 정보가있지만,
    // 프로젝트에 참여중인 멤버 정보의 경우 그렇게 많은 정보가 모두 필요하지 않음.
    // 따라서, 정말 필요한 정보만 저장할수있도록, DTO와 엔티티를 별도로 만들어서 저장할 예정

    // 프로젝트 번호
    private Long pno;
    // 사원번호
    private Long mno;
    // 이름
    private String name;
    // 소속
    private String team;
    // 직책
    private String memberRole;

}
