package com.project.it.domain;

import com.project.it.constant.DocumentVisibility;
import com.project.it.constant.DocumentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "tbl_document")
public class Document extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dno; // 문서 번호

    private String title; // 문서 제목

    private String description; // 문서 내용

    private String writer; // 작성자 (loginMember)

    @ElementCollection
    private List<String> sano; // SoftWare Asset Id (license_asset)

    @ElementCollection
    private List<String> hano; // HardWare Asset Id

    private Long mno; // 결재자 (MemberList Mno)

    private String approver;

    @Builder.Default
    private LocalDate approvalDate = null; // 결재 날짜

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private DocumentStatus approved = DocumentStatus.REQUESTED; // 결재 완료 여부

    @Enumerated(EnumType.STRING)
    private DocumentVisibility visibility; // 공개 여부

    // 결재 완료 여부 변경
    public void changeApproved(DocumentStatus approved) {
        this.approved = approved;
    }

    // 결재일 설정
    public void changeApprovalDate(LocalDate approvalDate) {
        this.approvalDate = approvalDate;
    }
}
