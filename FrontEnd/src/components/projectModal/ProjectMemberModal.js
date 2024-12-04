// ResultModal.js
import React, {useEffect, useState} from 'react';

import {getList, postAdd} from "../../api/ProjectMemberApi";

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
import FetchingModal from "./FetchingModal";
import {useLocation} from "react-router-dom";
import PageComponent from "./PageComponent";


function ProjectMemberModal({isOpen, callbackFn, pno}) {
    // enum타입을 한글로 바꿔줌
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
    // enum타입을 한글로 바꿔줌
    const MEMBER_TEAM_KOR = {
        AWAIT: "대기",
        TECHNIC: "기술팀",
        PERSONNEL: "인사팀",
        ACCOUNTING: "회계팀",
        FINANCIAL_MANAGEMENT: "재무관리팀"
    }
    // 멤버리스트
    const [member, setMember] = useState([]);
    // 멤버리스트(페이징)
    const [pageMember, setPageMember] = useState([]);
    // 선택된 멤버 관리
    const [selectedMembers, setSelectedMembers] = useState([]);
    // 필터링 된 멤버 관리
    const [searchTerm, setSearchTerm] = useState("");
    // fetching
    const [fetching, setFetching] = useState(false);
    // 검색어에 맞게 필터링된 멤버 목록
    const filteredMembers = member.filter(
        (member) =>
            (member.name && member.name.includes(searchTerm)) ||
            (MEMBER_TEAM_KOR[member.team] && MEMBER_TEAM_KOR[member.team].includes(searchTerm)) ||
            (MEMBER_ROLE_KOR[member.memberRole] && MEMBER_ROLE_KOR[member.memberRole].includes(searchTerm))
    );
    const location = useLocation()
    // 페이징처리된 멤버리스트
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
    const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
    useEffect(() => {
        page({page: currentPage, size: currentSize}).then(data => {
            setPageMember(data);
        })
    }, [])
    // 여기는 전체 리스트
    useEffect(() => {
        list2().then(data => {
            setMember(data)
        })
    }, [])
    // 멤버 선택 핸들러
    const handleSelectMember = (member) => {
        const selectedMno = member.mno;
        console.log(selectedMno)
        getList(pno).then(data => {
            const pmno = data.some(m => m.mno === member.mno);
            console.log(pmno);
            if (pmno) {
                alert("이미 참여중인 멤버입니다.")
            } else {
                const isSelected = selectedMembers.some((m) => m.mno === member.mno);
                const updatedMembers = isSelected
                    ? selectedMembers.filter((m) => m.mno !== member.mno)
                    : [...selectedMembers, member];
                setSelectedMembers(updatedMembers);
            }
        });
    };
    // 등록 버튼 클릭
    const handleClickAdd = () => {
        setFetching(true)
        postAdd(selectedMembers, pno).then(data => {
            if (data) {  // 성공 시 모달 닫기
                setSelectedMembers([]);
                setFetching(false)
                callbackFn();  // 모달을 닫고 toggleModal이 호출되어 목록이 새로고침됨
            }
        });
    };
    const moveToList = (pageParam) => {
        // 기존의 쿼리 파라미터 값 유지
        const currentPage = queryParams.get("page") || 1;
        const currentSize = queryParams.get("size") || 10;
        // pageParam이 있을 때만 페이지 변경
        const pageNum = pageParam?.page || currentPage;
        const sizeNum = pageParam?.size || currentSize;
        // 페이지와 크기를 바탕으로 member 데이터를 갱신
        setFetching(true); // 로딩 시작
        page({page: pageNum, size: sizeNum}).then((data) => {
            setPageMember(data); // 데이터를 상태로 업데이트
            setFetching(false); // 로딩 종료
        });
    };
    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
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
                                        active={selectedMembers.some((m) => m.mno === member.mno)}
                                        onClick={() => handleSelectMember(member)}
                                    >
                                        {member.name} {MEMBER_ROLE_KOR[member.memberRole] || member.memberRole} -
                                        ({MEMBER_TEAM_KOR[member.team] || member.team})
                                    </ListGroupItem>
                                ))}
                                {(searchTerm ? filteredMembers : pageMember.dtoList || []).length === 0 && (
                                    <ListGroupItem disabled>일치하는 멤버가 없습니다</ListGroupItem>
                                )}
                            </ListGroup>
                        )}
                    </FormGroup>

                    {/* 선택된 멤버 목록 표시 */}
                    <div>
                        <Label>선택된 멤버</Label>
                        <ListGroup>
                            {selectedMembers.map((member) => (
                                <ListGroupItem key={member.id}>
                                    {member.name} {MEMBER_ROLE_KOR[member.memberRole] || member.memberRole} -
                                    ({MEMBER_TEAM_KOR[member.team] || member.team})
                                </ListGroupItem>
                            ))}
                            {selectedMembers.length === 0 && (
                                <ListGroupItem disabled>선택된 멤버가 없습니다</ListGroupItem>
                            )}
                        </ListGroup>
                    </div>
                    <button className={"btn btn-primary"}
                            onClick={handleClickAdd}>저장
                    </button>
                </div>
            </ModalBody>
            <ModalFooter>
                <PageComponent serverData={pageMember} movePage={moveToList}/>
                <Button color="secondary" onClick={callbackFn}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default ProjectMemberModal;
