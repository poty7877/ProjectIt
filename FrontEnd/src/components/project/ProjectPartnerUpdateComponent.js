import ProjectPartnerRegisterModal from "../projectModal/ProjectPartnerRegisterModal";
import React, {useEffect, useState} from "react";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {getOnePp, postAdd, putOne} from "../../api/ProjectPartnerApi";
import {useNavigate, useParams} from "react-router-dom";
import {getOne} from "../../api/ProjectApi";
import useProjectMove from "../../hooks/useProjectMove";
import {getCookie} from "../../util/cookieUtil";

const initState = {
    ppno: 0,
    email: "",
    name: "",
    phone: "",
    request: "",
    infoPartnersDTO: {},
    projectDTO: {},
}


const ProjectPartnerUpdateComponent = () => {
    const {pno} = useParams();

    const navigate = useNavigate();

    const [project, setProject] = useState({});

    const [partner, setPartner] = useState({});

    const [projectPartner, setProjectPartner] = useState({...initState});

    const [result, setResult] = useState(null);

    const [pmodal, setPmodal] = useState(null);

    const [fetching, setFetching] = useState(false);

    const [error, setError] = useState({})

    const {moveToRead} = useProjectMove();

    useEffect(() => {
        getOne(pno).then(data => {
            setProject(data)
        })
    }, [pno])

    useEffect(() => {
        getOnePp(pno).then(data => {
            if (data !== null) {
                setProjectPartner(data)
            } else {
            }
        })
    }, [pno])

    const token = getCookie("member");


    const handlePartnerSave = (selectedPartner) => {
        setPartner(selectedPartner); // 선택된 고객사를 partner에 저장
        setProjectPartner((prevState) => ({
            ...prevState,
            infoPartnersDTO: selectedPartner, // 고객사 정보를 infoPartnersDTO로 설정
        }));
        setPmodal(false); // 모달 닫기
    };


    const ClickModalOpen = () => {
        setPmodal(true);
    }

    const closeModal = () => {
        setResult(null)
        navigate({
            pathname: `../project/${pno}`
        })
    }

    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeProjectPartner = (e) => {
        const {name, value} = e.target; // 이벤트에서 name과 value 추출
        setProjectPartner((prevState) => ({
            ...prevState, // 이전 상태를 복사
            [name]: value, // 변경된 필드만 업데이트
        }));
    }

    const handleClickUpdate = async () => {

        const formData = {
            ppno: projectPartner.ppno,
            email: projectPartner.email,
            name: projectPartner.name,
            phone: projectPartner.phone,
            request: projectPartner.request,
            infoPartnersDTO: projectPartner.infoPartnersDTO || partner,
            projectDTO: project,
        }

        if (formData.ppno) {
            const response = await putOne(formData);
            if (response.success) {
                setResult(response.data);
            } else {
                setError(response.errors)
            }
        } else {
            const response = await postAdd(formData);
            if (response.success) {
                setResult(response.data)
            } else {
                setError(response.errors)
            }
        }
    }

    return (
        <div>
            {fetching ? <FetchingModal/> : <></>}
            <ResultModal
                isOpen={result === "SUCCESS"}
                content="고객사 정보 수정 완료"
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
                            고객사 정보 수정
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="mno">프로젝트 요청 고객사</Label>
                                    <Button onClick={ClickModalOpen}>고객사 선택</Button>
                                    <Input
                                        type={"text"}
                                        readOnly={true}
                                        value={projectPartner ? `${projectPartner.infoPartnersDTO?.comName} - ${projectPartner.infoPartnersDTO?.bizType}` : partner && partner?.comName && partner?.bizType ? `${partner?.comName} - ${partner?.bizType}` : "선택되지 않음"}
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
                                        value={projectPartner.name || ""}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">담당자 이메일 {error.email && <small style={{color: "red"}}>{error.email}</small>}</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="ex) example@test.com"
                                        type="email"
                                        onChange={handleChangeProjectPartner}
                                        value={projectPartner.email || ""}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">담당자 연락처 {error.phone && <small style={{color: "red"}}>{error.phone}</small>}</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="ex) 010-1111-2222"
                                        type="text"
                                        onChange={handleChangeProjectPartner}
                                        value={projectPartner.phone || ""}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">**고객사 요청사항** {error.request && <small style={{color: "red"}}>{error.request}</small>}</Label>
                                    <Input
                                        id="request"
                                        name="request"
                                        placeholder="자세히 적어주세요"
                                        type="textarea"
                                        onChange={handleChangeProjectPartner}
                                        value={projectPartner.request || ""}
                                    />
                                </FormGroup>
                            </Form>
                        </CardBody>
                        <div>
                            <Button onClick={handleClickUpdate}>수정</Button>
                            <Button onClick={() => moveToRead(pno, token?.mno)}>돌아가기</Button>
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

export default ProjectPartnerUpdateComponent;