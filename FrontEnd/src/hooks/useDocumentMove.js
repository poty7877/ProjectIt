// 페이지 넘어가는 기능을 한곳에 모아두기 위함.

import {useState} from "react"
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom"
import {deleteDocumentApproverCount, deleteDocumentWriterCount} from "../api/DocumentAlarmApi";
import {getCookie} from "../util/cookieUtil";

// getNum을 호출할때 파라미터, 기본값을 받아옴
const getParam = (param, defaultValue, isNumeric = false) => {
    if (!param) {
        return defaultValue; // 파라미터가 없으면 기본값 반환
    }
    return isNumeric ? parseInt(param) : param; // 숫자인 경우 int로 변환, 그렇지 않으면 원래 값 반환
};


const useDocumentMove = () => {
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
    const searchType = getParam(queryParams.get("searchType"), "")
    const searchText = getParam(queryParams.get("searchText"), "")

    // 디폴트 쿼리 page=1&size=10
    const queryDefault = createSearchParams({page, size, sort, order, searchType, searchText}).toString()

    // 문서작성 으로 이동
    const moveToAdd = (mno) => {
        if (mno) {
            navigate({
                pathname: `../document/add`,
                search: queryDefault // 수정시 기존의 쿼리 스트링 유지를 위해
            })
        } else {
            alert("로그인 후 이용 가능합니다.")
        }
    }

    // 목록으로 돌아가는 함수
    const moveToRequestedList = (pageParam) => {
        let queryStr

        const currentSort = queryParams.get("sort") || "dno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }

        setRefresh(!refresh)
        navigate({
            pathname: `../document/requested/list`,
            search: queryStr,
        })
    }

    // 목록으로 돌아가는 함수
    const moveToApprovedList = (pageParam) => {
        let queryStr

        const currentSort = queryParams.get("sort") || "dno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: `../document/approved/list`,
            search: queryStr,
        })
    }

    // 목록으로 돌아가는 함수
    const moveToRejectedList = (pageParam) => {
        let queryStr

        const currentSort = queryParams.get("sort") || "dno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }

        setRefresh(!refresh)
        navigate({
            pathname: `../document/rejected/list`,
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
    const moveToRead = (dno, mno) => {
        if (mno) {
            deleteDocumentApproverCount(dno).then(data => {
                console.log(data)
            })
            deleteDocumentWriterCount(dno).then(data => {
                console.log(data)
            })
            console.log(queryDefault)

            navigate({
                pathname: `../document/${dno}`,
                search: queryDefault
            })
        } else {
            alert("로그인 후 이용 가능합니다.")
        }
    }

    // 결재자 리스트로 이동
    const moveToApproverList = (pageParam) => {
        const token = getCookie("member");
        const mno = token?.mno
        let queryStr

        const currentSort = queryParams.get("sort") || "dno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        navigate({
            pathname: `../document/approver/list/${mno}`,
            search: queryStr,
        })
    }

    // 작성사 리스트로 이동
    const moveToWriterList = (writer, pageParam) => {
        let queryStr

        const currentSort = queryParams.get("sort") || "dno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: `../document/writer/list/${writer}`,
            search: queryStr,
        })
    }


    return (
        {
            moveToRequestedList,
            moveToApprovedList,
            moveToRejectedList,
            moveToModify,
            moveToRead,
            moveToApproverList,
            moveToWriterList,
            moveToAdd,
            page,
            size,
            sort,
            searchType,
            searchText,
        }
    );
}

export default useDocumentMove;