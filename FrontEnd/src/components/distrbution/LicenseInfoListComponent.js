import { useEffect, useState } from "react"
import { getListInfo } from "../../api/LicenseApi"
import { Button, Card, CardBody, CardFooter, CardTitle, Table } from "reactstrap"
import useDistMove from "../../hooks/useDistMove"
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";

const initState={ //PageResponseDTO
    dtoList:[],
    pageNumList:[],
    pageRequestDTO:null,
    prev:false, 
    next:false,
    totalCount: 0, 
    prevPage:0, 
    nextPage:0, 
    totalPage:0, 
    current:0
}

const LicenseInfoListComponent = () => {
    const {page, size, refresh, moveToRegister, moveToInfoList, moveToRead, moveToRequest} = useDistMove();
    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false) //진행모달
    //const {exceptionHandle} = useCustomLogin()
    useEffect(()=>{
        setFetching(true)
        getListInfo({page, size}).then(data =>{
            console.log(data)
            setServerData(data)
            setFetching(false)
        })
        //.catch(err=> exceptionHandle(err))
    },[page, size, refresh])
    
    return(
        <div>
          {fetching? <FetchingModal/>:<></>}
        <Card>
        <CardTitle tag="h5"className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">라이선스 상품 리스트         
            <span className="text-end">
            <Button className="btn " color="primary" onClick={()=>moveToRegister()}>새상품 등록</Button></span></CardTitle>  
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
                  <tr key={infoDto.lno} className="border-top" onClick={()=>moveToRead(infoDto.lno)}>
                    <td>{infoDto.rightName}</td>
                    <td>{infoDto.version}</td>
                    <td>{infoDto.purpose} </td>
                    <td>{infoDto.copyrightHolder}</td>
                    <td>{infoDto.totalPrice}/{infoDto.priceUnit}</td>
                    <td>{infoDto.expireDate}</td>
                    <td><Button className="btn-sm" color="info" value={infoDto.lno}>선택</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
          <div className="mb-3">
          <PageComponent serverData={serverData} movePage={moveToInfoList}></PageComponent> </div>
          <CardFooter className="text-center">
            <Button className="btn " color="primary" onClick={()=>moveToRequest()}>사용요청</Button>
          </CardFooter>
        </Card>
      </div>
    );
}
export default LicenseInfoListComponent;
