// 페이지 넘어가는 기능을 한곳에 모아두기 위함.

import { useState } from "react"
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom"

const getNum = (param, defaultValue) => {
    if (!param) { // 파라미터가 없으면
        return defaultValue // 기본값인 1, 10
    }
    return parseInt(param) // 파라미터가 있으면 인트로 변환후 리턴
}

const useDistMove = () => {
    const navigate = useNavigate();

    const [refresh, setRefresh] = useState(false)
    const [queryParams] = useSearchParams()
    const page = getNum(queryParams.get("page"), 1)
    const size = getNum(queryParams.get("size"), 10)
    // 디폴트 쿼리 page=1&size=10
    const queryDefault = createSearchParams({ page, size }).toString()

    // 목록으로 돌아가는 함수(Asset)
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
        setRefresh(!refresh)
        navigate({
            pathname: "../dist/licenses",
            search: queryStr,
        })
    }

     // 목록으로 돌아가는 함수(Filelist)
     const moveToFileList = (pageParam) => {
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
        setRefresh(!refresh)
        navigate({
            pathname: "../dist/filelist",
            search: queryStr,
        })
    }

    // 목록으로 돌아가는 함수(/dist/accountlist)
    const moveToAccountList = (pageParam) => {
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
        setRefresh(!refresh)
        navigate({
            pathname: "../dist/accountlist",
            search: queryStr,
        })
    }




    // 수정 화면으로 넘어가는 메서드
    const moveToModify = (id) => {
        console.log(queryDefault);

        navigate({
            pathname: `../dist/licenses`,
            search: queryDefault // 수정시 기존의 쿼리 스트링 유지를 위해
        })
    }

    // 조회 화면으로 넘어가는 메서드(asset)
    const moveToRead = (ano) => {
        console.log(queryDefault);  
        console.log("요청 ano : "+ano);

        navigate({
            pathname: `../dist/licenses/${ano}`,
            search: queryDefault
        })
    }

    // 조회 화면으로 넘어가는 메서드(asset)
    const moveToAccountRead = (siNum) => {
        console.log(queryDefault);
        console.log("요청 siNum : "+siNum);

        navigate({
            pathname: `../dist/account/${siNum}`,
            search: queryDefault
        })
    }

    //등록화면 넘어가기(info등록)
    const moveToRegister = () => {
        console.log("moveToRegister...");
        navigate({
            pathname: `../dist/licenses/register`
        })
    }

    //등록화면 넘어가기(Asset등록)
    const moveToRequest = () => {
        console.log("moveToRequest...");
        navigate({
            pathname: `../dist/licenses/request`
        })
    }

    //등록화면 넘어가기(Account등록)
    const moveToAccountRegister = () => {
        console.log("moveToAccountRegister...");
        navigate({
            pathname: `../dist/account/request`
        })
    }

    //재계약 화면으로 넘어가기(with info 객체)
    const moveToReContract = (infoDto) =>{
        console.log("moveToReContract..."+JSON.stringify(infoDto));
        localStorage.setItem('infoDTO', JSON.stringify(infoDto)); //객체저장
        //이동
        navigate({
            pathname:`../dist/licenses/recontract`
        })
    }

    return (
        { moveToList, moveToModify, moveToRead, moveToRegister, moveToRequest,  moveToReContract, moveToFileList, moveToAccountList,
            moveToAccountRegister, moveToAccountRead, page, size }
    );


}

export default useDistMove;