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

import {list2, page} from "../../api/organizationAPI";
import {useLocation} from "react-router-dom";
import PageComponent from "../projectModal/PageComponent";

function DocumentSoftWareRegisterModal({isOpen, callbackFn}) {
    const MEMBER_ROLE_KOR = {
        CONTRACT_WORKER: "계약직",
        INTERN: "인턴",
        STAFF: "사원",
        ASSOCIATE: "주임",
        ASSISTANT_MANAGER: "대리",
        MANAGER: "과장",
        DEPUTY_MANAGER: "차장",
        GENERAL_MANAGER: "부장",
        DIRECTOR: "이사",
        SENIOR_DIRECTOR: "상무 이사",
        EXECUTIVE_VICE_PRESIDENT: "전무이사",
        PRESIDENT: "사장",
        VICE_CHAIRMAN: "부회장",
        CHAIRMAN: "회장",
        CEO: "대표이사",
    };

    const MEMBER_TEAM_KOR = {
        AWAIT: "대기",
        TECHNIC: "기술팀",
        PERSONNEL: "인사팀",
        ACCOUNTING: "회계팀",
        FINANCIAL_MANAGEMENT: "재무관리팀",
        팀장: "팀장"
    }
    // path 설정
    const location = useLocation()
    // 멤버 리스트
    const [member, setMember] = useState([]);
    // 멤버 리스트(페이징처리)
    const [pageMember, setPageMember] = useState([]);
    // 선택된 멤버 관리
    const [selectedMembers, setSelectedMembers] = useState({});
    // 필터링된 소프트웨어 관리
    const [searchTerm, setSearchTerm] = useState("");
    // 저장 버튼 클릭시
    const handleSave = () => {
        // 부모 컴포넌트로 선택된 멤버 정보를 전달
        callbackFn(selectedMembers);
    };
    // 닫기 버튼 클릭 시
    const handleClose = () => {
        callbackFn(); // 선택된 멤버 없이 콜백 호출
    };
    // 검색어에 맞게 필터링된 멤버 목록
    const filteredMembers = member.filter(
        (member) =>
            (member.name && member.name.includes(searchTerm)) ||
            (member.antecedents && member.antecedents.includes(searchTerm))
    );
    // 멤버 선택 핸들러
    const handleSelectMember = (member) => {
        setSelectedMembers(member);
        console.log(member);
    };
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
    const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
    // 모달창 안에서 페이징 처리 위함
    const moveToList = (pageParam) => {
        // 기존의 쿼리 파라미터 값 유지
        const currentPage = queryParams.get("page") || 1;
        const currentSize = queryParams.get("size") || 10;

        // pageParam이 있을 때만 페이지 변경
        const pageNum = pageParam?.page || currentPage;
        const sizeNum = pageParam?.size || currentSize;

        // 페이지와 크기를 바탕으로 member 데이터를 갱신

        page({ page: pageNum, size: sizeNum }).then((data) => {
            setPageMember(data); // 데이터를 상태로 업데이트
        });
    };

    // 여기는 페이징처리된 멤버리스트
    useEffect(() => {
        page({ page:currentPage, size:currentSize }).then(data => {
            setPageMember(data);
        })
    }, [])

    // 여기는 전체 리스트
    useEffect(() => {
        list2().then(data => {
            setMember(data)
        })
    }, [])

    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label>멤버 검색</Label>
                        <Input
                            type="text"
                            placeholder="이름 또는 팀으로 검색"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* 검색어가 있을 때만 연관 검색어 목록 표시 */}
                        {(
                            <ListGroup className="mt-2">
                                {(searchTerm ? filteredMembers : pageMember.dtoList || []).map((member) => (
                                    <ListGroupItem
                                        key={member.mno}
                                        action
                                        active={selectedMembers.mno === member.mno}
                                        onClick={() => handleSelectMember(member)}
                                    >
                                        {member.name} - {MEMBER_ROLE_KOR[member.memberRole]} ({MEMBER_TEAM_KOR[member.team]})
                                    </ListGroupItem>
                                ))}
                                {(searchTerm ? filteredMembers : pageMember.dtoList || []).length === 0 && (
                                    <ListGroupItem disabled>일치하는 멤버가 없습니다</ListGroupItem>
                                )}
                            </ListGroup>
                        )}
                    </FormGroup>
                    <PageComponent serverData={pageMember} movePage={moveToList} />
                    {/* 선택된 멤버 목록 표시 */}
                    <div>
                        <Label>선택된 멤버</Label>
                        <ListGroup>
                            {selectedMembers ? (
                                <ListGroupItem>
                                    {selectedMembers.name} - {MEMBER_ROLE_KOR[selectedMembers.memberRole]} ({MEMBER_TEAM_KOR[selectedMembers.team]})
                                </ListGroupItem>
                            ) : (
                                <ListGroupItem disabled>선택된 멤버가 없습니다</ListGroupItem>
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
