package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberAlarmDTO {

    // 알람 번호
    private Long mano;

    // 멤버 번호
    private Long mno;

    // 이슈 번호
    private Long ino;
}
