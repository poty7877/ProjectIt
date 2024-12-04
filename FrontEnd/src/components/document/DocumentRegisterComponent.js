import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";

import React, {useEffect, useState} from "react";

import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {useLocation, useNavigate} from "react-router-dom";
import {postAdd} from "../../api/DocumentApi";
import DocumentSoftWareRegisterModal from "../documentModal/DocumentSoftWareRegisterModal";
import {getCookie} from "../../util/cookieUtil";
import {statusRead} from "../../api/memberApi";
import DocumentApproverRegisterModal from "../documentModal/DocumentApproverRegisterModal";
import DocumentHardWareRegisterModal from "../documentModal/DocumentHardWareRegisterModal";


const initState = {
    dno: 0,
    title: "",
    description: "",
    writer: "",
    sano: [],
    hano: [],
    mno: 0,
    approver: "",
    approvalDate: "",
    approved: "",
    visibility: ""
}


const DocumentRegisterComponent = () => {

    // document 객체 값 관리
    const [document, setDocument] = useState({...initState});

    // 모달 창 오픈
    const [aModalOpen, setAmodalOpen] = useState(false);

    // 모달 창 오픈
    const [sModalOpen, setSmodalOpen] = useState(false);

    // 모달 창 오픈
    const [hModalOpen, setHmodalOpen] = useState(false);

    const [loginMember, setLoginMember] = useState({});

    // 소프트 웨어 추가 버튼
    const handleClickSoftwareAdd = (e) => {
        e.preventDefault()
        setSmodalOpen(true);
    };

    // 멤버 추가 버튼
    const handleClickApproverAdd = (e) => {
        e.preventDefault()
        setAmodalOpen(true);
    };

    // 하드웨어 추가 버튼
    const handleClickHardwareAdd = (e) => {
        e.preventDefault()
        setHmodalOpen(true);
    };

    // 이동 관련
    const navigate = useNavigate()

    // 서버와 통신 상태를 나타냄
    const [fetching, setFetching] = useState(false);

    // 결과를 보여줄 모달창
    const [result, setResult] = useState(null)

    const location = useLocation();

    const [mno, setMno] = useState(null);

    const [software, setSoftware] = useState([{}])

    const [hardware, setHardware] = useState([{}])

    const [approver, setApprover] = useState({});

    const [error, setError] = useState({});

    const token = getCookie("member");

    useEffect(() => {
        if (token?.mno) {
            console.log(token);
            statusRead(token?.mno).then(data => {
                setLoginMember(data)
            })
        }
    }, [])

    useEffect(() => {
        if (!token?.mno) {
            alert("로그인 후 이용 가능한 기능입니다.");
            // 이전 페이지로 이동
            const previousPage = location.state?.from || "/document/requested/list";
            navigate(previousPage);
        }
    }, [token, navigate, location]);

    // 소프트웨어 선택시 정보 저장
    const handleSoftwareSave = (selectedSoftware) => {
        // 선택된 소프트웨어의 ano 값을 sano 배열에 추가
        console.log(selectedSoftware)
        setSoftware(selectedSoftware);
        const newSano = [...document.sano];
        if (selectedSoftware) {
            selectedSoftware.forEach((software) => {
                if (!newSano.includes(software.ano)) {
                    newSano.push(software.ano);
                }
            });
        }
        setDocument((prevDocument) => ({...prevDocument, sano: newSano}));
        console.log(newSano)
        setSmodalOpen(false); // 모달 닫기
    };

    // 결재자 선택시 정보 저장
    const handleApproverSave = (selectedMember) => {
        // 선택된 결재자 값을
        setApprover(selectedMember)
        console.log(selectedMember)
        if (selectedMember) {
            setMno(selectedMember.mno);
        }
        setAmodalOpen(false); // 모달 닫기
    };

    // 하드웨어 선택시 정보 저장
    const handleHardwareSave = (selectedHardware) => {
        console.log(selectedHardware)
        setHardware(selectedHardware)
        const newHano = [...document.hano];
        if (selectedHardware) {
            selectedHardware.forEach((hardware) => {
                if (!newHano.includes(hardware.cno)) {
                    newHano.push(hardware.cno);
                }
            });
        }
        setDocument((prevDocument) => ({...prevDocument, hano: newHano}));
        console.log(newHano)
        setHmodalOpen(false); // 모달 닫기
    };


    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeProject = (e) => {
        const {name, value} = e.target;

        if (name === "sano" || name === "hano") {
            // `sano`는 배열이므로 값이 존재하면 배열에 추가/삭제
            setDocument((prevDocument) => {
                const newSano = [...prevDocument.sano];
                const newHano = [...prevDocument.hano];
                if (newSano.includes(value)) {
                    // 이미 값이 있으면 삭제
                    const index = newSano.indexOf(value);
                    newSano.splice(index, 1);
                } else {
                    // 값이 없으면 추가
                    newSano.push(value);
                }

                if (newHano.includes(value)) {
                    const index = newHano.indexOf(value);
                    newHano.splice(index, 1);
                } else {
                    newHano.push(value)
                }
                return {...prevDocument, sano: newSano, hano: newHano};
            });
        } else {
            // 다른 값은 그대로 처리
            setDocument((prevDocument) => ({
                ...prevDocument,
                [name]: value,
            }));
        }
    };

    // Add 버튼 클릭시
    const handleClickAdd = async () => {
        console.log(mno);
        const formData = {
            title: document.title,
            description: document.description,
            writer: loginMember.name,
            sano: document.sano,
            hano: document.hano,
            mno: mno,
            approver: approver.name,
            visibility: document.visibility || "PUBLIC"
        }
        setFetching(true);
        const response = await postAdd(formData);
        if (response.success) {
            setFetching(false) // 서버 로딩 끝나면 false
            setResult(response.success) // Result 모달창에서 결과 집어넣기
        } else {
            setFetching(false)
            setError(response.errors)
        }
    }

    // 모달창 닫음
    const closeModal = () => {
        setResult(null)
        navigate({
            pathname: `../document/requested/list`
        })
    }


    // asset 리스트 불러오기


    return (
        <div>
            {fetching ? <FetchingModal/> : <></>}
            <ResultModal
                isOpen={result}
                content="문서 등록 완료"
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
                            문서 작성
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="title">제목 {error.title &&
                                        <small style={{color: "red"}}>{error.title}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="제목을 입력하세요"
                                        type="text"
                                        onChange={handleChangeProject}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="description">내용 {error.description &&
                                        <small style={{color: "red"}}>{error.description}</small>}</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        type="textarea"
                                        onChange={handleChangeProject}
                                        style={{height: 300}}
                                    />
                                </FormGroup>
                                {/* 예시 양식 추가 */}
                                <ul>

                                    <li><strong>신청 목적:</strong> 새로운 소프트웨어/하드웨어를 통한 프로젝트 수행 필요</li>
                                    <li><strong>요청 사유:</strong> 기존 시스템의 한계로 인해 성능 향상 및 효율적인 업무 수행을 위해 추가 소프트웨어/하드웨어가 필요함
                                    </li>

                                    <li><strong>필요 시기:</strong> 2025년 4월 1일 전까지 구매 완료</li>
                                    <li><strong>예상 효과:</strong>
                                        <ul>
                                            <li>프로젝트 일정 단축</li>
                                            <li>팀원 생산성 향상</li>
                                            <li>시스템 안정성 향상</li>
                                        </ul>
                                    </li>

                                    <li><strong>기타 사항:</strong>
                                        <ul>
                                            <li>교육 및 기술 지원 서비스 필요</li>
                                            <li>기존 시스템과의 호환성 점검 예정</li>
                                        </ul>
                                    </li>
                                </ul>
                                <FormGroup>
                                    <Label for="sano">요청 소프트웨어</Label>
                                    <Button onClick={handleClickSoftwareAdd}>소프트웨어 선택</Button>
                                    <Input
                                        type={"text"}
                                        readOnly={true}
                                        value={software ? software.map((data) => data.rightName || "").join(" || ") : ""}
                                    ></Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="sano">요청 하드웨어</Label>
                                    <Button onClick={handleClickHardwareAdd}>하드웨어 선택</Button>
                                    <Input
                                        type={"text"}
                                        readOnly={true}
                                        value={hardware ? hardware.map((data) => data.productName || "").join(" || ") : ""}
                                    ></Input>
                                </FormGroup>
                                <ul>
                                    <li><strong>소프트웨어/하드웨어 종류:</strong>
                                        <ul>
                                            <li>소프트웨어: 프로젝트 관리 도구 (예: Jira, Trello 등)</li>
                                            <li>하드웨어: 고성능 서버 및 워크스테이션</li>
                                        </ul>
                                    </li>
                                </ul>
                                <FormGroup>
                                    <Label for="mno">결재자 {error.mno &&
                                        <small style={{color: "red"}}>{error.mno}</small>}</Label>
                                    <Button onClick={handleClickApproverAdd}>결재자 선택</Button>
                                    <Input
                                        type={"text"}
                                        readOnly={true}
                                        value={approver && approver.name}
                                    ></Input>
                                    <ul>
                                        <li><strong>관련 부서:</strong> 개발팀, IT팀</li>
                                        <li><strong>결재자:</strong> 팀장, 부서장, 대표이사</li>
                                    </ul>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="writer">작성자</Label>
                                    <Input
                                        id="writer"
                                        name="writer"
                                        type="text"
                                        readOnly={true}
                                        value={loginMember.name || ""}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        id="visibility"
                                        name="visibility"
                                        type="radio"
                                        value={"PUBLIC"}
                                        onChange={handleChangeProject}
                                        defaultChecked
                                    />
                                    <Label for="writer">전체 공개</Label>
                                    <Input
                                        id="visibility"
                                        name="visibility"
                                        type="radio"
                                        value={"PRIVATE"}
                                        onChange={handleChangeProject}
                                    />
                                    <Label for="writer">비공개</Label>
                                </FormGroup>
                                <Button type={"button"} onClick={handleClickAdd}>저장</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <DocumentSoftWareRegisterModal
                isOpen={sModalOpen}
                callbackFn={handleSoftwareSave}
            />
            <DocumentApproverRegisterModal
                isOpen={aModalOpen}
                callbackFn={handleApproverSave}
            />
            <DocumentHardWareRegisterModal
                isOpen={hModalOpen}
                callbackFn={handleHardwareSave}
            />
        </div>
    );
}
export default DocumentRegisterComponent;