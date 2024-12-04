package com.project.it.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@MappedSuperclass
@Getter
@EntityListeners(value = {AuditingEntityListener.class})
public class ProjectBaseEntity {

    @CreatedDate
    @Column(name = "reg_date", updatable = false)
    private LocalDate regDate; //작성일

    @LastModifiedDate
    @Column(name = "update_date")
    private LocalDate updateDate; //수정일
}
