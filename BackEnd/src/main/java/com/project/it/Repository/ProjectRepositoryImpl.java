package com.project.it.Repository;

import com.project.it.domain.Project;
import com.project.it.domain.QProject;
import com.project.it.domain.QProjectMember;
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

public class ProjectRepositoryImpl implements ProjectRepositoryCustom {

    private final JPAQueryFactory jpaQueryFactory;

    public ProjectRepositoryImpl(EntityManager em) {
        this.jpaQueryFactory = new JPAQueryFactory(em);
    }

    @Override
    public Page<Project> searchProjects(PageRequestDTO pageRequestDTO, Pageable pageable) {
        QProject project = QProject.project;
        QProjectMember projectMember = QProjectMember.projectMember;

        String searchText = pageRequestDTO.getSearchText();
        String searchType = pageRequestDTO.getSearchType();

        // 기본 검색 조건 설정
        BooleanExpression predicate = project.isDeleted.isFalse(); // 삭제되지 않은 프로젝트만

        // 검색 필터 적용
        if (searchText != null && !searchText.isEmpty()) {
            if (searchType != null) {
                switch (searchType) {
                    case "title":
                        predicate = predicate.and(project.title.containsIgnoreCase(searchText));
                        break;
                    case "content":
                        predicate = predicate.and(project.content.containsIgnoreCase(searchText));
                        break;
                    case "name":
                        // Join을 위한 조건 추가
                        predicate = predicate.and(projectMember.name.containsIgnoreCase(searchText));
                        break;
                    default:
                        break;
                }
            }
        }

        // 페이지 처리 및 정렬 적용
        List<Project> result = jpaQueryFactory
                .selectDistinct(project)
                .from(project)
                .leftJoin(projectMember).on(project.pno.eq(projectMember.project.pno)) // ON 조건 추가
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderBy(pageRequestDTO)) // 정렬 기준 설정
                .fetch();

        // 전체 결과 개수
        long total = jpaQueryFactory
                .selectDistinct(project)
                .from(project)
                .leftJoin(projectMember).on(project.pno.eq(projectMember.project.pno))
                .where(predicate)
                .stream()
                .count();

        return new PageImpl<>(result, pageable, total);
    }

    @Override
    public Page<Project> searchMyProjects(Long mno, PageRequestDTO pageRequestDTO, Pageable pageable) {
        QProject project = QProject.project;
        QProjectMember projectMember = QProjectMember.projectMember;

        String searchText = pageRequestDTO.getSearchText();
        String searchType = pageRequestDTO.getSearchType();

        // 기본 검색 조건 설정
        BooleanExpression predicate = project.isDeleted.isFalse().and(projectMember.mno.eq(mno)); // 삭제되지 않은 프로젝트만

        // 검색 필터 적용
        if (searchText != null && !searchText.isEmpty()) {
            if (searchType != null) {
                switch (searchType) {
                    case "title":
                        predicate = predicate.and(project.title.containsIgnoreCase(searchText));
                        break;
                    case "content":
                        predicate = predicate.and(project.content.containsIgnoreCase(searchText));
                        break;
                    case "name":
                        // Join을 위한 조건 추가
                        predicate = predicate.and(projectMember.name.containsIgnoreCase(searchText));
                        break;
                    default:
                        break;
                }
            }
        }

        // 페이지 처리 및 정렬 적용
        List<Project> result = jpaQueryFactory
                .selectDistinct(project)
                .from(project)
                .leftJoin(projectMember).on(project.pno.eq(projectMember.project.pno)) // ON 조건 추가
                .where(predicate)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(getOrderBy(pageRequestDTO)) // 정렬 기준 설정
                .fetch();

        // 전체 결과 개수
        long total = jpaQueryFactory
                .selectDistinct(project)
                .from(project)
                .leftJoin(projectMember).on(project.pno.eq(projectMember.project.pno))
                .where(predicate)
                .stream()
                .count();

        return new PageImpl<>(result, pageable, total);
    }

    private OrderSpecifier<?> getOrderBy(PageRequestDTO pageRequestDTO) {
        String sortBy = pageRequestDTO.getSort() != null ? pageRequestDTO.getSort() : "pno";
        boolean isAscending = pageRequestDTO.getOrder();

        // sortBy에 맞는 QProject 필드 선택
        switch (sortBy) {
            case "title":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.title)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.title);
            case "status":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.status)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.status);
            case "progress":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.progress)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.progress);
            case "startDate":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.startDate)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.startDate);
            case "dueDate":
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.dueDate)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.dueDate);
            default:
                return isAscending
                        ? new OrderSpecifier<>(Order.ASC, QProject.project.pno)
                        : new OrderSpecifier<>(Order.DESC, QProject.project.pno);
        }
    }


}
