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
import {getList, getListUp} from "../../api/PartnersApi";

function ProjectPartnerRegisterModal({isOpen, callbackFn}) {
    // 고객사 리스트
    const [partners, setPartners] = useState([]);
    // 고객사 리스트(페이징처리)
    const [pagePartners, setPagePartners] = useState([]);
    // 선택된 고객사 관리
    const [selectedPartners, setSelectedPartners] = useState({});
    // 필터링된 고객사 관리
    const [searchTerm, setSearchTerm] = useState("");
    // 저장 버튼 클릭시
    const handleSave = () => {
        // 부모 컴포넌트로 선택된 멤버 정보를 전달
        callbackFn(selectedPartners);
    };
    // 닫기 버튼 클릭 시
    const handleClose = () => {
        callbackFn(); // 선택된 고객사 없이 콜백 호출
    };
    // 검색어에 맞게 필터링된 고객사 목록
    const filteredMembers = partners.filter(
        (partners) =>
            (partners.comName && partners.comName.includes(searchTerm)) ||
            (partners.bizType && partners.bizType.includes(searchTerm))
    );
    // 고객사 선택 핸들러
    const handleSelectMember = (partners) => {
        setSelectedPartners(partners);
        console.log(partners);
    };

    const location = useLocation()
    // 페이징처리된 고객사 리스트 호출
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
    const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
    useEffect(() => {
        getList({ page:currentPage, size:currentSize }).then(data => {
            setPagePartners(data);
        })
    }, [])
    // 전체 리스트 호출
    useEffect(() => {
        getListUp().then(data => {
            setPartners(data)
        })
    }, [])
    // 모달 창 안에서 페이징 처리하기 위해 새로 작성
    const moveToList = (pageParam) => {
        // pageParam이 있을 때만 페이지 변경
        const pageNum = pageParam?.page || 1;
        const sizeNum = pageParam?.size || 10;
        // 페이지와 크기를 바탕으로 member 데이터를 갱신
        getList({ page: pageNum, size: sizeNum }).then((data) => {
            setPagePartners(data); // 데이터를 상태로 업데이트
        });
    };
    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label>고객사 검색</Label>
                        <Input
                            type="text"
                            placeholder="이름 또는 업종으로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* 검색어가 있을 때만 연관 검색어 목록 표시 */}
                        {(
                            <ListGroup className="mt-2">
                                {(searchTerm ? filteredMembers : pagePartners.dtoList || []).map((partners) => (
                                    <ListGroupItem
                                        key={partners.cno}
                                        action
                                        active={selectedPartners.cno === partners.cno}
                                        onClick={() => handleSelectMember(partners)}
                                    >
                                        {partners.comName} - {partners.bizType}
                                    </ListGroupItem>
                                ))}
                                {(searchTerm ? filteredMembers : pagePartners.dtoList || []).length === 0 && (
                                    <ListGroupItem disabled>일치하는 고객사가 없습니다</ListGroupItem>
                                )}
                            </ListGroup>
                        )}
                    </FormGroup>
                    <PageComponent serverData={pagePartners} movePage={moveToList} />
                    {/* 선택된 멤버 목록 표시 */}
                    <div>
                        <Label>선택된 고객사</Label>
                        <ListGroup>
                            {selectedPartners ? (
                                <ListGroupItem>
                                    {selectedPartners.comName} - {selectedPartners.bizType}
                                </ListGroupItem>
                            ) : (
                                <ListGroupItem disabled>선택된 고객사가 없습니다</ListGroupItem>
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

export default ProjectPartnerRegisterModal;
