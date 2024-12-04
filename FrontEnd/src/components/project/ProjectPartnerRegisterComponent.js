import ProjectPartnerRegisterModal from "../projectModal/ProjectPartnerRegisterModal";
import React, {useEffect, useState} from "react";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {postAdd} from "../../api/ProjectPartnerApi";
import {useNavigate, useParams} from "react-router-dom";
import {getOne} from "../../api/ProjectApi";
import useProjectMove from "../../hooks/useProjectMove";

const initState = {
    email: "",
    name: "",
    phone: "",
    request: "",
    infoPartnersDTO:{},
    projectDTO:{},
}


const ProjectPartnerRegisterComponent = () => {
    const {pno} = useParams();

    const navigate = useNavigate();

    const [project, setProject] = useState({});

    const [partner, setPartner] = useState({});

    const [projectPartner, setProjectPartner] = useState({...initState});

    const [result, setResult] = useState(null);

    const [pmodal, setPmodal] = useState(null);

    const [fetching, setFetching] = useState(false);

    const [error, setError] = useState({});

    const {moveToProjectPartner} = useProjectMove();

    useEffect(() => {
        getOne(pno).then(data => {
            setProject(data)
        })
    }, [pno])

    const handlePartnerSave = (selectedPartner) => {
        setPartner(selectedPartner)
        console.log(selectedPartner)
        setPmodal(false); // 모달 닫기
    };

    const ClickModalOpen = () => {
        setPmodal(true);
    }

    const closeModal = () => {
        setResult(null)
        navigate({
            pathname: `../pmember/${pno}`
        })
    }

    const handleClickNext = () => {
        navigate({
            pathname: `../pmember/${pno}`
        })
    }

    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeProjectPartner = (e) => {
        projectPartner[e.target.name] = e.target.value
        console.log(e.target.value)
        setProjectPartner({...projectPartner})
    }



    const handleClickAdd = async () => {

        if(!partner){
            alert("고객사를 선택하세요")
            return;
        }

        const formData = {
            email: projectPartner.email,
            name: projectPartner.name,
            phone: projectPartner.phone,
            request: projectPartner.request,
            infoPartnersDTO: partner,
            projectDTO: project,
        }

        const response = await postAdd(formData);
        if (response.success) {
            setResult(response.data);
            console.log(response.data)
        } else {
            setError(response.errors)
        }
    }

    return (
        <div>
            {fetching ? <FetchingModal/> : <></>}
            <ResultModal
                isOpen={result === "SUCCESS"}
                content="고객사 정보 등록 완료"
                callbackFn={closeModal}
            />
            <Row>
                <Col>
                    {/* --------------------------------------------------------------------------------*/}
                    {/* Card-1*/}
                    {/* --------------------------------------------------------------------------------*/}
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            고객사 정보 등록
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <div style={{height:160}}>
                                    <h4>고객사 정보를 모를경우 다음으로 이동 버튼을 눌러주세요</h4>
                                    <h6>찾으시는 고객사가 없다면 추가후 선택해주세요</h6>
                                    <Button onClick={moveToProjectPartner}>고객사 추가</Button>
                                </div>
                                <FormGroup>

                                    <Label for="infoPartnersDTO">고객사 선택</Label>
                                    <Button onClick={ClickModalOpen}>고객사 선택</Button>
                                    <Input
                                        type={"text"}
                                        readOnly={true}
                                        value={partner?.comName && partner?.bizType ? `${partner.comName} - ${partner.bizType}` : "선택되지 않음"}
                                    ></Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">담당자 이름 {error.name && <small style={{color: "red"}}>{error.name}</small>}</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="ex) 홍길동 "
                                        type="text"
                                        onChange={handleChangeProjectPartner}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">담당자 이메일   {error.email && <small style={{color: "red"}}>{error.email}</small>}</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="ex) example@test.com"
                                        type="email"
                                        onChange={handleChangeProjectPartner}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">담당자 연락처   {error.phone && <small style={{color: "red"}}>{error.phone}</small>}</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="ex) 010-1111-2222"
                                        type="text"
                                        onChange={handleChangeProjectPartner}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="request">
                                        **고객사 요청사항**
                                        {error.request && <small style={{color: "red"}}>{error.request}</small>}
                                    </Label>
                                    <Input
                                        id="request"
                                        name="request"
                                        type="textarea"
                                        placeholder="상세한 요청사항을 기재해 주세요"
                                        value={projectPartner.request}
                                        onChange={handleChangeProjectPartner}
                                        rows={10}
                                    />
                                </FormGroup>


                            </Form>
                        </CardBody>
                        <div>
                        <Button onClick={handleClickAdd} color={"primary"} style={{marginRight:5}}>등록</Button>
                            <Button onClick={handleClickNext} color={"danger"}>다음에 등록하기</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            <ProjectPartnerRegisterModal
                callbackFn={handlePartnerSave}
                isOpen={pmodal}
            />
        </div>
    );


}

export default ProjectPartnerRegisterComponent;