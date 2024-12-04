package com.project.it.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default // 빌더패턴 사용시 초기값 지정
    private int page = 1;

    @Builder.Default
    private int size = 15; // 기본 사이즈

    @Builder.Default 
    private String sort = "pno"; // 정렬값

    @Builder.Default
    private Boolean order = false; // ascending, descending.

    private String searchText; // 검색어
    private String searchType; // 검색조건


}