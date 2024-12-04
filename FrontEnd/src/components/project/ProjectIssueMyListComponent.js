import {Badge, Card, CardBody, CardTitle, Table} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";
import {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {createSearchParams, useLocation, useNavigate, useParams} from "react-router-dom";
import {ReactComponent as Orderby} from "../../assets/images/sort.svg";
import {ReactComponent as IsFiles} from "../../assets/images/image.svg";
import React from 'react';
import {getMyList} from "../../api/ProjectIssueApi";
import {statusRead} from "../../api/memberApi";
import FetchingModal from "../projectModal/FetchingModal";

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

const ProjectIssueMyListComponent = () => {
    // mno를 파라미터에서 가져와 사용
    const {mno} = useParams()
    // 멤버 정보
    const [member, setMember] = useState({});
    // fetching
    const [fetching, setFetching] = useState(false);
    // path 경로 설정시 사용
    const navigate = useNavigate();
    // 현재 url값을 파라미터로 사용하기위함
    const location = useLocation();
    // 이동에 관련된 변수들
    const {page, size, moveToProjectIssueList, moveToMyIssueRead} = useProjectMove()
    // API통해 서버에서 불러온 데이터 관리
    const [serverData, setServerData] = useState(initState)
    // 정렬
    const [ascending, setAscending] = useState(true)
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
        navigate(`/project/issue/${mno}?${queryStr}`); // 새로운 쿼리로 url이동
    };

    // mno를 이용해 멤버 정보를 불러와 셋팅
    useEffect(() => {
        // mno가 0일 경우, 아무 작업도 하지 않고 리턴
        if (mno !== "0") {
            statusRead(mno).then(data => {
                setMember(data);
            });
        }
    }, [mno]); // mno 값이 변경될 때마다 실행

    // 쿼리 파라미터 변경시 마다 작동
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page")) || 1;
        const currentSize = parseInt(queryParams.get("size")) || 10;
        let currentSort = queryParams.get("sort") || "ino";
        if (currentSort === "mno" || currentSort === "progress") {
            currentSort = "ino"
        }
        const currentOrder = queryParams.get("order") || "";
        let order;
        if (currentOrder === "asc") {
            order = true;
        } else {
            order = false
        }
        setFetching(true)
        getMyList(mno, {page: currentPage, size: currentSize, sort: currentSort, order: order}).then(data => {
            setServerData(data);
            setFetching(false)
        });
    }, [location.search, mno]);

    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <Card>
                <CardBody>
                    <CardTitle tag="h1" className="d-flex justify-content-between align-items-center">
                        {mno !== "0" ? `${member?.name} 님의 이슈리스트 입니다.` : "공통사항 이슈리스트 입니다."}
                    </CardTitle>

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
                            <tr key={issue.ino} className="border-top" onClick={() => moveToMyIssueRead(issue.ino)}>
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
                                            {issue.newIssue > 0 ? (
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
                           movePage={(pageParam) => moveToProjectIssueList(mno, pageParam)}></PageComponent>
        </div>
    )
}
export default ProjectIssueMyListComponent;