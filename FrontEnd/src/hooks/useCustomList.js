import {useState} from "react";
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";

// getNum을 호출할때 파라미터, 기본값을 받아옴
const getNum = (param, defaultValue) => {
    if (!param) { // 파라미터가 없으면
        return defaultValue; // 기본값인 1, 10
    }
    return parseInt(param); // 파라미터가 있으면 인트로 변환후 리턴
};

const useCustomMove = () => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false); // 페이지 리프레시를 위한 상태
    const [queryParams] = useSearchParams(); // 현재 쿼리 파라미터 받아오기

    const page = getNum(queryParams.get("page"), 1); // 페이지 번호
    const size = getNum(queryParams.get("size"), 10); // 페이지 크기

    const queryDefault = createSearchParams({page, size}).toString(); // 기본 쿼리 문자열

    // 공통된 페이지 이동 로직
    const moveTo = (path, pageParam) => {
        let queryStr = "";

        if (pageParam) {
            const pageNum = getNum(pageParam.page, 1);
            const sizeNum = getNum(pageParam.size, 10);
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
            }).toString();
        } else {
            queryStr = queryDefault;
        }

        setRefresh(!refresh); // 상태 변경으로 리렌더링 트리거
        navigate({
            pathname: path,
            search: queryStr,
        });
    };

    // 목록 페이지로 이동
    const moveToList = (pageParam) => {
        console.log("moveToList 동작")
        moveTo("../org", pageParam);
    };

    // application 페이지로 이동
    const moveToAppList = (pageParam) => {
        console.log("moveToAppList 동작")
        moveTo("../application", pageParam);
    };

    // 수정 화면으로 이동
    const moveToModify = (id) => {
        navigate({
            pathname: `../project/modify/${id}`,
            search: queryDefault, // 수정 시 기존의 쿼리 스트링 유지를 위해
        });
    };

    // 조회 화면으로 이동
    const moveToRead = (id) => {
        navigate({
            pathname: `../project/${id}`,
            search: queryDefault,
        });
    };

    return {
        moveToList,
        moveToModify,
        moveToRead,
        page,
        size,
        moveToAppList,
    };
};

export default useCustomMove;
