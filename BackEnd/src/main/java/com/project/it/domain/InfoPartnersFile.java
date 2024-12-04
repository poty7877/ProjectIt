package com.project.it.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "tbl_infoPartnersFile")
public class InfoPartnersFile extends ProjectBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fno;

    // 서버에 저장된 파일 이름
    private String fileName;

    // 원본파일이름
    private String oldFileName;

    // 파일 경로
    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno")
    private InfoPartners infoPartners; // 고객사 정보

}
