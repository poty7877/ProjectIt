import { Button, Card, CardBody, CardTitle, Table, Input, Spinner } from "reactstrap";
import { useEffect, useState } from "react";
import { list } from "../../../api/organizationAPI";
import OrgOneModal from "../Modal/OrgOneModal";
import useCustomMove from "../../../hooks/useCustomList";
import PageComponent from "../../common/PageComponent";
import useChangeData from "../../../hooks/useChangeData";
import debounce from "lodash.debounce";
import OrgAddModal from "../Modal/OrgAddModal";

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

const OrgListComponent = () => {
  const { page, size, moveToList, refresh } = useCustomMove();
  const [fetching, setFetching] = useState(false);
  const [serverData, setServerData] = useState({ ...pageState });
  const [selectedMno, setSelectedMno] = useState(null); // 선택된 사원 번호 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const { changeTeamName, changeRoleName } = useChangeData();
  const [searchQuery, setSearchQuery] = useState("");
  const [cursorStyle, setCursorStyle] = useState('default'); // 마우스 커서 상태 관리
  const [selectedNo, setSelectedNo] = useState(null);
  const [isModalOpen_register, setIsModalOpen_register] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');


  // 서버 데이터 fetch
  const fetchData = debounce(() => {
    setFetching(true);
    list({ page, size, searchQuery })
      .then((data) => {
        setServerData(data);
        
      })
      .catch((error) => {
        console.error("Error fetching data : ", error);
        
      })
      .finally(()=>{
        setFetching(false);
      });
  }, 500); // 500ms 후에 데이터 요청

  useEffect(() => {
    fetchData(); // 검색어가 바뀔 때마다 서버 요청
  }, [searchQuery, page, size, refresh]);

  // 검색어 입력값 변경 처리
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim()); // 검색어 업데이트
  };

  // 검색 버튼 클릭 처리
  const handleSearch = () => {
    setFetching(true);
    // 페이지를 0으로 설정하여 첫 번째 페이지부터 결과를 가져옵니다.
    list({ page: 0, size, searchQuery })
      .then((data) => {
        setServerData(data);       
      })
      .catch((error) => {
        console.error("Error during search: ", error);        
      })
      .finally(()=> {
        setFetching(false);
      });
  };


  const openModal_register = () => {
    console.log("openModalRegister");
    setIsModalOpen_register(true);
  };

  const closeModal_register = () => {
    setIsModalOpen_register(false);
    refreshData();
  };


  // 1인 선택 시의 모달
  const openModal = (mno) => {
    if (mno) {
      setSelectedMno(mno); // 선택된 mno 상태 저장
      setIsModalOpen(true); // 모달 열기
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
    setSelectedMno(null); // 선택된 mno 초기화
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
      <OrgAddModal isOpen={isModalOpen_register} closeModal={closeModal_register} />
      <OrgOneModal mno={selectedMno} isOpen={isModalOpen} closeModal={closeModal} />

      <Card>
        <CardBody>
          <div style={{display: "flex", justifyContent: "space-between"}}>
          <CardTitle tag="h5" className="align-middle"> 사원 명부 </CardTitle>          
          {/* 검색어 입력 필드 및 버튼 */}
          <Button color="primary" onClick={openModal_register}> 사원 추가 </Button>
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginTop:"10px"}}>
            <Input
              type="text"
              name="search"
              placeholder="이름, 직위, 부서로 검색"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {/* 로딩 중일 때 로딩 스피너를 보여줌 */}
          {fetching ? (
            <div className="text-center">
              <Spinner color="primary" /> 로딩 중...
            </div>
          ) : (

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th> 사원번호 </th>
                <th> 이 름 </th>
                <th> 직 위 </th>
                <th> 부 서 </th>
                <th> 입사일 </th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.map((member) => (
                <tr className="border-top" key={member.mno}>
                  <td>
                    <div className="d-flex align-items-center p-2">
                      <div className="ms-3">
                        <span
                          onClick={() => openModal(member.mno)}
                          style={{ cursor: cursorStyle }} // 커서 스타일을 여기에서 적용                          
                          onMouseEnter={() => setCursorStyle('pointer')} // 마우스를 올리면 포인터로 변경
                          onMouseLeave={() => setCursorStyle('default')} // 마우스를 벗어나면 기본 커서로 복원
                        >
                          {member.mno}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{member.name}</td>
                  <td>{changeRoleName(member.memberRole)}</td>
                  <td>{changeTeamName(member.team)} {member.teamName}</td>
                  <td>{member.start_date}</td>
                </tr>                
              ))}
              <tr>
                <td colSpan={'5'}>
                  <PageComponent 
                    serverData={serverData} 
                    movePage={moveToList} // movePage를 moveToAppList로 수정
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

export default OrgListComponent;
