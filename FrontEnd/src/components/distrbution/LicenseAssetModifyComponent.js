import { useEffect, useState } from "react";
import { getOneAsset } from "../../api/LicenseApi";
import FetchingModal from "../common/FetchingModal";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, FormText, Input, InputGroup, Label } from "reactstrap";
import { format } from "date-fns";
import useDistMove from "../../hooks/useDistMove";

const currentDate = format(new Date(), 'yyyy-MM-dd'); //현재시간
const initState = {//AssetLicenseOneDTO
    ano: 0,
    rightName: '',
    purpose: '',
    rightType: '',
    usePurpose: '',
    contractStatus: '',
    contractDate: currentDate,
    expireDate: currentDate,
    contractCount: 0,
    comment: '',
    expireYN: false,
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


const LicenseAssetModifyComponent = ({ano}) => {
    console.log("받은ano : "+ano);
    const [assetDto, setAssetDto] = useState({ ...initState }); //server 전송데이터 관리
    const [fetching, setFetching] = useState(false); //로딩 모달
    const {moveToList} = useDistMove(); //이동함수


    useEffect(() => {
        setFetching(true);
       getOneAsset(ano).then(data => {
            setAssetDto(data);
            setFetching(false);
        }); 
    }, [ano]);





    return (
        <div>
            {fetching ? <FetchingModal></FetchingModal> : <></>}
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
                            <Input id="ano" name="ano" type="hidden" value={assetDto.ano}></Input>
                            <Input id="licenseId" name="licenseId" type="hidden" value={assetDto.licenseId}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="rightType">권리유형</Label>
                            <Input id="rightType" name="rightType" type="select" value={assetDto.rightType} readOnly>
                                <option>오픈소스</option>
                                <option>[구입]사용권</option>
                                <option>[보유]저작권</option>
                                <option>[보유]특허</option></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractStatus">계약구분</Label>
                            <Input id="contractStatus" name="contractStatus" type="select" value={assetDto.contractStatus} readOnly>
                                <option>신규계약</option>
                                <option>연장계약</option>
                                <option>재계약</option>
                                <option>계약만료</option>
                                <option>계약해지</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="usePurpose">용도</Label>
                            <Input id="usePurpose" name="usePurpose" type="select" value={assetDto.usePurpose} readOnly>
                                <option>문서/사무</option>
                                <option>개발</option>
                                <option>디자인</option>
                                <option>경영/회계</option>
                                <option>네트워크/보안</option>
                                <option>기타</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="priceGroup" className="mt-3">단위금액/단위</Label>
                            <InputGroup id="priceGroup">
                                <Input
                                    id="price"
                                    name="price"
                                    placeholder="00"
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
                                placeholder="0"
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
                                placeholder="0"
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
                                placeholder="자유입력"
                                type="textarea"
                                value={assetDto.comment}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="files">첨부파일</Label>
                            <Input id="files" name="files" type="file"  multiple />
                            <FormText>
                                *첨부 가능 파일 형식 : pdf, zip, jpg, jpeg, png
                            </FormText>
                        </FormGroup>
                        <div className="text-center">
                            <Button className="btn" color="primary" onClick={moveToList}>수정하기</Button>
                            <Button className="btn" color="secondary" onClick={moveToList}>리스트</Button></div>

                    </CardBody>
                </Card>
            </Form>
        </div >
    );
}
export default LicenseAssetModifyComponent;