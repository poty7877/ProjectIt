import { useEffect, useState } from "react";
import useCustomMove from "../../../hooks/useCustomList";
import useChangeData from "../../../hooks/useChangeData";
import { Button, Card, CardBody, CardTitle, Table, Input, Spinner } from "reactstrap";
import PageComponent from "../../common/PageComponent";
import { list } from "../../../api/applicationAPI";
import AppAddModal from "../Modal/AppAddModal";
import AppOneModal from "../Modal/AppOneModal";

// 기본 설정값
const pageState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { page, size, moveToAppList, refresh } = useCustomMove();
  const [fetching, setFetching] = useState(false);
  const [serverData, setServerData] = useState({ ...pageState });

  // 검색어 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorStyle, setCursorStyle] = useState('default'); // 마우스 커서 상태 관리

  // Debounce를 위한 상태
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // 검색어 입력값 변경 처리
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // 검색어 업데이트
  };

  // 검색어에 딜레이를 주기 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery); // 일정 시간 후에 debouncedSearchQuery 업데이트
    }, 500); // 500ms 후에 업데이트

    // 클린업 함수: 이전의 타이머를 정리해서 불필요한 호출을 방지
    return () => clearTimeout(timer);
  }, [searchQuery]); // searchQuery가 변경될 때마다 useEffect 실행

  // 데이터 요청 함수
  const fetchData = async (searchQuery) => {
    setFetching(true);
    try {
      const data = await list({ page, size, searchQuery });
      console.log("Fetched data: ", data);
      setServerData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setFetching(false);
    }
  };

  // 페이지와 사이즈가 변경될 때마다 데이터 요청
  useEffect(() => {
    fetchData(debouncedSearchQuery || ''); // 검색어가 없으면 기본값으로 빈 문자열 전달
  }, [debouncedSearchQuery, page, size]); // 페이지나 사이즈가 변경될 때마다 호출

  // 검색 버튼 클릭 처리
  const handleSearch = () => {
    fetchData(debouncedSearchQuery);
  };

  // 모달 상태 관리
  const [selectedNo, setSelectedNo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen_register, setIsModalOpen_register] = useState(false);
  const { changeTeamName, changeJoinStatus } = useChangeData();

  const openModal = (no) => {
    if (no) {
      setSelectedNo(no);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNo(null);
    refreshData();
  };

  const openModal_register = () => {
    setIsModalOpen_register(true);
  };

  const closeModal_register = () => {
    setIsModalOpen_register(false);
    refreshData();
  };

  // 데이터를 새로 불러오는 함수
  const refreshData = async () => {
    setFetching(true);
    try {
      const data = await list({ page, size, searchQuery: debouncedSearchQuery });
      console.log("Refreshed data: ", data);
      setServerData(data);
    } catch (error) {
      console.error("Error fetching data while refreshing: ", error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <AppOneModal no={selectedNo} isOpen={isModalOpen} closeModal={closeModal} />
      <AppAddModal isOpen={isModalOpen_register} closeModal={closeModal_register} />
      
      <Card>
        <CardBody>
          <CardTitle tag="h5" className="align-middle">사원 명부</CardTitle>
          
          {/* 검색어 입력 필드 및 버튼 */}
          <div className="d-flex mb-3">
            <Input
              type="text"
              name="search"
              placeholder="이름, 지원부서, 지원결과로 검색"
              value={searchQuery}
              onChange={handleSearchChange}
              className="me-2"
            />
            <Button onClick={handleSearch}>
              검색
            </Button>
          </div>

          {/* 로딩 중일 때 로딩 스피너를 보여줌 */}
          {fetching ? (
            <div className="text-center">
              <Spinner color="primary" /> 로딩 중...
            </div>
          ) : (

          <Table className="no-wrap mt-3" responsive borderless>
            <thead>
              <tr>
                <td className="align-right" colSpan={6}>
                  <span
                    className="ms-3 badge bg-success rounded-pill"
                    type="button"
                    onClick={openModal_register}
                  >
                    입사지원서입력
                  </span>
                </td>
              </tr>
              <tr>
                <th>입사지원번호</th>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>지원부서</th>
                <th>지원결과</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.map((member) => (
                <tr className="border-top" key={member.no}>
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <div className="ms-3">
                        <span
                        style={{ cursor: cursorStyle }} // 커서 스타일을 여기에서 적용                          
                        onMouseEnter={() => setCursorStyle('pointer')} // 마우스를 올리면 포인터로 변경
                        onMouseLeave={() => setCursorStyle('default')} // 마우스를 벗어나면 기본 커서로 복원
                        className="text-muted" onClick={() => openModal(member.no)}>
                          {member.no}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{member.name}</td>
                  <td>{member.mail}</td>
                  <td>{member.phoneNum}</td>
                  <td>{changeTeamName(member.organizationTeam)}</td>
                  <td>{changeJoinStatus(member.joinStatus)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="6">
                  <PageComponent
                    serverData={serverData} 
                    movePage={moveToAppList} 
                    cursorStyle={cursorStyle} 
                    setCursorStyle={setCursorStyle}
                    searchQuery={searchQuery} // 검색어 전달
                  />
                </td>
              </tr>
            </tbody>
          </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ListComponent;
