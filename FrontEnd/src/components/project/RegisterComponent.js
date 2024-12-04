import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import {postAdd} from "../../api/ProjectApi";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {useLocation, useNavigate} from "react-router-dom";
import {getCookie} from "../../util/cookieUtil";
import {statusRead} from "../../api/memberApi";
import {postAddPm} from "../../api/ProjectMemberApi";
import {Tooltip} from "@mui/material";

const initState = {
    title: "",
    content: "",
    startDate: "",
    dueDate: "",
    version: "1.0.0",
    status: "PROGRESS",
    projectType: false,
    name: ""
}
const RegisterComponent = () => {
    // api로 가져온 project값
    const [project, setProject] = useState({...initState});
    // 이동관련
    const navigate = useNavigate()
    // url 관련
    const location = useLocation();
    // 서버와 통신 상태를 나타냄
    const [fetching, setFetching] = useState(false);
    // 결과를 보여줄 모달창
    const [result, setResult] = useState(null)
    // 로그인한 사람
    const [loginMember, setLoginMember] = useState({});
    // error
    const [error, setError] = useState({})
    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeProject = (e) => {
        project[e.target.name] = e.target.value
        setProject({...project})
    }
    //member라는 이름을 가진 쿠키 추출
    const token = getCookie('member');
    // Add 버튼 클릭시
    const handleClickAdd = async () => {

        const formData = new FormData();
        formData.append("title", project.title);
        formData.append("content", project.content);
        formData.append("startDate", project.startDate);
        formData.append("dueDate", project.dueDate);
        formData.append("projectType", project.projectType);
        formData.append("mno", token.mno)
        formData.append("name", loginMember.name)
        setFetching(true);

        const response = await postAdd(formData)
        if (response.success) {

            setFetching(false) // 서버 로딩 끝나면 false
            setResult({status: response.data.status, pno: response.data.pno}) // Result 모달창에서 결과 집어넣기
            const formDataPm = [{
                pno: response.data.pno,
                mno: token.mno,
                name: loginMember.name,
                memberRole: "팀장",
                team: "팀장"
            }]
            await postAddPm(formDataPm, response.data.pno)
        } else {
            setError(response.errors)
        }
    }
    // 모달 닫음
    const closeModal = (pno) => {
        setResult(null)
        if (project.projectType === "true") {
            navigate({
                pathname: `../project/partner/${pno}`
            })
        } else {
            navigate({
                pathname: `../pmember/${pno}`
            })
        }
    }

    // 로그인한 사람의 mno로 정보를 가져옴
    useEffect(() => {
        if (token?.mno) {
            statusRead(token.mno).then(data => {
                setLoginMember(data);
            })
        }
    }, [token?.mno])

    // 로그인을 해야 조회 가능
    useEffect(() => {
        if (!token?.mno) {
            alert("로그인 후 이용 가능한 기능입니다.");
            // 이전 페이지로 이동
            const previousPage = location.state?.from || "/project";
            navigate(previousPage);
        }
    }, [token, navigate, location]);

    return (
        <div>
            {fetching ? <FetchingModal/> : <></>}
            <ResultModal
                isOpen={result?.status === "SUCCESS"}
                content="다음 정보를 입력하세요"
                callbackFn={() => closeModal(result.pno)}
            />
            <Row>
                <Col>
                    {/* --------------------------------------------------------------------------------*/}
                    {/* Card-1*/}
                    {/* --------------------------------------------------------------------------------*/}
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            프로젝트 생성
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="title">프로젝트 이름 {error.title &&
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
                                    <Label for="startDate">시작일 {error.startDate &&
                                        <small style={{color: "red"}}>{error.startDate}</small>}</Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        placeholder="yyyy-MM-dd"
                                        type="date"
                                        onChange={handleChangeProject}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="dueDate">마감일 {error.dueDate &&
                                        <small style={{color: "red"}}>{error.dueDate}</small>}</Label>
                                    {error.endDateAfterStartDate &&
                                        <small style={{color: "red"}}>{error.endDateAfterStartDate}</small>}
                                    <Input
                                        id="dueDate"
                                        name="dueDate"
                                        placeholder="yyyy-MM-dd"
                                        type="date"
                                        onChange={handleChangeProject}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="content">프로젝트 내용</Label>
                                    <Input
                                        id="content"
                                        name="content"
                                        type="textarea"
                                        onChange={handleChangeProject}
                                        rows="8"
                                    />
                                </FormGroup>

                                {/* 프로젝트 내용 예시 양식을 Card로 감싸서 구분 */}
                                <Card className="mt-3">
                                    <CardBody>
                                        <h5>프로젝트 내용 예시 양식</h5>
                                        <ul>
                                            <li><strong>프로젝트 목표:</strong> 고객사 요구사항을 반영하여 새로운 웹 애플리케이션을 개발</li>
                                            <li><strong>주요 일정:</strong>
                                                <ul>
                                                    <li>2024년 12월 1일 - 초기 설계 완료</li>
                                                    <li>2025년 3월 1일 - 최종 배포</li>
                                                </ul>
                                            </li>
                                            <li><strong>기대 효과:</strong>
                                                <ul>
                                                    <li>고객 만족도 향상</li>
                                                    <li>사용자 경험 개선</li>
                                                </ul>
                                            </li>
                                            <li><strong>위험 요소:</strong>
                                                <ul>
                                                    <li>일정 지연</li>
                                                    <li>요구사항 변경</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </CardBody>
                                </Card>

                                <FormGroup>
                                    {error.projectType && <small style={{color: "red"}}>{error.projectType}</small>}
                                    <Tooltip title={"고객사 요청으로 진행되는 프로젝트는 외부 프로젝트를 선택하세요"}>
                                        <Input id="projectType" name="projectType" type="radio"
                                               onChange={handleChangeProject} value={false} />
                                        <Label for="projectType" style={{ marginRight: 30 }}>내부 프로젝트</Label>

                                        <Input id="projectType" name="projectType" type="radio"
                                               onChange={handleChangeProject} value={true} />
                                        <Label for="projectType">외부 프로젝트</Label>
                                    </Tooltip>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="title">작성자</Label>
                                    <Input
                                        id="mno"
                                        name="mno"
                                        type="text"
                                        value={loginMember.name || ""}
                                        readOnly
                                    />
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
export default RegisterComponent;