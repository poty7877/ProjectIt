package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectAlarmDTO {

    // 알람 번호
    private Long pano;

    // 프로젝트 번호
    private Long pno;

    // 이슈 번호
    private Long ino;
}
