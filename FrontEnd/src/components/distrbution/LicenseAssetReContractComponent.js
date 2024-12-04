import { useEffect, useState } from "react";
import useDistMove from "../../hooks/useDistMove";
import FetchingModal from "../common/FetchingModal";
import { Button, ButtonGroup, Card, CardBody, CardTitle, Form, FormGroup, FormText, Input, InputGroup, Label } from "reactstrap";
import { addMonths, addYears, format } from "date-fns";
import { registAsset } from "../../api/LicenseApi";
import ResultModal from "../common/ResultModal";
import { number } from "prop-types";

/*라이선스-연장, 재계약용->inset */
const currentDate = format(new Date(), 'yyyy-MM-dd'); //현재시간
const initState = {//AssetLicenseDTO
    rightType: "[구입]사용권",
    contractStatus: "신규계약",
    usePurpose: "문서/사무",
    contractDate: currentDate,
    expireDate: currentDate,
    contractCount: 0,
    totalPrice: 0,
    comment: '',
    expireYN: false,
    totalUseCount: 0,
    licenseId: 0,
    files: [],
    fileCount: 0
}

const infoInitState = {//InfoLicenseDTO --관련 라이선스 불러오기
    lno: 0,
    rightName: '',
    price: 0,
    priceUnit: 'YEAR',
    maxUserCount: 0,
    usePurpose: '',
    rightType: ''
}
const LicenseAssetReContractComponent = () => {
    const [licenseAsset, setLicenseAsset] = useState({ ...initState }); //등록용 객체 set용
    const [infoDTO, setInfoDTO] = useState({ ...infoInitState }); //InfoLicenseDTO
    const [inputFiles, setInpuFiles] = useState([]); //첨부파일 데이터 보관
    const [fetching, setFetching] = useState(false); //진행모달(로딩)
    const [result, setResult] = useState(null); //결과모달창
    const { moveToList } = useDistMove(); //페이지 이동

    const [tPrice, setTPrice] = useState({ number }); //totalPrice(자동계산)
    const [exDate, setExDate] = useState({ currentDate }); //만료일(자동계산)
    const [tPerson, setTPerson] = useState({ number }); //최대 사용 가능인원(자동계산)


    useEffect(() => {
        setData().then((storedInfo) => {
            setFetching(true);
            const parsedInfo = JSON.parse(storedInfo);
            setInfoDTO(parsedInfo);
            setFetching(false);

            if (licenseAsset.contractCount) {
                setFetching(true);
                let total = (licenseAsset.contractCount * infoDTO.price);
                let totalPerson = (licenseAsset.contractCount * infoDTO.maxUserCount);
                setTPrice(total);
                setTPerson(totalPerson);
                // console.log(tPrice);

                setFetching(false);
            }

            if (licenseAsset.contractDate) {
                setFetching(true);
                let exDateVal = changeExDate(licenseAsset.contractDate, infoDTO.priceUnit);
                setExDate(exDateVal);
                // console.log(exDate);
                setFetching(false);
            }



        }, [licenseAsset.contractCount, licenseAsset.contractDate]);





    }, [setInfoDTO, licenseAsset.contractDate, licenseAsset.contractCount]);




    //localstorage에서 보낸 값 받아오기(비동기)
    function setData() {
        const promise = new Promise((resolve, reject) => {
            const storedInfo = localStorage.getItem('infoDTO'); //useDistMove에서 저장한 값 받기
            if (storedInfo) {
                const parsedInfo = JSON.parse(storedInfo);
                resolve(storedInfo);
            } else {
                reject(new Error('상품데이터 전달 실패!!'));
            }

        });
        return promise;
    }



    //입력값 변경시 객체 값 세팅(licenseAsset)
    const handleChangeLicenseAsset = (e) => {
        licenseAsset[e.target.name] = e.target.value
        setLicenseAsset({ ...licenseAsset })
    }

    //전송용 formdata->axios
    const handleClickAdd = (e) => {
        e.preventDefault();
        console.log("등록하기 실행");
        console.log("files : " + inputFiles);
        const fileList = Array.isArray(inputFiles) ? inputFiles : [inputFiles];

        const sendData = {//AssetLicenseDTO
            rightType: infoDTO.rightType,
            contractStatus: licenseAsset.contractStatus,
            usePurpose: infoDTO.usePurpose,
            contractDate: licenseAsset.contractDate,
            expireDate: exDate,
            contractCount: licenseAsset.contractCount,
            totalPrice: tPrice,
            totalUseCount: tPerson,
            comment: licenseAsset.comment,
            expireYN: false,
            licenseId: infoDTO.lno,
            files: fileList,
            fileCount: inputFiles.length
        }


        console.log("등록 : " + JSON.stringify(sendData));
        console.log("totalPrice : " + sendData.totalPrice);
        // console.log("등록 : " + formData.get("fileCount"));
        setFetching(true)
        registAsset(sendData).then(data => {
            setFetching(false)
            setResult(data.result)
        });
    }

    //모달창 닫기(결과확인 후)
    const closeModal = () => {
        setResult(null)
        moveToList({ page: 1 })
    }

    const changeExDate = (contractDate, priceUnit) => {
        // console.log(licenseAsset.contractDate);
        let expireDate = new Date();
        switch (priceUnit) {
            case "년":
                expireDate = addYears(contractDate, 1);
                break;
            case "월":
                expireDate = addMonths(contractDate, 1);
                break;
            case "인":
                expireDate = addYears(contractDate, 1);
                break;
        }
        //   console.log(expireDate);
        return format(expireDate, 'yyyy-MM-dd');
    }

    const handleFileChange = (e) => {
        setInpuFiles(Array.from(e.target.files));
        console.log(inputFiles);
    }

    return (
        <div>
            {fetching ? <FetchingModal></FetchingModal> : <></>}
            {result ? <ResultModal
                isOpen={result > 0 || result !== ''}
                content={"등록이 완료되었습니다."}
                callbackFn={closeModal}></ResultModal> : <></>}
            <Form>
                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        라이선스 계약변경
                    </CardTitle>
                    <CardBody>
                        <FormGroup>
                            <Label for="rightName">상품명 </Label>
                            <Input
                                id="rightName"
                                name="rightName"
                                value={infoDTO.rightName}
                                type="text"
                                readOnly
                            />
                            <Input id="lno" name="lno" type="hidden" value={infoDTO.lno} />
                            <Label for="priceGroup" className="mt-3">금액/단위</Label>
                            <InputGroup id="priceGroup">
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={infoDTO.price}
                                    readOnly
                                />
                                <span><Input
                                    id="priceUnit"
                                    name="priceUnit"
                                    type="text"
                                    value={infoDTO.priceUnit}
                                    readOnly /></span>
                            </InputGroup>
                            <Label for="maxUserCount" className="mt-3">사용조건(사용가능 인원) </Label>
                            <InputGroup>
                                <Input
                                    id="maxUserCount"
                                    name="maxUserCount"
                                    value={infoDTO.maxUserCount}
                                    type="text"
                                    readOnly
                                /><span><Input color="dark" type="text" readOnly disabled value={"명"} /></span>
                            </InputGroup>
                        </FormGroup>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <FormGroup>
                            <Label for="rightType">권리유형</Label>
                            <Input id="rightType" name="rightType" type="text" value={infoDTO.rightType} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractStatus">계약구분</Label>
                            <Input id="contractStatus" name="contractStatus" type="select" onChange={handleChangeLicenseAsset}>
                                <option>연장계약</option>
                                <option>재계약</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="usePurpose">용도</Label>
                            <Input id="usePurpose" name="usePurpose" type="text" value={infoDTO.usePurpose} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractCount">구입/계약 개수</Label>
                            <Input
                                id="contractCount"
                                name="contractCount"
                                placeholder="0"
                                type="number"
                                onChange={handleChangeLicenseAsset}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="totalPrice">총 금액</Label>
                            <Input
                                id="totalPrice"
                                name="totalPrice"
                                placeholder="0"
                                type="number"
                                value={tPrice}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="totalUseCount">최대 사용 가능 인원(명)</Label>
                            <Input
                                id="totalUseCount"
                                name="totalUseCount"
                                type="number"
                                value={tPerson}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="contractDate">구입일</Label>
                            <Input
                                id="contractDate"
                                name="contractDate"
                                placeholder={currentDate}
                                type="date"
                                onChange={handleChangeLicenseAsset}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="expireDate">만료일</Label>
                            <Input
                                id="expireDate"
                                name="expireDate"
                                placeholder="yyyy-MM-dd"
                                type="date"
                                value={exDate}
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
                                onChange={handleChangeLicenseAsset}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="files">첨부파일</Label>
                            <Input id="files" name="files" type="file" onChange={handleFileChange} multiple />
                            <FormText>
                                *첨부 가능 파일 형식 : pdf, zip, jpg, jpeg, png
                            </FormText>
                        </FormGroup>
                        <div className="text-center">
                            <ButtonGroup >
                                <Button className="btn" color="primary" onClick={handleClickAdd}>등록하기</Button>
                                <Button className="btn" color="secondary" onClick={moveToList}>리스트</Button></ButtonGroup></div>
                    </CardBody>
                </Card>
            </Form>
        </div>
    );
}
export default LicenseAssetReContractComponent;
