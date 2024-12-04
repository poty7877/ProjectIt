import { useEffect, useState } from "react"
import { getListAsset } from "../../api/LicenseApi"
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


const LicenseAssetListComponent = () => {
    const {page, size, refresh, moveToRegister, moveToList,  moveToRequest, moveToRead} = useDistMove();
    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false) //진행모달
    //const {exceptionHandle} = useCustomLogin()
    useEffect(()=>{
        setFetching(true)
        getListAsset({page, size}).then(data =>{
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
        <CardTitle tag="h5"className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">라이선스 리스트         
            <span className="text-end">
            <Button className="btn " color="primary" onClick={()=>moveToRegister()}>새상품 등록</Button></span></CardTitle>  
          <CardBody>   
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
              <thead>
                <tr>
                <th>#</th>
                  <th>구분</th>
                  <th>상품명</th>  
                  <th>사용처</th>
                  <th>사용중/사용가능 개수</th>
                  <th>만료일</th>
                </tr>
              </thead>
              <tbody>
                {serverData.dtoList.map((assetDto, index) => (           
                  <tr key={assetDto.ano} className="border-top" onClick={()=>moveToRead(assetDto.ano)}> 
                  <td>{assetDto.ano}</td>
                    <td>{assetDto.rightType}</td>
                    <td>{assetDto.rightName} {assetDto.fileCount > 0? <span className="badge bg-primary rounded-pill">{assetDto.fileCount}</span>:<></>}</td>
                    <td>{assetDto.usePurpose}</td>
                    <td>{assetDto.currentUseCount} / {assetDto.totalUseCount}</td>
                    <td>{assetDto.expireDate}</td>
                  </tr> 
                ))}
              </tbody>
            </Table>
          </CardBody>
          <div className="mb-3">
          <PageComponent serverData={serverData} movePage={moveToList}></PageComponent> </div>
          <CardFooter className="text-center">
            <Button className="btn " color="primary" onClick={()=>moveToRequest()}>라이선스 계약 등록</Button>
          </CardFooter>
        </Card>
      </div>
    );
}
export default LicenseAssetListComponent;
