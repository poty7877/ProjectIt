package com.project.it.Repository;

import com.project.it.constant.DocumentStatus;
import com.project.it.domain.Document;
import com.project.it.domain.Project;
import com.project.it.domain.QDocument;
import com.project.it.domain.QProject;
import com.project.it.dto.PageRequestDTO;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class DocumentRepositoryImpl implements DocumentRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public DocumentRepositoryImpl(EntityManager em) {
        this.jpaQueryFactory = new JPAQueryFactory(em);
    }

    @Override
    // status = approved 결재 상태를 이용해 검색과 페이징 처리함.
    public Page<Document> searchDocumentByApproved(DocumentStatus status, PageRequestDTO pageRequestDTO, Pageable pageable) {
        QDocument document = QDocument.document;

        // 검색어 , 검색타입 설정
        String searchText = pageRequestDTO.getSearchText();
        String searchType = pageRequestDTO.getSearchType();

        // 미리 조건을 만듬
        BooleanExpression predicate = document.approved.eq(status);

        // 검색어가 있는경우
        if (searchText != null && !searchText.isEmpty()) {
            // 검색 타입이 있는경우 조건을 추가
            if (searchType != null) {
                switch (searchType) {
                    case "title":
                        predicate = predicate.and(document.title.containsIgnoreCase(searchText));
                        break;

                    case "description":
                        predicate = predicate.and(document.description.containsIgnoreCase(searchText));
                        break;

                    case "writer" :
                        predicate = predicate.and(document.writer.containsIgnoreCase(searchText));
                        break;

                    default:
                        break;
                }
            }
        }

        List<Document> result = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderBy(pageRequestDTO))
                .fetch();

        long total = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .stream().count();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<Document> searchDocumentByMno(Long mno, PageRequestDTO pageRequestDTO, Pageable pageable) {
        QDocument document = QDocument.document;

        String searchText = pageRequestDTO.getSearchText();
        String searchType = pageRequestDTO.getSearchType();

        BooleanExpression predicate = document.mno.eq(mno);

        if (searchText != null && !searchText.isEmpty()) {
            if (searchType != null) {
                switch (searchType) {
                    case "title":
                        predicate = predicate.and(document.title.containsIgnoreCase(searchText));
                        break;

                    case "description":
                        predicate = predicate.and(document.description.containsIgnoreCase(searchText));
                        break;

                    case "writer" :
                        predicate = predicate.and(document.writer.containsIgnoreCase(searchText));
                        break;

                    default:
                        break;
                }
            }
        }

        List<Document> result = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderBy(pageRequestDTO))
                .fetch();

        long total = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .stream().count();

        return new PageImpl<>(result, pageable, total);

    }

    @Override
    public Page<Document> searchDocumentByWriter(String writer, PageRequestDTO pageRequestDTO, Pageable pageable) {
        QDocument document = QDocument.document;

        String searchText = pageRequestDTO.getSearchText();
        String searchType = pageRequestDTO.getSearchType();

        BooleanExpression predicate = document.writer.eq(writer);

        if (searchText != null && !searchText.isEmpty()) {
            if (searchType != null) {
                switch (searchType) {
                    case "title":
                        predicate = predicate.and(document.title.containsIgnoreCase(searchText));
                        break;

                    case "description":
                        predicate = predicate.and(document.description.containsIgnoreCase(searchText));
                        break;

                    case "writer" :
                        predicate = predicate.and(document.writer.containsIgnoreCase(searchText));
                        break;

                    default:
                        break;
                }
            }
        }

        List<Document> result = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderBy(pageRequestDTO))
                .fetch();

        long total = jpaQueryFactory
                .selectDistinct(document)
                .from(document)
                .where(predicate)
                .stream().count();

        return new PageImpl<>(result, pageable, total);
    }

    // 오름차순 내림차순 관리 하기 위함
    private OrderSpecifier<?> getOrderBy(PageRequestDTO pageRequestDTO) {
        // PageRequestDTO에서 정렬 타입과, 방식을 가져옴
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "dno";
        boolean isAscending = pageRequestDTO.getOrder();

        // sortBy에 맞는 QProject 필드 선택
        switch (sortBy) {
            case "title":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QDocument.document.title)
                        : new OrderSpecifier<>(Order.DESC, QDocument.document.title);
            case "description":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QDocument.document.description)
                        : new OrderSpecifier<>(Order.DESC, QDocument.document.description);
            case "writer":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QDocument.document.writer)
                        : new OrderSpecifier<>(Order.DESC, QDocument.document.writer);
            default:
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QDocument.document.dno)
                        : new OrderSpecifier<>(Order.DESC, QDocument.document.dno);
        }
    }
}
