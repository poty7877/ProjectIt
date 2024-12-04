
import { useEffect, useState } from "react"
import { Button, Card, CardBody, CardTitle,  Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import { getListInfo } from "../../api/LicenseApi";
import { useLocation } from "react-router-dom";

const initState = { //PageResponseDTO
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


const infoModalInitState = {//InfoLicenseDTO --관련 라이선스 불러오기
    lno: 0,
    rightName: '',
    price: 0,
    priceUnit: 'YEAR',
    maxUserCount: 0,
}


function LicenseInfoModal({ isOpen, callbackFn}) {

    const [serverData, setServerData] = useState({ ...initState }); //리스트 데이터 받기
    const [fetching, setFetching] = useState(false); //진행모달
    const [selectInfo, setSelectInfo] = useState({...infoModalInitState});// 결과값 세팅
   //페이징용
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get("page"))||1;
    const currentSize = parseInt(queryParams.get("size"))||10;


    useEffect(() => {
        setFetching(true)
        getListInfo({ page:currentPage, size:currentSize }).then(data => {
           // console.log(data);
            setServerData(data);
            
         //console.log(serverData);    
        })
        setFetching(false);
    }, [setServerData])

    //선택시 객체에 값 세팅
    const handleSave = (e) => {
        const selectTr = e.target.value;  //버튼에서 보내준 값(index)
        const infoDto = serverData.dtoList[selectTr]; 
        
        selectInfo["lno"] = infoDto.lno;
        selectInfo["rightName"] = infoDto.rightName;
        selectInfo["price"] = infoDto.price;
        selectInfo["priceUnit"] = infoDto.priceUnit;
        selectInfo["maxUserCount"] = infoDto.maxUserCount;
       setSelectInfo({...selectInfo});
       console.log(selectInfo);
       callbackFn({selectInfo}); //모달 닫기-값전달
    }
    const handleClose = (e) => { //선택없이 그냥 닫기
        e.preventDefault();
        selectInfo["lno"] = 0;
        setSelectInfo(selectInfo);
        callbackFn({selectInfo});
    }

    const moveToModalList = (pageParam) => {
        // 기존의 쿼리 파라미터 값 유지
        const currentPage = queryParams.get("page") || 1;
        const currentSize = queryParams.get("size") || 10;

        // pageParam이 있을 때만 페이지 변경
        const pageNum = pageParam?.page || currentPage;
        const sizeNum = pageParam?.size || currentSize;

        //페이지 data 업데이트
        setFetching(true);
        getListInfo({ page:pageNum, size:sizeNum }).then(data => {
             console.log(data);
             setServerData(data);
             setFetching(false);
         });
    }


    return (
        <Modal isOpen={isOpen} toggle={()=>callbackFn({selectInfo})} size="lg" >
            <ModalHeader toggle={()=>callbackFn({selectInfo})}>INFO LIST</ModalHeader>
            <ModalBody>
                <div>
                    {fetching? <FetchingModal></FetchingModal>:<></>}
                    <Card>
                        <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">라이선스 상품 리스트</CardTitle>
                        <CardBody>
                            <Table className="no-wrap mt-3 align-middle" responsive borderless>
                                <thead>
                                    <tr>
                                        <th>상품명</th>
                                        <th>버전</th>
                                        <th>사용처</th>
                                        <th>저작권자</th>
                                        <th>금액/단위</th>
                                        <th>선택</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serverData.dtoList.map((infoDto, index) => (
                                        <tr key={index} className="border-top" aria-readonly>
                                            <td>{infoDto.rightName}</td>
                                            <td>{infoDto.version}</td>
                                            <td>{infoDto.purpose} </td>
                                            <td>{infoDto.copyrightHolder}</td>
                                            <td>{infoDto.price}/{infoDto.priceUnit}</td>
                                            <td><Button className="btn-sm" color="info" onClick={handleSave} value={index}>선택</Button></td>
                                        </tr>
                                    ))}
                                </tbody>                             
                            </Table>
                        </CardBody>
                        <div className="mb-3">
                            <PageComponent serverData={serverData} movePage={moveToModalList}></PageComponent> </div>
                    </Card>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={handleClose}>닫기</Button>
            </ModalFooter>
        </Modal>
    );
}

export default LicenseInfoModal;