// 페이지 넘어가는 기능을 한곳에 모아두기 위함.

import { useState } from "react"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

// getNum을 호출할때 파라미터, 기본값을 받아옴
const getParam = (param, defaultValue, isNumeric = false) => {
    if (!param) {
        return defaultValue; // 파라미터가 없으면 기본값 반환
    }
    return isNumeric ? parseInt(param) : param; // 숫자인 경우 int로 변환, 그렇지 않으면 원래 값 반환
};


const useCustomMove = () => {
    const navigate = useNavigate();
    // 현재 페이지를 다시 클릭하면 서버 호출을 하지않음,
    // 동일한 page, size더라도 매번 서버 호출하고 싶으면 매번 변하는 상태값을 이용해야함.
    // 즉 버튼 클릭시 true와 false 값이 번갈아 가면서 변경되거나, 숫자가 계속올라가거나, 현재시간등을 이용할수있음
    const [refresh, setRefresh] = useState(false)
    const [queryParams] = useSearchParams()
    const page = getParam(queryParams.get("page"), 1)
    const size = getParam(queryParams.get("size"), 10)
    const sort = getParam(queryParams.get("sort"), "")
    const order = getParam(queryParams.get("order"), "desc")

    // 디폴트 쿼리 page=1&size=10
    const queryDefault = createSearchParams({ page, size, sort, order }).toString()

    // 목록으로 돌아가는 함수
    const moveToList = (pageParam) => {
        let queryStr = ""

        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project",
            search: queryStr,
        })
    }

    const moveToDeletedList = (pageParam) => {
        let queryStr = ""

        if (pageParam) { // pageParam이 있으면,
            // 파라미터 추출
            const pageNum = getParam(pageParam.page, 1)
            const sizeNum = getParam(pageParam.size, 10)
            const sort = getParam(pageParam.sort, "pno")
            // 하나로 합침
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: sort
            }).toString()
        } else { // pageParam없으면 기본값 1, 10
            queryStr = queryDefault
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project/deleted",
            search: queryStr,
        })
    }


    // 수정 화면으로 넘어가는 메서드
    const moveToModify = (id) => {
        console.log(queryDefault);

        navigate({
            pathname: `../project/modify/${id}`,
            search: queryDefault // 수정시 기존의 쿼리 스트링 유지를 위해
        })
    }

    // 조회 화면으로 넘어가는 메서드
    const moveToRead = (pno) => {
        console.log(queryDefault)

        navigate({
            pathname: `../project/${pno}`,
            search: queryDefault
        })
    }

    const moveToMyList = (mno, pageParam) => {
        let queryStr = ""

        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: `../project/list/${mno}`,
            search: queryStr,
        })
    }

    const moveToIssueList = (pageParam) => {
        let queryStr = ""

        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        console.log("Received pageParam:", pageParam);
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project/issue",
            search: queryStr,
        })
    }

    // 해당 프로젝트 이슈 리스트
    const moveToProjectIssueList = (pno, pageParam) => {

        let queryStr = ""


        const currentSort = "ino"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        console.log("Received pageParam:", pageParam);
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            console.log("pageNum:", pageNum, "sizeNum:", sizeNum);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        console.log("Navigating with query:", queryStr); // 쿼리 문자열 로그로 확인
        navigate({
            pathname: `../project/issue/${pno}`,
            search: queryStr,
        })
    }

    // 조회 화면으로 넘어가는 메서드
    const moveToIssueRead = (pno) => {

        navigate({
            pathname: `../project/issue/${pno}`

        })
    }



    return (
        { moveToList, moveToModify,moveToDeletedList, moveToRead,moveToMyList,moveToIssueList,moveToIssueRead,moveToProjectIssueList, page, size, sort }
    );
}

export default useCustomMove;