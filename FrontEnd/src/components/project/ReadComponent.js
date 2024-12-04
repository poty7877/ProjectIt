import React, {useState, useEffect} from "react";
import {Button, FormGroup, Label, Input, Form} from "reactstrap";
import {getOne} from "../../api/ProjectApi";
import useProjectMove from "../../hooks/useProjectMove";
import {getCookie} from "../../util/cookieUtil";
import FetchingModal from "../projectModal/FetchingModal";
import {useLocation, useNavigate} from "react-router-dom";
import {getOnePp} from "../../api/ProjectPartnerApi";
import PartnersReadModal from "../projectModal/ProjectPartnersReadModal";
import {getList} from "../../api/ProjectMemberApi";
import useChatMove from "../../hooks/useChatMove";

const initState = {
    pno: 0,
    title: "",
    regDate: "",
    updateDate: "",
    startDate: "",
    dueDate: "",
    content: "",
    status: "",
    progress: "",
    version: "",
    mno: "",
}
const ReadComponent = ({pno}) => {
    // 이동관련 함수들
    const {
        moveToList,
        moveToModify,
        moveToProjectIssueList,
        moveToProjectMember,
        moveToCalendar,
        moveToProjectPartnerUpdate
    } = useProjectMove()
    // api로 가져온 프로젝트
    const [project, setProject] = useState(initState);
    // 프로젝트 참여 멤버
    const [projectMembers, setProjectMembers] = useState([]);
    // 고객사 정보조회 모달
    const [pmodal, setPmodal] = useState(false)
    // 고객사 정보
    const [partner, setPartner] = useState({});
    // 채팅방
    const {moveToChatRoom} = useChatMove()
    // url
    const location = useLocation()
    // 이동
    const navigate = useNavigate()
    // 토큰 가져옴
    const token = getCookie("member")
    // 로딩 모달
    const [fetching, setFetching] = useState(false)


    // 로그인한 사람이 팀장인가 ?
    let isEditable = token?.mno && project.mno === token.mno;
    if (!token?.mno) {
        isEditable = false;
    }
    // 로그인한 사람이 프로젝트 멤버인가 ?
    const isProjectMember = token?.mno && projectMembers.some(member => member.mno === token.mno);


    // 고객사 상세정보 클릭시
    const handleClickPartnerDetail = () => {
        setPmodal(true)
    }
    // 모달 닫음
    const closeModal = () => {
        setPmodal(false)
    }

    useEffect(() => {
        setFetching(true);
        getOne(pno).then(data => {
            setProject(data); // 프로젝트 데이터를 가져옴
            setFetching(false);
            if (data.projectType === true) {
                getOnePp(pno).then(partnerData => {
                    if (partnerData) {
                        setPartner(partnerData);
                    }
                });
            }
        });
    }, [pno]);


    // 로딩 모달이 안꺼지는 경우가 있어서 설정함.
    useEffect(() => {
        if (fetching) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [fetching]);

    // 프로젝트 참여 멤버 가져옴
    useEffect(() => {
        getList(pno).then(data => {
            setProjectMembers(data)
        })
    }, [pno])

    useEffect(() => {
        if (token && token.mno) {
            console.log("로그인 확인 완료:", token.mno);
            return; // token.mno가 있을 경우 더 이상 실행하지 않음
        }

        alert("로그인 후 이용 가능한 기능입니다.");
        const previousPage = location.state?.from || "/project";
        navigate(previousPage);
    }, [token, navigate, location]);


    return (
        <div className="project-details">
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <h3>프로젝트 상세 정보</h3>
            <Form>
                <FormGroup>
                    <Label>제목</Label>
                    <Input type="text" value={project.projectType ? `[고객사] ${project.title}` : project.title} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>

                <FormGroup>
                    <Label>작성자(팀장)</Label>
                    <Input type="text" value={project.name} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <div className="d-flex">
                    <FormGroup style={{width: 630}}>
                        <Label>시작일</Label>
                        <Input type="text" value={project.startDate} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                    <FormGroup style={{width: 630}}>
                        <Label>종료일</Label>
                        <Input type="text" value={project.dueDate} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Label>주요 내용</Label>
                    <Input type="textarea" value={project.content} readOnly style={{backgroundColor: '#f0f0f0'}} rows={10}/>
                </FormGroup>
                {project.projectType === true &&
                    <FormGroup>
                        <Label>고객사 요청 내용</Label>
                        <Input type="textarea" value={partner.request || "정보를 입력해주세요"} readOnly
                               style={{backgroundColor: '#f0f0f0'}} rows={10}/>
                    </FormGroup>}
                <div className="d-flex">
                    <FormGroup style={{width: 630}}>
                        <Label className="d-flex align-items-center">진행 상태....
                            <h6 className="mb-0">{project.progress}%</h6>
                            {project.progress < 30 ? (
                                <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                            ) : project.progress < 70 ? (
                                <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                            ) : project.progress < 100 ? (
                                <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                            ) : <span className="p-2 bg-dark rounded-circle d-inline-block ms-3"></span>}
                        </Label>
                        <Input type="text" value={project.status === "PROGRESS" ? "진행중"
                            : project.status === "COMPLETE" ? "완료"
                                : project.status === "RETIRE" ? "폐기" : "오류"} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                    <FormGroup style={{width: 630}}>
                        <Label>Version</Label>
                        <Input type="text" value={project.version} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>
                {project?.projectType === true &&
                    <div className="d-flex">
                        <FormGroup style={{width: 630}}>
                            <Label>고객사 담당자</Label>
                            <Input type="text" value={partner.name ? partner.name : "정보를 입력해주세요"} readOnly
                                   style={{backgroundColor: '#f0f0f0'}}/>
                        </FormGroup>
                        <FormGroup style={{width: 630}}>
                            <Label>담당자 연락처</Label>
                            <Input type="text" value={partner.phone ? partner.phone : "정보를 입력해주세요"} readOnly
                                   style={{backgroundColor: '#f0f0f0'}}/>
                        </FormGroup>
                        <FormGroup style={{width: 630}}>
                            <Label>담당자 이메일</Label>
                            <Input type="email" value={partner.email ? partner.email : "정보를 입력해주세요"} readOnly
                                   style={{backgroundColor: '#f0f0f0'}}/>
                        </FormGroup>
                        <Button onClick={handleClickPartnerDetail}>고객사 정보</Button>
                    </div>}
                {/*<div className="d-flex">
                    <FormGroup className="mr-2" style={{width: 630}}>
                        <Label>등록일</Label>
                        <Input type="text" value={project.regDate} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                    <FormGroup style={{width: 630}}>
                        <Label>수정일</Label>
                        <Input type="text" value={project.updateDate} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>*/}
                <div className="button-group">
                    {isEditable && (
                        <Button color="primary" className={"me-2"} onClick={() => moveToModify(project.pno)}>수정</Button>
                    )}
                    {isEditable && project.projectType === true && (
                        <Button color="primary" className={"me-2"}
                                onClick={() => moveToProjectPartnerUpdate(project.pno)}>고객사 수정</Button>
                    )}
                    <Button color="secondary" className={"me-2"} onClick={() => moveToList()}>목록보기</Button>
                    {isProjectMember && (
                        <Button color="danger" className={"me-2"}
                                onClick={() => moveToProjectIssueList(project.pno)}>이슈관리</Button>
                    )}
                    {isProjectMember && (
                        <Button color="warning" className={"me-2"}
                                onClick={() => moveToProjectMember(pno, isEditable, isProjectMember)}>멤버보기</Button>
                    )}
                    {isProjectMember && (
                        <Button color="warning" className={"me-2"}
                                onClick={() => moveToCalendar(pno, isEditable, isProjectMember)}>일정보기</Button>
                    )}
                    {isProjectMember && (
                        <Button color="warning" className={"me-2"}
                                onClick={() => moveToChatRoom(pno, isProjectMember)}>채팅방</Button>
                    )}
                </div>
            </Form>
            <PartnersReadModal isOpen={pmodal} callbackFn={closeModal} partner={partner.infoPartnersDTO}/>
        </div>
    );

}

export default ReadComponent;