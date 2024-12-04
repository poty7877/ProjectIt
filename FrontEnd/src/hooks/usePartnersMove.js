// getNum을 호출할때 파라미터, 기본값을 받아옴
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
import {getCookie} from "../util/cookieUtil";

const token = getCookie("member");

// getNum을 호출할때 파라미터, 기본값을 받아옴
const getNum = (param, defaultValue) => {
    if (!param) { // 파라미터가 없으면
        return defaultValue // 기본값인 1, 10
    }
    return parseInt(param) // 파라미터가 있으면 인트로 변환후 리턴
}

const usePartnersMove = () => {
    const navigate = useNavigate();
    const [queryParams] = useSearchParams()
    const page = getNum(queryParams.get("page"), 1)
    const size = getNum(queryParams.get("size"), 10)
    // 디폴트 쿼리 page=1&size=10
    const queryDefault = createSearchParams({page, size}).toString()
// 목록으로 돌아가는 함수
    const moveToList = (pageParam) => {
        let queryStr = ""

        if (pageParam) { // pageParam이 있으면,
            // 파라미터 추출
            const pageNum = getNum(pageParam.page, 1)
            const sizeNum = getNum(pageParam.size, 10)
            // 하나로 합침
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum
            }).toString()
        } else { // pageParam없으면 기본값 1, 10
            queryStr = queryDefault
        }
        navigate({
            pathname: "../partners",
            search: queryStr,
        })
    }

    // 수정화면으로 이동
    const moveToModify = (cno) => {
        console.log(cno)
        navigate({
            pathname: `../partners/modify/${cno}`,
        })
    }

    // 등록화면으로 이동
    const moveToAdd = () => {
        if (token?.mno) {
            navigate({
                pathname: "../partners/register",
            })
        } else {
            alert("로그인 후 이용 가능한 기능입니다.")
        }

    }

    const moveToRead = (cno) => {
        if (token?.mno) {
            navigate({
                pathname: `../partners/${cno}`
            })
        } else {
            alert("로그인 후 이용 가능한 기능입니다.")
        }
    }

    return ({
        moveToList,
        moveToModify,
        moveToAdd,
        moveToRead,
        page,
        size
    })
}
export default usePartnersMove;