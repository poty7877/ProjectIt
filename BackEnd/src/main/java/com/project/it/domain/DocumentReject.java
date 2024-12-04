package com.project.it.domain;

// 문서 반려시 반려 내용을 입력하는 테이블

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "tbl_document_reject")
public class DocumentReject{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long drno; // 반려 번호

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dno")
    private Document document; // 문서 번호

    private String reason; // 반려 내용

    private String rejector; // 반려자

}
