// ResultModal.js
import React, {useEffect, useState} from 'react';

import {
    Button,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem, Modal,
    ModalBody, ModalFooter,
    ModalHeader,
} from "reactstrap";
import {getListAsset, getListAsset_list} from "../../api/LicenseApi";
import {useLocation} from "react-router-dom";
import PageComponent from "../projectModal/PageComponent";

const softwareAsset = { // getList 메서드에서 반환할 PageResponseDTO 기본값 초기화 !!
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

function DocumentSoftWareRegisterModal({ isOpen, callbackFn}) {

    // 선택된 소프트웨어 관리
    const [selectedSoftware, setSelectedSoftware] = useState([]);
    // 필터링된 소프트웨어 관리
    const [searchTerm, setSearchTerm] = useState("");
    // url 에서 param값 가져올때 사용
    const location = useLocation();
    // 소프트웨어 객체값 관리
    const [software, setSoftware] = useState([]);

    const [pageSoftWare, setPageSoftWare] = useState({...softwareAsset});
    // 이동관련 메서드

    const handleSave = () => {
        // 부모 컴포넌트로 선택된 소프트웨어 정보를 전달
        callbackFn(selectedSoftware);
    };

    const handleClose = () => {
        callbackFn();
    }

    // 검색어에 맞게 필터링된 소프트웨어 목록
    const filteredSoftware = software.filter((software) =>
        (software.rightName.includes(searchTerm)) ||
        (software.usePurpose.includes(searchTerm))
    );


    // 소프트웨어 선택
    const handleSelectSoftware = (software) => {
        const selectedAno = software.ano;
        console.log(selectedAno)

        getListAsset_list().then(data => {

            const ano = data.some(ss => ss.ano === software.ano);
            console.log(ano);
            if(!ano) {
                alert("이미 선택된 소프트웨어 입니다.")
            } else  {
                const isSelected = selectedSoftware.some((ss) => ss.ano === software.ano);
                const updatedSoftware = isSelected
                    ? selectedSoftware.filter((ss) => ss.ano !== software.ano)
                    : [...selectedSoftware, software];
                setSelectedSoftware(updatedSoftware);
            }
        });
    };

    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
    const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
    useEffect(() => {
        getListAsset({ page:currentPage, size:currentSize }).then(data => {
            setPageSoftWare(data);
            console.log(data)
        })
    }, [])

    // search쿼리 변경시마다 실행
    useEffect(() => {
        getListAsset_list().then(data => {
            setSoftware(data);
            console.log(data)
        });
    }, [location.search]); // Re-fetch when the query string changes


    const moveToList = (pageParam) => {
        // 기존의 쿼리 파라미터 값 유지
        const currentPage = queryParams.get("page") || 1;
        const currentSize = queryParams.get("size") || 10;

        // pageParam이 있을 때만 페이지 변경
        const pageNum = pageParam?.page || currentPage;
        const sizeNum = pageParam?.size || currentSize;

        // 페이지와 크기를 바탕으로 member 데이터를 갱신
        getListAsset({ page: pageNum, size: sizeNum }).then(data => {
            setPageSoftWare(data);
        });
    };





    return (
        <Modal isOpen={isOpen}  toggle={() => callbackFn([])}>
            <ModalHeader toggle={() => callbackFn([])}>소프트웨어 선택</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label>소프트 웨어 검색</Label>
                        <Input
                            type="text"
                            placeholder="이름 또는 팀으로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* 검색어가 있을 때만 연관 검색어 목록 표시 */}
                        {(
                            <ListGroup className="mt-2">
                                {(searchTerm ? filteredSoftware : pageSoftWare.dtoList || []).map((software) => (
                                    <ListGroupItem
                                        key={software.ano}
                                        action
                                        active={selectedSoftware.some((ss) => ss.ano === software.ano)}
                                        onClick={() => handleSelectSoftware(software)}
                                    >
                                        {software.rightName} - {software.usePurpose}
                                    </ListGroupItem>
                                ))}
                                {(searchTerm ? filteredSoftware : pageSoftWare.dtoList || []).length === 0 && (
                                    <ListGroupItem disabled>일치하는 소프트 웨어가 없습니다.</ListGroupItem>
                                )}
                            </ListGroup>
                        )}
                        <PageComponent serverData={pageSoftWare} movePage={moveToList}></PageComponent>
                    </FormGroup>

                    {/* 선택된 멤버 목록 표시 */}
                    <div>
                        <Label>선택된 소프트웨어</Label>
                        <ListGroup>
                            {selectedSoftware.map((software) => (
                                <ListGroupItem key={software.ano}>
                                    {software.rightName}  - {software.usePurpose}
                                </ListGroupItem>
                            ))}
                            {selectedSoftware.length === 0 && (
                                <ListGroupItem disabled>선택된 소프트웨어가 없습니다</ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                    <Button onClick={handleSave}>저장</Button>
                </div>

            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={handleClose}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DocumentSoftWareRegisterModal;
