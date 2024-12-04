package com.project.it.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Data
public class PageResponseDTO<E> {

    private List<E> dtoList;

    private List<Integer> pageNumList;

    private PageRequestDTO pageRequestDTO;

    private boolean prev, next;

    private int totalCount, prevPage, nextPage, totalPage, current;

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, long totalCount) {

        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = (int)totalCount;

        int end =   (int)(Math.ceil( pageRequestDTO.getPage() / 10.0 )) *  10; //마지막 페이지 계산

        int start = end - 9; // 시작페이지 계산

        int last =  (int)(Math.ceil((totalCount/(double)pageRequestDTO.getSize()))); //진짜 마지막 페이지 계산

        end =  end > last ? last: end; // 마지막 페이지끼리 비교

        this.prev = start > 1; //처음으로 페이지 표시


        this.next =  totalCount > end * pageRequestDTO.getSize(); // 다음 페이지 표시

        this.pageNumList = IntStream.rangeClosed(start,end).boxed().collect(Collectors.toList());

        if(prev) {
            this.prevPage = start -1;
        }

        if(next) {
            this.nextPage = end + 1;
        }

        this.totalPage = this.pageNumList.size();

        this.current = pageRequestDTO.getPage();

    }
}