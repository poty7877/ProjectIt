import {Card, CardBody, CardTitle, Table} from "reactstrap";
import useCustomMove from "../../hooks/useProjectMove";
import {deleteForeverOne, getDeleteList} from "../../api/ProjectApi";
import React, {useEffect, useState} from "react";
import PageComponent from "../projectModal/PageComponent";

import ResultModal from "../projectModal/ResultModal";

const initState = { // PageResponseDTO 기본값 초기화 !!
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
const DeletedListComponent = () => {
    // 이동관련 메서드
    const {page, size, refresh, moveToDeletedList, moveToRead} = useCustomMove()
    // pno값 세팅
    const [pno, setPno] = useState([]);
    // 결과 모달
    const [result, setResult] = useState(null);
    // 데이터 셋팅
    const [serverData, setServerData] = useState(initState)
    // 삭제된 리스트 가져옴
    useEffect(() => {
        getDeleteList({page, size}).then(data => { // data가져오면
            setServerData(data) // serverData에 삽입
        })
    }, [page, size, refresh])
    // 프로젝트 선택
    const selectProject = (pno) => {
        setPno(selected => {
            // 선택된 프로젝트에 pno가 이미 포함이 되어있으면
            if (selected.includes(pno)) {
                // 체크박스 해제
                return selected.filter(item => item !== pno);
            } else {
                // 아니면 추가
                return [...selected, pno];
            }
        })
    }
    // 삭제 버튼 클릭시
    const handleClickDelete = () => {
        // 선택된 프로젝트가 있으면
        if (pno.length > 0) {
            // alert창에서 확인 눌러야 작동
            if (window.confirm("삭제후 복원 불가능 합니다. 정말 삭제 하시겠습니까?")) {
                pno.map(pno => {
                    // pno가 여러개일수있으니, map이용해서 한번씩 작동
                    deleteForeverOne(pno).then(data => {
                        setResult(data);
                        setPno([])
                    });
                })
            }
            // 선택된 프로젝트 없으면
        } else {
            alert("삭제할 프로젝트를 선택하세요");
        }
    }
    // 모달창 닫기 클릭시
    const closeModal = () => {
        setResult(null)
        // 즉시 리스트 업데이트 해주기 위함.
        getDeleteList({page, size}).then(data => {
            setServerData(data); // 데이터 업데이트
            console.log("서버 데이터 업데이트 완료"); // 확인용 로그
        });
    }
    return (
        <div>
            {/*결과가 있으면서, 결과값이 DELETE FOREVER일때,*/}
            <ResultModal
                isOpen={result === "DELETE FOREVER"}
                content={result === "DELETE FOREVER"
                    ? "프로젝트 영구삭제가 완료되었습니다.."
                    // 결과값이 다를때
                    : "오류 발생"
                }
                callbackFn={closeModal}
            />
            <Card>
                <CardBody>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center">프로젝트 리스트
                    </CardTitle>
                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                        <thead>
                        <tr>
                            <th>선택</th>
                            <th>번호</th>
                            <th>제목</th>
                            <th>시작일</th>
                            <th>마감일</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*리스트로 받아온 데이터에서 하나씩 분리.*/}
                        {serverData.dtoList.map((project, index) => (
                            // div, 즉 프로젝트 칸 하나 클릭시 조회 페이지로 이동
                            <tr key={project.pno} className="border-top" onClick={() => moveToRead(project.pno)}>
                                <td>
                                    <div className={"ms-3"}>
                                        <input type={"checkbox"}
                                               style={{transform: "scale(3.5)"}}
                                               // 체크박스 클릭시 pno배열에 집어넣음. 삭제 위해
                                               checked={pno.includes(project.pno)}
                                               onChange={(e) => {
                                                   e.stopPropagation();
                                                   selectProject(project.pno);
                                               }}
                                               // 체크 박스 클릭시 위 조회메서드로 이동하는경우 방지.
                                               onClick={(e) => e.stopPropagation()}
                                        ></input>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center p-2">
                                        <div className="ms-3">
                                            <h6 className="mb-0">{index}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <h6 className="mb-0">{project.title}</h6>
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

                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
                <button className={"btn btn-primary"} onClick={handleClickDelete}>선택 삭제</button>
            </Card>
            <PageComponent serverData={serverData} movePage={moveToDeletedList}></PageComponent>
        </div>
    )
}
export default DeletedListComponent;