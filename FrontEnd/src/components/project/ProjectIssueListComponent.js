import {Badge, Button, Card, CardBody, CardTitle, Col, Input, Label, Row, Table} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";

import {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as Orderby} from "../../assets/images/sort.svg";
import React from 'react';
import FetchingModal from "../projectModal/FetchingModal";
import {getIssueCount, getList} from "../../api/ProjectIssueApi";
import {getCookie} from "../../util/cookieUtil";
import {getAllProjectCount} from "../../api/ProjectAlarmApi";


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
const ProjectIssueListComponent = () => {
    // 이동관련
    const navigate = useNavigate();
    // 파라미터 url 가져다 사용
    const location = useLocation();
    // 이동관련 메서드
    const {searchText, searchType, page, size, moveToIssueList, moveToProjectIssueList} = useProjectMove()
    // api로 불러온 데이터
    const [serverData, setServerData] = useState(initState)
    // 정렬 방식
    const [ascending, setAscending] = useState(true)
    // fetching
    const [fetching, setFetching] = useState(false);
    // 알림 개수
    const [count, setCount] = useState(0);
    // 검색 타입
    const [searchCondition, setSearchCondition] = useState("title");
    // 검색어
    const [searchQuery, setSearchQuery] = useState("");
    // token 값
    const token = getCookie("member")
    // total issue count
    const [allIssue, setAllIssue] = useState(null);

    // 정렬 버튼 클릭
    const handleClickSort = (sort) => {
        setAscending(!ascending);
        const queryStr = createSearchParams({
            page: page,
            size: size,
            sort: sort,
            order: ascending ? "desc" : "asc",
            searchText: searchText,
            searchType: searchType
        }).toString();
        navigate(`/project/issue?${queryStr}`);
    };
    // 검색 타입 변경시
    const handleSearchConditionChange = (e) => {
        setSearchCondition(e.target.value);
    };
    // 검색값 변경 시 상태 업데이트
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };
    // 검색 버튼 클릭 시 검색 쿼리 파라미터로 검색
    const handleSearch = () => {
        const queryStr = createSearchParams({
            page: page, size: size, searchText: searchQuery, // 검색어 추가
            searchType: searchCondition
        }).toString();
        navigate(`/project/issue?${queryStr}`);
    };

    // search쿼리 변경시마다 작동
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page")) || 1;
        const currentSize = parseInt(queryParams.get("size")) || 10;
        const currentSort = queryParams.get("sort") || "pno";
        const currentOrder = queryParams.get("order") || "";
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";
        let order;
        if (currentOrder === "asc") {
            order = true;
        } else {
            order = false
        }
        setFetching(true)
        getList({
            page: currentPage,
            size: currentSize,
            sort: currentSort,
            order: order,
            searchType: currentSearchType,
            searchText: currentSearchText
        }).then(data => {
            setServerData(data);
            setFetching(false)

        });
    }, [location.search]);

    // 전체 이슈 개수 가져오기
    useEffect(() => {
        getAllProjectCount().then(data => {
            setCount(data);
        })
    })


    // 로그인 안하고 조회시
    useEffect(() => {
        if (!token?.mno) {
            alert("로그인 후 이용 가능한 기능입니다.");
            // 이전 페이지로 이동
            const previousPage = location.state?.from || "/project";
            navigate(previousPage);
        }
    }, [token, navigate, location]);

    return (<div>
        <>
            <FetchingModal isOpen={fetching}/>
            {/* serverData와 approver를 사용하는 UI */}
        </>
        <Card>
            <CardBody>
                <CardTitle tag="h1" className="d-flex justify-content-between align-items-center"
                           style={{color: "red"}}>프로젝트 이슈 게시판
                </CardTitle>
                <h6>프로젝트 별 이슈관리 하는 게시판 입니다.</h6>
                {token?.mno &&
                    <div className="d-flex mb-3">
                        <Button color="danger" className="me-2"
                        >
                            새로운 이슈 : {count} 건
                        </Button>
                    </div>
                }
                <Row className="mb-3">
                    <Col sm="3">
                        <Label for="searchCondition">검색 조건</Label>
                        <Input
                            type="select"
                            id="searchCondition"
                            value={searchCondition}
                            onChange={handleSearchConditionChange}
                        >
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="name">작성자</option>
                        </Input>
                    </Col>
                    <Col sm="6">
                        <Label for="searchInput">검색어</Label>
                        <Input
                            type="text"
                            id="searchInput"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="검색어 입력"
                            required={true}
                        />
                    </Col>
                    <Col sm="3" className="d-flex align-items-end">
                        <Button color="primary" onClick={handleSearch}>
                            검색
                        </Button>
                        <Button color="warning" onClick={() => navigate(`../project/issue`)}>검색조건 초기화</Button>
                    </Col>
                </Row>
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                    <tr>
                        <th width={15} onClick={() => handleClickSort('pno')}>번호<Orderby
                            style={{cursor: 'pointer'}}/></th>
                        <th width={65}>새이슈</th>
                        <th width={500}>프로젝트 이름</th>
                        <th onClick={() => handleClickSort('progress')}>진행율<Orderby style={{cursor: 'pointer'}}/>
                        </th>
                        <th onClick={() => handleClickSort('status')}>상태<Orderby style={{cursor: 'pointer'}}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {serverData.dtoList.map((project) => (<tr key={project.pno} className="border-top"
                                                              onClick={() => moveToProjectIssueList(project.pno)}>
                        <td>
                            <div className="d-flex align-items-center p-2">
                                <div className="ms-3">
                                    <h6 className="mb-0">{project.pno}</h6>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="ms-3">
                                <h6 className="mb-0">
                                    {project.newIssueCount > 0 ? (<Badge color="danger" pill>
                                        {project.newIssueCount}
                                    </Badge>) : (<Badge color="secondary" pill>
                                        {project.newIssueCount}
                                    </Badge>)}
                                </h6>
                            </div>
                        </td>
                        <td>
                            <div className="ms-3">
                                <h6 className="mb-0">{project.projectType ? `[고객사] ${project.title}` : project.title}</h6>
                                <small className="text-muted">전체 이슈 개수: {project.issueCount}</small>
                            </div>
                        </td>
                        <td>
                            <div className="ms-3 d-flex align-items-center">
                                {project.progress < 30 ? (<span
                                    className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>) : project.progress < 70 ? (
                                    <span
                                        className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>) : project.progress < 100 ? (
                                        <span
                                            className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>) :
                                    <span className="p-2 bg-dark rounded-circle d-inline-block ms-3"></span>}
                                <h6 className="mb-0">{project.progress}%</h6>
                            </div>
                        </td>
                        <td>
                            <div className="ms-3">
                                <h6 className="mb-0">
                                    {project.status === "PROGRESS" ? "진행중" : project.status === "COMPLETE" ? "완료" : project.status === "RETIRE" ? "폐기" : "오류"}
                                </h6>
                            </div>
                        </td>
                    </tr>))}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
        <PageComponent serverData={serverData} movePage={moveToIssueList}></PageComponent>
    </div>)
}
export default ProjectIssueListComponent;