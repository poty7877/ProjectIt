import { useEffect, useState } from "react";
import { cancleAsset, delForeverAsset, getOneAsset } from "../../api/LicenseApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, InputGroup, Label } from "reactstrap";
import { format } from "date-fns";
import useDistMove from "../../hooks/useDistMove";
import FileComponent from "./common/FileComponent";

const currentDate = format(new Date(), 'yyyy-MM-dd'); //현재시간
const initState = {//AssetLicenseOneDTO
    ano: 0,
    rightName: '',
    rightType: '',
    usePurpose: '',
    contractStatus: '',
    contractDate: currentDate,
    expireDate: currentDate,
    contractCount: 0,
    comment: '',
    expireYN: false,
    price: 0,
    totalPrice: 0,
    priceUnit: '',
    maxUserCount: 0,
    totalUseCount: 0,
    currentUseCount: 0,
    licenseId: 0,
    savedFiles: [],
    fileCount: 0,
    contact: ''

}



const LicenseAssetViewComponent = ({ ano }) => {
   // console.log("받은ano : " + ano);
    const [assetDto, setAssetDto] = useState({ ...initState }); //server 전송데이터 관리
    const [fetching, setFetching] = useState(false); //로딩 모달
    const [result, setResult] = useState(null); //cancle 결과 모달
    const { moveToList, moveToReContract } = useDistMove(); //이동함수


    useEffect(() => {
        setFetching(true);
        getOneAsset(ano).then(data => {
            setAssetDto(data);
           // console.log("data 전송완료:" + data.fileCount);
            setFetching(false);
        });
    }, [ano]);

    //버튼클릭 : 재계약/연장계약
    const handleClickReContract = (e) => {
        e.preventDefault();
        //info 값만 만들어 객체(json) 보내기
        const infoDto = {
            lno: assetDto.licenseId,
            rightName: assetDto.rightName,
            price: assetDto.price,
            priceUnit: assetDto.priceUnit,
            maxUserCount: assetDto.maxUserCount,
            usePurpose: assetDto.usePurpose, 
            rightType: assetDto.rightType
        }

        moveToReContract(infoDto);
    }

    //버튼클릭 : 계약해지
    const handleClickCancel = (e)=>{
        e.preventDefault();
        cancleAsset(assetDto.ano).then(data=>{
            setResult(data);
        })
    }

    //버튼클릭 : 삭제
    const handleClickRemove = (e)=>{
        e.preventDefault();
        delForeverAsset(assetDto.ano).then(data=>{
            setResult(data);
        })
    }

    //모달창 닫기(결과확인 후)
    const closeModal = () => {
        setResult(null)
        moveToList({ page: 1 })
    }


    return (
        <div>
            {fetching ? <FetchingModal></FetchingModal> : <></>}
            {result? <ResultModal 
            isOpen={result !==''}
            content={"처리가 완료되었습니다."}
            callbackFn={closeModal}></ResultModal>:<></>}
            <Form>
                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        라이선스 상세보기
                    </CardTitle>
                    <CardBody>
                        <FormGroup>
                            <Label for="rightName">상품명 </Label>
                            <Input
                                id="rightName"
                                name="rightName"
                                value={assetDto.rightName}
                                type="text"
                                readOnly
                            />
                            <Input id="ano" name="ano" type="hidden" value={assetDto.ano} />
                            <Input id="licenseId" name="licenseId" type="hidden" value={assetDto.licenseId} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="rightType">권리유형</Label>
                            <Input id="rightType" name="rightType" type="text" value={assetDto.rightType} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractStatus">계약구분</Label>
                            <Input id="contractStatus" name="contractStatus" type="text" value={assetDto.contractStatus} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="usePurpose">용도</Label>
                            <Input id="usePurpose" name="usePurpose" type="text" value={assetDto.usePurpose} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="priceGroup" className="mt-3">단위금액/단위</Label>
                            <InputGroup id="priceGroup">
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={assetDto.price}
                                    readOnly
                                />
                                <span><Input
                                    id="priceUnit"
                                    name="priceUnit"
                                    type="text"
                                    value={assetDto.priceUnit}
                                    readOnly></Input></span>
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractCount">구입/계약 개수</Label>
                            <Input
                                id="contractCount"
                                name="contractCount"
                                type="number"
                                value={assetDto.contractCount}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="totalPrice">총 금액</Label>
                            <Input
                                id="totalPrice"
                                name="totalPrice"
                                type="number"
                                value={assetDto.totalPrice}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractDate">구입일</Label>
                            <Input
                                id="contractDate"
                                name="contractDate"
                                type="date"
                                value={assetDto.contractDate}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="expireDate">만료일</Label>
                            <Input
                                id="expireDate"
                                name="expireDate"
                                type="date"
                                value={assetDto.expireDate}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="comment">비고</Label>
                            <Input
                                id="comment"
                                name="comment"
                                type="textarea"
                                value={assetDto.comment}
                                readOnly
                            />
                        </FormGroup>
                        {assetDto.fileCount > 0 ?
                            <FileComponent fileData={assetDto.savedFiles}></FileComponent>
                            : <></>}
                        <div className="text-center">
                                <Button className="btn " color="primary" onClick={handleClickReContract}>재계약/연장계약</Button>
                                <Button className="btn" color="primary" style={{marginLeft:10}} onClick={handleClickCancel}>계약해지</Button>
                                <Button className="btn" color="danger" style={{marginLeft:10}} onClick={handleClickRemove}>삭제</Button>
                                <Button className="btn" color="secondary" style={{marginLeft:10}} onClick={moveToList}>리스트</Button></div>
                    </CardBody>
                </Card>
            </Form>
        </div >
    );
}
export default LicenseAssetViewComponent;