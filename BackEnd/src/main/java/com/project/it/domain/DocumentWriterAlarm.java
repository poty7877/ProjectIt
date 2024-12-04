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
@Table(name = "tbl_documnet_writer_alarm")
public class DocumentWriterAlarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long wano; // 번호

    private Long dno; // 문서번호

    private String writer; // 작성자
}
