import {Badge, Button, Card, CardBody, CardTitle, Col, Input, Label, Row, Table} from "reactstrap";
import React, {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import {ReactComponent as Orderby} from "../../assets/images/sort.svg";
import {getApprovedList, getList, getRejectedList} from "../../api/DocumentApi";
import useDocumentMove from "../../hooks/useDocumentMove";
import {statusRead} from "../../api/memberApi";
import FetchingModal from "../projectModal/FetchingModal";
import {getCookie} from "../../util/cookieUtil";
import {getDocumentApproverCount, getDocumentWriterCount} from "../../api/DocumentAlarmApi";


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
const DocumentApprovedListComponent = () => {
    const VISIBILITY_KOR = {
        PUBLIC: "공개",
        PRIVATE: "비공개",
    }

    // path 연결
    const navigate = useNavigate();

    // url 에서 param값 가져올때 사용
    const location = useLocation();

    // 이동에 관련된 값들
    const {searchText, searchType, page, size, moveToApprovedList, moveToRead, moveToAdd} = useDocumentMove()

    // API 통해 가져온 데이터 관리
    const [serverData, setServerData] = useState(initState)

    // 정렬값 변수
    const [ascending, setAscending] = useState(true)

    // 결재자 세팅
    const [approver, setApprover] = useState([]);

    // fetching
    const [fetching, setFetching] = useState(false)

    // 새문서 개수
    const [approverCount, setApproverCount] = useState(null);

    // 새완료 문서 개수
    const [writerCount, setWriterCount] = useState(null);

    // 로그인한 사람의 정보
    const [loginMember, setLoginMember] = useState({});
    const token = getCookie("member");
    console.log(token);


    const [searchCondition, setSearchCondition] = useState("title"); // Default search condition (e.g., title)

    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력값 상태 추가

    useEffect(() => {
        if (token?.mno) {
            getDocumentApproverCount(token.mno).then(data => {
                setApproverCount(data)
            })
            statusRead(token.mno).then(data => {
                setLoginMember(data)
            })
        }

    }, [])

    useEffect(() => {
        getDocumentWriterCount(loginMember.name).then(data => {
            setWriterCount(data)
        })
    }, [loginMember.name])


    // 정렬 버튼 클릭
    const handleClickSort = (sort) => {
        // Create the query string based on the current parameters
        setAscending(!ascending);
        setFetching(true)
        const queryStr = createSearchParams({
            page: page, // Use current page
            size: size, // Use current size
            sort: sort, // Set new sort key
            order: ascending ? "desc" : "asc", searchText: searchText, searchType: searchType
        }).toString();
        navigate(`/document/approved/list?${queryStr}`); // Navigate with the new query string
        setFetching(false)
    };

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
        navigate(`/document/approved/list?${queryStr}`);
    };


    // location.search = 즉 url에 search쿼리가 변경될때 마다 실행.
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const currentPage = parseInt(queryParams.get("page")) || 1; // 기본값 1
        const currentSize = parseInt(queryParams.get("size")) || 10; // 기본값 10
        const currentSort = queryParams.get("sort") || "dno"; // 기본값 pno
        const currentOrder = queryParams.get("order") || ""; // 기본값 없음
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";
        console.log(currentOrder);
        let order;
        if (currentOrder === "asc") {
            order = true;
        } else {
            order = false
        }
        console.log(order);
        // List 메서드 가져와 저장
        setFetching(true)
        getApprovedList({
            page: currentPage,
            size: currentSize,
            sort: currentSort,
            order: order,
            searchType: currentSearchType,
            searchText: currentSearchText
        }).then(data => {
            setServerData(data);
            console.log(data);

        });
        setFetching(false)
    }, [location.search]); // Re-fetch when the query string changes
    useEffect(() => {
        const socket = new WebSocket('ws://mbc-webcloud.iptime.org:8103/ws/alarms');

        socket.onopen = () => {
            console.log('웹소켓 오픈!');
        };

        socket.onmessage = (event) => {
            console.log('웹소켓 메시지:', event.data); // 로그 출력
            const alarmData = JSON.parse(event.data); // JSON 형태로 수신된 데이터를 파싱
            const approverAlarmCount = alarmData.approverAlarm;
            const writerAlarmCount = alarmData.writerAlarm;
            if (approverAlarmCount > 0) {
                setApproverCount(approverAlarmCount); // 수신한 데이터를 상태로 설정
            }
            if (writerAlarmCount > 0) {
                setWriterCount(writerAlarmCount);
            }

        };

        socket.onerror = (error) => {
            console.error('웹소켓 에러:', error);
        };

    }, []);


    return (<div>
        <>
            <FetchingModal isOpen={fetching}/>
            {/* serverData와 approver를 사용하는 UI */}
        </>
        <Card>
            <CardBody>
                <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">결재 완료된 문서
                    <Button color="primary" onClick={() => moveToAdd(token?.mno)}>문서 작성</Button>
                </CardTitle>
                <div className="d-flex mb-3">
                    <Button color="secondary" className="me-2"
                            onClick={() => navigate("/document/requested/list")}>대기중</Button>
                    <Button color="success" className="me-2"
                            onClick={() => navigate("/document/approved/list")}>완료</Button>
                    <Button color="danger" onClick={() => navigate("/document/rejected/list")}>반려</Button>
                </div>
                <div style={{marginBottom: '20px'}}></div>
                {token?.mno &&
                    <div className="d-flex mb-3">

                        <Button color="warning" className="me-2"
                                onClick={() => navigate(`/document/approver/list/${token.mno}`)}>
                            내가 결재해야 할 문서 : {approverCount}건
                        </Button>
                        <Button color="warning"
                                onClick={() => navigate(`/document/writer/list/${loginMember.name}`)}>
                            내가 요청한 문서 (결재완료) : {writerCount}건
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
                            <option value="description">내용</option>
                            <option value="writer">작성자</option>
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
                        <Button color="primary" className="me-2" onClick={handleSearch}>
                            검색
                        </Button>
                        <Button color="warning" onClick={() => navigate(`../document/approved/list`)}>검색조건 초기화</Button>
                    </Col>
                </Row>
                <Table className="no-wrap mt-3 align-middle" borderless>
                    <thead style={{cursor: 'pointer'}}>
                    <tr>
                        <th onClick={() => handleClickSort('dno')} style={{width: 15}}>번호<Orderby/></th>
                        <th onClick={() => handleClickSort('title')} style={{width: 500}}>제목<Orderby/></th>
                        <th onClick={() => handleClickSort('writer')}>작성자<Orderby/></th>
                        <th onClick={() => handleClickSort('mno')}>결재자<Orderby/></th>
                        <th onClick={() => handleClickSort('visibility')}>공개여부<Orderby/></th>
                        <th onClick={() => handleClickSort('approved')}>결재 상태<Orderby/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {serverData.dtoList.map((document, index) => (
                        <tr key={document.dno} className="border-top"
                            onClick={() => moveToRead(document.dno, token?.mno)}>
                            <td>
                                <div className="d-flex align-items-center p-2">
                                    <div className="ms-3">
                                        <h6 className="mb-0">{document.dno}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="ms-3">
                                    <h6 className="mb-0">{document.title}</h6>
                                </div>
                            </td>
                            <td>
                                <div className="ms-3">
                                    <h6 className="mb-0">{document.writer}</h6>
                                </div>
                            </td>
                            <td>
                                <div className="ms-3">
                                    <h6 className="mb-0">{document.approver}</h6>
                                </div>
                            </td>
                            <td>
                                <div className="ms-3">
                                    <h6 className="mb-0">{VISIBILITY_KOR[document.visibility]}</h6>
                                </div>
                            </td>
                            <td>
                                <div className="ms-3">
                                    <h6 className="mb-0">
                                        {document.approved === "REQUESTED" ? "결재 요청" : document.approved === "APPROVED" ? "결재 완료" : document.approved === "REJECTED" ? "반려" : ""}
                                    </h6>
                                </div>
                            </td>
                        </tr>))}
                    </tbody>
                </Table>

            </CardBody>
        </Card>
        <PageComponent serverData={serverData} movePage={moveToApprovedList}></PageComponent>
    </div>)
}
export default DocumentApprovedListComponent;