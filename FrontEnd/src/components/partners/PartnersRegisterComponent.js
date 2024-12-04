import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import ResultModal from "../projectModal/ResultModal";
import {useNavigate} from "react-router-dom";
import {postAdd} from "../../api/PartnersApi";
import {postUploadFile} from "../../api/PartnersFileApi";
import {submitFormData} from "../submitFormData";

// Partner 세팅
const initState = {
    cno: 0,
    comName: "",
    ceoName: "",
    coNum: "",
    phone: "",
    site: "",
    address: "",
    bizType: ""
}

const PartnersRegisterComponent = () => {
    const [error, setError] = useState({});
    // path 설정
    const navigate = useNavigate()
    // 결과 모달창
    const [result, setResult] = useState(null)
    // 고객사 설정
    const [partner, setPartner] = useState({...initState});
    // 고객사 파일 설정
    const [uploadFile, setUploadFile] = useState([]);
    // target의 값이 변경되면 바로 값을 넣음
    const handleChangePartner = (e) => {
        partner[e.target.name] = e.target.value
        console.log(e.target.value)
        setPartner({...partner})
    }
    // 모달창 닫기
    const closeModal = () => {
        setResult(null)
        if (window.location.pathname === "/partners/register/blank") {
            window.close(); // 창을 닫기
        } else {
            navigate({
                pathname: `../partners`
            })
        }
    }
    const handleClickAdd = async () => {

        const response = await postAdd(partner);
        if (response.success) {
            const cno = response.data.cno;
            setResult(response.success);
            if (uploadFile.length > 0) {
                const uploadPromises = Array.from(uploadFile).map((file) => {
                    const formData = new FormData();
                    formData.append("cno", cno);
                    formData.append("file", file);

                    return postUploadFile(formData).then((data) => {
                        setResult(data);
                        console.log(data);
                    });
                });
                // 모든 파일 업로드가 완료될 때까지 기다립니다
                await Promise.all(uploadPromises);
            }
        } else {
            setError(response.errors)
        }
    }

    // 이미지 등록시
    const handleChangeImage = (event) => {
        const files = Array.from(event.target.files);
        setUploadFile(files);
        console.log(files);
    }

    useEffect(() => {

    }, [navigate]);

    console.log(error)
    return (
        <div>
            <ResultModal
                isOpen={result}
                content="고객사 등록완료"
                callbackFn={closeModal}
            />
            <Row>
                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            고객사 등록 화면
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="title">회사 이름 {error.comName &&
                                        <small style={{color: "red"}}>{error.comName}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="comName"
                                        type="text"
                                        placeholder="회사 이름을 입력하세요"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">대표 {error.ceoName &&
                                        <small style={{color: "red"}}>{error.ceoName}</small>}</Label>
                                    <Input
                                        id="ceoName"
                                        name="ceoName"
                                        type="text"
                                        placeholder="ex) 홍길동"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">사업자 번호 {error.coNum &&
                                        <small style={{color: "red"}}>{error.coNum}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="coNum"
                                        type="text"
                                        placeholder="ex) 000-00-00000"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">대표번호 {error.phone &&
                                        <small style={{color: "red"}}>{error.phone}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="phone"
                                        type="text"
                                        placeholder="ex) 000-0000-0000"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">홈페이지 주소</Label>
                                    <Input
                                        id="title"
                                        name="site"
                                        type="text"
                                        placeholder="ex) www.example.com"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">회사 주소 {error.address &&
                                        <small style={{color: "red"}}>{error.address}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="address"
                                        type="text"
                                        placeholder="ex) 경기도 수원시 ㅇㅇㅇ"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">업태(종목) {error.bizType &&
                                        <small style={{color: "red"}}>{error.bizType}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="bizType"
                                        type="text"
                                        placeholder="ex) 도소매"
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="image"> 사업자 등록증 파일 등록 </Label>
                                    <Input type="file" multiple={true} onChange={handleChangeImage}></Input>
                                </FormGroup>
                                <Button type={"button"} onClick={handleClickAdd}>저장</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
export default PartnersRegisterComponent;