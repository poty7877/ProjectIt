import {Badge, Button, Card, CardBody, CardTitle, Table} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";
import {getOne} from "../../api/ProjectApi";
import {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {createSearchParams, useLocation, useNavigate, useParams} from "react-router-dom";
import {ReactComponent as Orderby} from "../../assets/images/sort.svg";
import {ReactComponent as IsFiles} from "../../assets/images/image.svg";
import React from 'react';
import {getIssueCount, getIssueList, getMcount} from "../../api/ProjectIssueApi";
import {getMemberAlarmCount} from "../../api/ProjectAlarmApi";
import FetchingModal from "../projectModal/FetchingModal";
import {getCookie} from "../../util/cookieUtil";
import {Stomp} from "@stomp/stompjs";

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

const ProjectIssueDetailListComponent = () => {
    // pno를 파라미터에서 가져와 사용
    const {pno} = useParams()
    // path 경로 설정시 사용
    const navigate = useNavigate();
    // project 설정
    const [project, setProject] = useState(null);
    // fetching
    const [fetching, setFetching] = useState(false);
    // 현재 url값을 파라미터로 사용하기위함
    const location = useLocation();
    // 이동에 관련된 변수들
    const {page, size, moveToProjectIssueList, moveToIssueRead} = useProjectMove()
    // API통해 서버에서 불러온 데이터 관리
    const [serverData, setServerData] = useState(initState)
    // 정렬
    const [ascending, setAscending] = useState(true)
    // 담당자 이슈 개수
    const [count, setCount] = useState(0);
    // 공통사항 개수
    const [allCount, setAllCount] = useState(0);
    // All Issue Count
    const [issueCount, setIssueCount] = useState(null);


    // 정렬버튼 클릭시
    const handleClickSort = (sort) => {
        // 현재 queryStr을 기반으로 정렬
        setAscending(!ascending);
        const queryStr = createSearchParams({
            page: page, // 페이지
            size: size, // 사이즈
            sort: sort, // sort는 새로 만들어서 가져옴
            order: ascending ? "desc" : "asc"
        }).toString();
        navigate(`/project/issue/${pno}?${queryStr}`); // 새로운 쿼리로 url이동
    };
    // Add 버튼 클릭
    const handleClickIssueAdd = (pno) => {
        navigate(`/project/issue/add/${pno}`);
    }
    // 멤버 token 가져오기
    const token = getCookie("member");

    // pno값에 따라 Project를 불러옴
    useEffect(() => {
        getOne(pno).then(data => {
            setProject(data)
        })
    }, [pno])

    useEffect(() => {
        getIssueCount(pno).then(data => {
            setIssueCount(data);
        })
    }, []);

    // 쿼리 파라미터 변경시 마다 작동
    useEffect(() => {

        getIssueList(pno, {page: 1, size: 10, sort: "ino", order: false}).then(data => {
            setServerData(data);
            setFetching(false)
        });

    }, [location.search, pno]);

    // 알림 개수 가져오기
    useEffect(() => {
        if (token?.mno) {
            getMemberAlarmCount(token?.mno).then(data => {
                setCount(data);
            })
        }

    }, [token?.mno])

    // 알림 개수 가져오기
    useEffect(() => {
        getMcount(pno).then(data => {
            setAllCount(data)
        })

    }, [])
    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <Card>
                <CardBody>
                    <CardTitle tag="h1" className="d-flex justify-content-between align-items-center">
                        {project ? `${project.title} 의 이슈 리스트 입니다.` : '로딩 중...'}
                        <button className={"btn btn-primary"} onClick={() => handleClickIssueAdd(pno)}>이슈등록</button>
                    </CardTitle>
                    <div>
                        시작일 : {project ? project.startDate : ""}
                    </div>
                    <div>
                        종료일 : {project ? project.dueDate : ""}
                    </div>
                    <div>
                        진행율 : {project ? project.progress : ""}%
                    </div>
                    <div>
                        {project ? project.projectType === false ? "내부 프로젝트" : "외부 프로젝트" : ""}
                    </div>
                    <div>
                        진행상태 : {project ? project.status === "PROGRESS" ? "진행중"
                        : project.status === "COMPLETE" ? "완료"
                            : "폐기" : ""}
                    </div>
                    
                    <div>
                        전체 이슈 개수 : {issueCount} 건
                    </div>


                    <div className="d-flex">
                        {token?.mno &&
                            <Button color="danger"
                                    onClick={() => navigate(`/project/issue/mylist/${token?.mno}`)}>
                                내 이슈 : {count} 건
                            </Button>
                        }
                        <Button color="warning"
                                onClick={() => navigate(`/project/issue/nulllist/${pno}`)}>
                            공통사항 : {allCount} 건
                        </Button>
                    </div>


                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                        <thead style={{cursor: 'pointer'}}>
                        <tr>
                            <th onClick={() => handleClickSort('ino')}>번호<Orderby/></th>
                            <th width={500} onClick={() => handleClickSort('title')}>이슈<Orderby/></th>
                            <th onClick={() => handleClickSort('projectMember')}>담당자<Orderby/></th>
                            <th onClick={() => handleClickSort('status')}>상태<Orderby/></th>
                            <th onClick={() => handleClickSort('priority')}>우선순위<Orderby/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverData.dtoList.map((issue) => (
                            <tr key={issue.ino} className="border-top" onClick={() => moveToIssueRead(issue.ino)}>
                                <td>
                                    <div className="d-flex align-items-center p-2">
                                        <div className="ms-3">
                                            <h6 className="mb-0">{issue.ino}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">
                                            {issue.newIssue === true ? (
                                                <Badge color="danger" pill className="new-badge">
                                                    [new]
                                                </Badge>
                                            ) : ""}
                                            {issue.title} {issue.files === true ? "---" : null} {issue.files === true &&
                                            <IsFiles/>}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{issue.projectMember.name}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">
                                            {issue.status === "REGISTERED" ? "등록됨" :
                                                issue.status === "PROGRESSING" ? "작업중" :
                                                    issue.status === "HOLD" ? "보류" :
                                                        issue.status === "COMPLETED" ? "완료" :
                                                            issue.status === "CANCELED" ? "취소" : "오류발생"}
                                        </h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3 d-flex align-items-center">
                                        <h6 className="mb-0">
                                            {issue.priority === "LOW" ? "낮음" :
                                                issue.priority === "MEDIUM" ? "중간" :
                                                    issue.priority === "HIGH" ? "높음" : "오류발생"}
                                        </h6>
                                        {issue.priority === "LOW" ? (
                                            <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                                        ) : issue.priority === "MEDIUM" ? (
                                            <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                                        ) : issue.priority === "HIGH" ? (
                                            <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                                        ) : <span className="p-2 bg-dark rounded-circle d-inline-block ms-3"></span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
            <PageComponent serverData={serverData}
                           movePage={(pageParam) => moveToProjectIssueList(pno, pageParam)}></PageComponent>
            <div>
                <Button color={"secondary"} onClick={() => navigate(`/project/issue`)}>전체리스트로 이동</Button>
            </div>
        </div>

    )
}
export default ProjectIssueDetailListComponent;