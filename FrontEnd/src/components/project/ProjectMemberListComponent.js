import React, {useEffect, useState} from "react";
import {deleteOne, getList} from "../../api/ProjectMemberApi";
import {useParams} from "react-router-dom";
import {Button, Card, CardBody, CardTitle, Col, Label, ListGroup, ListGroupItem, Row} from "reactstrap";
import "../../styles/calendar.css";
import ProjectMemberModal from "../projectModal/ProjectMemberModal";


const ProjectMemberListComponent = () => {
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
        FINANCIAL_MANAGEMENT: "재무관리팀"
    }

    // 모달창 오픈
    const [modalOpen, setModalOpen] = useState(false);
    // pno를 파라미터에서 가져와 사용
    const {pno} = useParams();
    // 멤버선택 리스트
    const [projectMembers, setProjectMembers] = useState([]);
    // 수정 권한
    const [isEditable, setIsEditable] = useState(false);
    // 멤버를 팀별로 그룹화
    const groupedMembers = projectMembers.reduce((groups, member) => {
        const {team} = member; // member객체에서 알아서 team을 뽑아줌.
        if (!groups[team]) {
            groups[team] = [];
        }
        groups[team].push(member);
        return groups;
    }, {});
    // 함수 호출시 리스트를 다시 불러옴
    const fetchEvents = () => {
        getList(pno).then(data => {
            setProjectMembers(data);
        });
    };
    // 등록 버튼 클릭시
    const handleClickAdd = () => {
        if (!isEditable) {
            alert("등록 권한이 없습니다.")
        } else {

            setModalOpen(true);
        }
    };
    // 모달 닫힐때
    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (!modalOpen) {  // 모달이 닫힐 때 목록 새로고침
            fetchEvents();
        }
    };
    // 멤버 삭제 클릭
    const handleClickRemove = (mno) => {
        if (window.confirm("정말로 이 멤버를 삭제하시겠습니까?")) {
            deleteOne(pno, mno).then(data => {
                alert("멤버 삭제 완료!")
                fetchEvents();
            })
        }
    }

    // 새 탭에서 localStorage에서 'isEditable' 값 읽기
    useEffect(() => {
        const storedIsEditable = localStorage.getItem('isEditable');
        if (storedIsEditable) {
            setIsEditable(JSON.parse(storedIsEditable));
        }
    }, []);

    // 모달 닫힐때마다 새롣고침
    useEffect(() => {
        if (!modalOpen) {
            fetchEvents();
        }
    }, [modalOpen]);

    return (
        <div className={"mb-lg-5"}>
            <Row className="mb-4">
                <Col xs="12" style={{ textAlign: "center" }}>
                    <h1>프로젝트 참여 중인 멤버</h1>
                    <h5 className="text-muted">멤버 관리는 팀장만 가능합니다.</h5>
                </Col>
            </Row>

            {/* Flexbox Layout for Horizontal Team Cards */}
            <Row className="d-flex flex-wrap">
                {Object.keys(groupedMembers).map((team) => (
                    <Col key={team} xs="12" sm="6" md="4" lg="3" className="mb-4">
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle tag="h5">{MEMBER_TEAM_KOR[team] || team}</CardTitle>
                                <ListGroup flush>
                                    {groupedMembers[team].map((member, index) => (
                                        <ListGroupItem key={member.id || member.mno || `member-${index}`} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p>{member.name} <strong>{MEMBER_ROLE_KOR[member.memberRole] || member.memberRole}</strong></p>
                                            </div>
                                            {isEditable && member.team !== "팀장" && (
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() => handleClickRemove(member.mno)}
                                                    className="ml-2">
                                                    삭제
                                                </Button>
                                            )}
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Button color="primary" onClick={handleClickAdd} className="mt-3">멤버추가</Button>
            <ProjectMemberModal isOpen={modalOpen} callbackFn={toggleModal} pno={pno} />
        </div>
    );
};

export default ProjectMemberListComponent;
