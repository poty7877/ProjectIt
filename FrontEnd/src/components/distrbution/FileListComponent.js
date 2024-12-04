import { useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardTitle, Input, Table } from "reactstrap"
import useDistMove from "../../hooks/useDistMove"
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import { getFileAllList } from "../../api/DistApi";

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
const FileListComponent = () => {
    const {page, size, refresh, moveToFileList} = useDistMove();
    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false) //진행모달

    useEffect(()=>{
        setFetching(true)
        getFileAllList({page, size}).then(data =>{
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
      <CardTitle tag="h5"className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">첨부파일 리스트 </CardTitle>  
        <CardBody>   
          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
              <th>선택</th>
              <th>#</th>
                <th>카테고리</th>
                <th>파일명</th>  
                <th>용량</th>
                <th>상태</th>
                <th>저장경로</th>
              </tr>
            </thead>
            <tbody>
              {serverData.dtoList.map((fileDto, index) => (           
                <tr key={fileDto.fno} className="border-top"> 
                <td><Input type="checkbox" name="fno"/></td>
                <td>{fileDto.fno}</td>
                <td>{fileDto.category}</td>               
                  <td>{fileDto.originFileName}</td>
                  <td>{fileDto.size} byte</td>
                  <td>{fileDto.deleteOrNot? (<Button className="btn-sm" color="secondary">복원</Button>):"사용중"} </td>
                  <td>{fileDto.folderPath}</td>
                </tr> 
              ))}
            </tbody>
          </Table>
        </CardBody>
        <div className="mb-3">
        <PageComponent serverData={serverData} movePage={moveToFileList}></PageComponent> </div>
        <CardFooter className="text-center">
         
        </CardFooter>
      </Card>
    </div>
    );
}
export default FileListComponent;