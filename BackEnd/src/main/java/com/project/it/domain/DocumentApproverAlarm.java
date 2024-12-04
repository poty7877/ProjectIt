package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Service;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
@Service
@Table(name = "tbl_document_alarm")
public class DocumentApproverAlarm {
    // 문서 등록시 승인하는사람에게 알림을 보냄

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long aano; // 번호

    private Long dno; // 어떤 문서 ?

    private Long mno; // 담당자


}
