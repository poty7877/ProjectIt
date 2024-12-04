import {Button, Card, CardBody, CardTitle, Table} from "reactstrap";

import React, {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {useLocation} from "react-router-dom";
import FetchingModal from "../projectModal/FetchingModal";
import {getList} from "../../api/PartnersApi";
import usePartnersMove from "../../hooks/usePartnersMove";
import PartnersReadModal from "../projectModal/PartnersReadModal";
import {getCookie} from "../../util/cookieUtil";

const initState = { // getList 메서드에서 반환할 PageResponseDTO 기본값 초기화 !!
    dtoList: [],
    pageNumList: [],
    pageRequestDTO: null,
    prev: false,
    next: false,
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0
}
const PartnersListComponent = () => {
    // url 에서 param값 가져올때 사용
    const location = useLocation();
    // 이동에 관련된 값들
    const {moveToList, moveToAdd, moveToRead} = usePartnersMove();
    // API 통해 가져온 데이터 관리
    const [serverData, setServerData] = useState(initState)
    // fetching
    const [fetching, setFetching] = useState(false);
    // 모달창 오픈
    const [modal, setModal] = useState(false);
    // 검색버튼 클릭
    const handleClickSearch = () => {
        setModal(true)
    }
    // 모달창 닫음
    const callbackFn = () => {
        setModal(false)
    }

    // location.search = 즉 url에 search쿼리가 변경될때 마다 실행.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
        const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
        // List 메서드 가져와 저장
        setFetching(true);
        getList({
            page: currentPage,
            size: currentSize,
        }).then(async data => {
            setServerData(data);
            setFetching(false)
        });
    }, [location.search]); // Re-fetch when the query string changes

    const token = getCookie("member");


    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <Card>
                <CardBody>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center mb-3">고객사 리스트
                        <Button onClick={handleClickSearch}>고객사 검색</Button>
                        <Button color="dark" onClick={moveToAdd}>새 고객사 등록</Button></CardTitle>

                    <Table className="no-wrap mt-3 align-middle" borderless>
                        <thead style={{cursor: 'pointer'}}>
                        <tr>
                            <th>번호</th>
                            <th>회사이름</th>
                            <th>전화번호</th>
                            <th>홈페이지</th>
                            <th>주소</th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverData.dtoList.map((partners) => (
                            <tr key={partners.cno} className="border-top" onClick={() => moveToRead(partners.cno)}>
                                <td>
                                    <div className="d-flex align-items-center p-2">
                                        <div className="ms-3">
                                            <h6 className="mb-0">{partners.cno}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">
                                            {partners.comName}
                                        </h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{partners.phone}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{partners.site}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{partners.address}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{partners.biztype}</h6>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
            <PartnersReadModal isOpen={modal} callbackFn={callbackFn}/>
        </div>
    )
}
export default PartnersListComponent;