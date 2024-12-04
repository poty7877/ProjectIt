import { useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardTitle,  Table } from "reactstrap"
import useDistMove from "../../hooks/useDistMove"
import FetchingModal from "../common/FetchingModal";
import PageComponent from "../common/PageComponent";
import { getListAccount } from "../../api/LicenseApi";

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

const AccountListComponent = () => {
    const {page, size, refresh, moveToAccountList, moveToAccountRegister, moveToAccountRead} = useDistMove();
    const [serverData, setServerData] = useState(initState)
    const [fetching, setFetching] = useState(false) //진행모달

    useEffect(()=>{
        setFetching(true)
        getListAccount({page, size}).then(data =>{
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
                <CardTitle tag="h5"className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">계정 리스트 </CardTitle>
                <CardBody>
                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>경로명</th>
                            <th>접속경로</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {serverData.dtoList.map((dto, index) => (
                            <tr key={dto.siNum} className="border-top" onClick={()=>moveToAccountRead(dto.siNum)}>
                                <td>{dto.siNum}</td>
                                <td>{dto.siteName}</td>
                                <td>{dto.siteUrl}</td>
                                <td>{dto.useState? "사용중": "사용안함"} </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </CardBody>
                <div className="mb-3">
                    <PageComponent serverData={serverData} movePage={moveToAccountList}></PageComponent> </div>
                <CardFooter className="text-center">
                    <Button className="btn " color="primary" onClick={moveToAccountRegister}>계정등록</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
export default AccountListComponent;