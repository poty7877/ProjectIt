import {Badge, Button, Card, CardBody, CardTitle, Col, Input, Label, Row, Table} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";
import {getMyList} from "../../api/ProjectApi";
import React, {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {createSearchParams, useLocation, useNavigate, useParams} from "react-router-dom";
import {ReactComponent as Orderby} from "../../assets/images/sort.svg";
import FetchingModal from "../projectModal/FetchingModal";
import {getCookie} from "../../util/cookieUtil";
import {getOneMember} from "../../api/ProjectMemberApi";

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
const ProjectMyListComponent = () => {
    // mno를 파라미터에서 가져와 변수로 사용
    const {mno} = useParams();
    // path 연결
    const navigate = useNavigate();
    // url 에서 param값 가져올때 사용
    const location = useLocation();
    // 이동에 관련된 값들
    const {searchText, searchType, page, size, moveToList, moveToRead} = useProjectMove()
    // API 통해 가져온 데이터 관리
    const [serverData, setServerData] = useState(initState)
    // fetching
    const [fetching, setFetching] = useState(false);
    // 정렬값 변수
    const [ascending, setAscending] = useState(true)
    // 검색 타입
    const [searchCondition, setSearchCondition] = useState("title");
    // 검색어
    const [searchQuery, setSearchQuery] = useState("");
    // 작성자
    const [writer, setWriter] = useState([]);
    // 등록 버튼 클릭
    const handleClickAdd = () => {
        if(token?.mno) {
            navigate("/project/add");
        } else {
            alert("로그인 후 이용 가능합니다.")
        }
    }
    // 쿠키에서 token을 가져옴
    const token = getCookie("member");
    // 정렬 버튼 클릭
    const handleClickSort = (sort) => {
        // Create the query string based on the current parameters
        setAscending(!ascending);
        const queryStr = createSearchParams({
            page: page, // Use current page
            size: size, // Use current size
            sort: sort, // Set new sort key
            order: ascending ? "desc" : "asc",
            searchText: searchText,
            searchType: searchType
        }).toString();
        navigate(`/project?${queryStr}`); // Navigate with the new query string
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
            page: page,
            size: size,
            searchText: searchQuery, // 검색어 추가
            searchType: searchCondition
        }).toString();
        navigate(`/project?${queryStr}`);
    };

    // location.search = 즉 url에 search쿼리가 변경될때 마다 실행.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
        const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
        const currentSort = queryParams.get("sort") || "pno"; // 기본값 pno
        const currentOrder = queryParams.get("order") || ""; // 기본값 없음
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";
        let order;
        if (currentOrder === "asc") {
            order = true;
        } else {
            order = false
        }
        // List 메서드 가져와 저장
        setFetching(true);
        getMyList(mno, {
            page: currentPage,
            size: currentSize,
            sort: currentSort,
            order: order,
            searchType: currentSearchType,
            searchText: currentSearchText
        }).then(async data => {
            setServerData(data);
            setFetching(false)

            const namePromises = data.dtoList.map(project =>
                project.pno ? getOneMember(project.mno, project.pno).then(response => response.name) : null
            );
            const names = await Promise.all(namePromises);
            setWriter(names);
        });
    }, [location.search]); // Re-fetch when the query string changes


    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <Card>
                <CardBody>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center mb-3">현재 내가 참여중인 프로젝트
                        <Button color="secondary" outline className="me-2" onClick={() => navigate("/project")}>전체 리스트 보기</Button>
                        <Button color="dark" onClick={handleClickAdd}>새 프로젝트 생성</Button></CardTitle>

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
                                <option value="name">프로젝트 참가자</option>
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
                            <Button color={"primary"} onClick={handleSearch}>
                                검색
                            </Button>
                            <Button color={"secondary"} onClick={() => navigate(`../project`)}>검색조건 초기화</Button>
                        </Col>
                    </Row>
                    <Table className="no-wrap mt-3 align-middle" borderless>
                        <thead style={{cursor: 'pointer'}}>
                        <tr>
                            <th onClick={() => handleClickSort('pno')} style={{width: 15}}>번호<Orderby/></th>
                            <th width={65}>새이슈</th>
                            <th onClick={() => handleClickSort('title')} style={{width: 500}}>제목<Orderby/></th>
                            <th>작성자</th>
                            <th onClick={() => handleClickSort('startDate')}>시작일<Orderby/></th>
                            <th onClick={() => handleClickSort('dueDate')}>마감일<Orderby/></th>
                            <th onClick={() => handleClickSort('status')}>상태<Orderby/></th>
                            <th onClick={() => handleClickSort('progress')}>마감 진행 상태<Orderby/></th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverData.dtoList.map((project,index) => (
                            <tr key={project.pno} className="border-top" onClick={() => moveToRead(project.pno, token?.mno)}>
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
                                            {project.newIssueCount > 0 ? (
                                                <Badge color="danger" pill>
                                                    {project.newIssueCount}
                                                </Badge>
                                            ) : (
                                                <Badge color="secondary" pill>
                                                    {project.newIssueCount}
                                                </Badge>
                                            )}
                                        </h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{project.projectType ? `[고객사] ${project.title}` : project.title}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{writer[index]}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{project.startDate}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{project.dueDate}</h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">
                                            {project.status === "PROGRESS" ? "진행중"
                                                : project.status === "COMPLETE" ? "완료"
                                                    : project.status === "RETIRE" ? "폐기" : "오류"}
                                        </h6>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3 d-flex align-items-center">
                                        {project.progress < 30 ? (
                                            <span className="p-2 bg-success rounded-circle d-inline-block ms-3"></span>
                                        ) : project.progress < 70 ? (
                                            <span className="p-2 bg-warning rounded-circle d-inline-block ms-3"></span>
                                        ) : project.progress < 100 ? (
                                            <span className="p-2 bg-danger rounded-circle d-inline-block ms-3"></span>
                                        ) : <span className="p-2 bg-dark rounded-circle d-inline-block ms-3"></span>}
                                        <h6 className="mb-0">{project.progress}%</h6>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
            <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
        </div>
    )
}
export default ProjectMyListComponent;