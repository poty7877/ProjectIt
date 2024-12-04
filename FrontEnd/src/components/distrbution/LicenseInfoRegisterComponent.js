import { useState } from "react";
import { Button, ButtonGroup, Card, CardBody, CardTitle, Form, FormGroup, Input, InputGroup, Label } from "reactstrap";
import useDistMove from "../../hooks/useDistMove";
import { registInfo } from "../../api/LicenseApi";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";

const initState = { //InfoLicenseDTO
    // lno:0,
    rightName: '',
    version: '',
    purpose: '',
    copyrightHolder: '',
    price: 0,
    priceUnit: 'YEAR',
    maxUserCount: 0,
    contact: '-'
}


const LicenseInfoRegisterComponent = () => {
    const [licenseInfo, setLicenseInfo] = useState({...initState}) //객체 set용
    const [fetching, setFetching] = useState(false) //진행모달창
    const [result, setResult] = useState(null) //결과모달창
    const {moveToList} = useDistMove() //처리후 이동

    //클릭시 객체set
    const handleChangeLicenseInfo = (e) =>{
        licenseInfo[e.target.name] = e.target.value
        setLicenseInfo({...licenseInfo})
    }

    //전송용 formdata->axios
    const handleClickAdd = (e) =>{
        const formData = new FormData()
        formData.append("rightName", licenseInfo.rightName)
        formData.append("version", licenseInfo.version)
        formData.append("purpose", licenseInfo.purpose)
        formData.append("copyrightHolder", licenseInfo.copyrightHolder)
        formData.append("price", licenseInfo.price)
        formData.append("priceUnit", licenseInfo.priceUnit)
        formData.append("maxUserCount", licenseInfo.maxUserCount)
        formData.append("contact", licenseInfo.contact)

        console.log("등록 : "+formData)
        setFetching(true)
        registInfo(formData).then(data =>{
            setFetching(false)
            setResult(data.result)
        })
    }

    //모달창 닫기(결과확인 후)
    const closeModal = () =>{
        setResult(null)
        moveToList({page:1})
    }

    return (
        <div>
            {fetching? <FetchingModal/>:<></>}
            {result? <ResultModal 
             isOpen={result>0 || result!==''}
             content={"등록이 완료되었습니다."}
             callbackFn={closeModal}></ResultModal>:<></>}
            <Card>
                <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">라이선스 등록
                        </CardTitle>
                <CardBody>
                    <Form>
                        <FormGroup>
                            <Label for="rightName">상품명</Label>
                            <Input
                                id="rightName"
                                name="rightName"
                                placeholder="상품명 입력"
                                type="text"
                                onChange={handleChangeLicenseInfo}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="version">상품버전</Label>
                            <Input
                                id="version"
                                name="version"
                                placeholder="상품 버전"
                                type="text"
                                onChange={handleChangeLicenseInfo}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="purpose">용도</Label>
                            <Input id="purpose" name="purpose" type="text" onChange={handleChangeLicenseInfo}>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="copyrightHolder">저작권자</Label>
                            <Input
                                id="copyrightHolder"
                                name="copyrightHolder"
                                placeholder="저작권자"
                                type="text"
                                onChange={handleChangeLicenseInfo}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="priceGroup">금액/단위</Label>
                            <InputGroup id="priceGroup">
                                <Input
                                    id="price"
                                    name="price"
                                    placeholder="00"
                                    type="number"
                                    onChange={handleChangeLicenseInfo}
                                /><span><Input id="priceUnit" name="priceUnit" type="select" onChange={handleChangeLicenseInfo}>
                                    <option value={"년"}>1년간</option>
                                    <option value={"월"}>1개월간</option>
                                    <option value={"인"}>1인당</option>
                                </Input></span></InputGroup>
                        </FormGroup>                  
                    <FormGroup>
                        <Label for="maxUserCount">사용조건(최대 사용가능 인원)</Label>
                        <Input
                            id="maxUserCount"
                            name="maxUserCount"
                            placeholder="0"
                            type="number"
                            onChange={handleChangeLicenseInfo}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="contact">참고URL</Label>
                        <Input
                            id="contact"
                            name="contact"
                            placeholder="상품 페이지 url"
                            type="text"
                            onChange={handleChangeLicenseInfo}
                        />
                    </FormGroup>
                    <div className="text-center">
                        <ButtonGroup>
                    <Button className="btn" color="primary"  onClick={handleClickAdd}>등록하기</Button>                   
                    <Button className="btn" color="secondary"  onClick={closeModal}>리스트</Button></ButtonGroup> </div>                 
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}
export default LicenseInfoRegisterComponent

