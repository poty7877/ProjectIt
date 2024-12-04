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
import {useLocation} from "react-router-dom";
import PageComponent from "../projectModal/PageComponent";
import {getListAsset, getListAsset_list} from "../../api/ComputerApi";

const hardwareAsset = {
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

function DocumentHardWareRegisterModal({isOpen, callbackFn}) {
    // 선택된 하드웨어 관리
    const [selectedHardware, setSelectedHardware] = useState([]);
    // 필터링된 하드웨어 관리
    const [searchTerm, setSearchTerm] = useState("");
    // url 에서 param값 가져올때 사용
    const location = useLocation();
    // 하드웨어 리스트
    const [hardware, setHardware] = useState([]);
    // 하드웨어 리스트(페이징)
    const [pageHardware, setPageHardware] = useState({...hardwareAsset});
    // 저장버튼 클릭
    const handleSave = () => {
        // 부모 컴포넌트로 선택된 소프트웨어 정보를 전달
        callbackFn(selectedHardware);
    };
    // 닫기 버튼 클릭시
    const handleClose = () => {
        callbackFn();
    }
    // 검색어에 맞게 필터링된 소프트웨어 목록
    const filteredHardware = hardware.filter((hardware) =>
        (hardware && hardware.productName.includes(searchTerm)) ||
        (hardware && hardware.purpose.includes(searchTerm))
    );

    // 하드웨어 선택
    const handleSelectHardware = (hardware) => {
        const selectedAno = hardware.cno;
        console.log(selectedAno)
        getListAsset_list().then(data => {

            const ano = data.some(sh => sh.cno === hardware.cno);
            console.log(ano);
            if (!ano) {
                alert("이미 선택된 컴퓨터 입니다.")
            } else {
                const isSelected = selectedHardware.some((sh) => sh.cno === hardware.cno);
                const updatedHardware = isSelected
                    ? selectedHardware.filter((sh) => sh.cno !== hardware.cno)
                    : [...selectedHardware, hardware];
                setSelectedHardware(updatedHardware);
            }
        });
    };

    // 여기는 페이징처리된 멤버리스트
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
    const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
    useEffect(() => {
        getListAsset({page: currentPage, size: currentSize}).then(data => {
            setPageHardware(data);
        })
    }, [])

    // search쿼리 변경시마다 실행
    useEffect(() => {
        getListAsset_list().then(data => {
            setHardware(data);
            console.log(data)
        });
    }, [location.search]); // Re-fetch when the query string changes


    const moveToList = (pageParam) => {
        // 기존의 쿼리 파라미터 값 유지
        const currentPage = queryParams.get("page") || 1;
        const currentSize = queryParams.get("size") || 10;
        // 페이지와 크기를 바탕으로 member 데이터를 갱신
        getListAsset({page: currentPage, size: currentSize}).then(data => {
            setPageHardware(data);
        });
    };


    return (
        <Modal isOpen={isOpen} toggle={() => callbackFn([])}>
            <ModalHeader toggle={() => callbackFn([])}>컴퓨터 선택</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label>컴퓨터 검색</Label>
                        <Input
                            type="text"
                            placeholder=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* 검색어가 있을 때만 연관 검색어 목록 표시 */}
                        {(
                            <ListGroup className="mt-2">
                                {(searchTerm ? filteredHardware : pageHardware.dtoList || []).map((hardware) => (
                                    <ListGroupItem
                                        key={hardware.cno}
                                        action
                                        active={selectedHardware.some((ss) => ss.cno === hardware.cno)}
                                        onClick={() => handleSelectHardware(hardware)}
                                    >
                                        {hardware.productName} - {hardware.purpose}
                                    </ListGroupItem>
                                ))}
                                {(searchTerm ? filteredHardware : pageHardware.dtoList || []).length === 0 && (
                                    <ListGroupItem disabled>일치하는 컴퓨터가 없습니다.</ListGroupItem>
                                )}
                            </ListGroup>
                        )}
                    </FormGroup>
                    <PageComponent serverData={pageHardware} movePage={moveToList}></PageComponent>
                    {/* 선택된 멤버 목록 표시 */}
                    <div>
                        <Label>선택된 컴퓨터</Label>
                        <ListGroup>
                            {selectedHardware.map((hardware) => (
                                <ListGroupItem key={hardware.cno}>
                                    {hardware.productName}  - {hardware.purpose}
                                </ListGroupItem>
                            ))}
                            {selectedHardware.length === 0 && (
                                <ListGroupItem disabled>선택된 컴퓨터 없습니다</ListGroupItem>
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

export default DocumentHardWareRegisterModal;
