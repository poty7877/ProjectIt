import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import React, {useEffect, useState} from "react";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {useNavigate, useParams} from "react-router-dom";
import {getList, getOneMember} from "../../api/ProjectMemberApi";
import {postAdd} from "../../api/ProjectIssueApi";
import {postUploadFile} from "../../api/ProjectIssueFilesApi";

// ProjectIssue값 세팅
const initState = {
    ino: 0,
    pno: 0,
    projectMember: {},
    title: "",
    content: "",
    status: "",
    priority: ""
}

// ProjectMember값 세팅
const minitState = {
    pno: 0,
    mno: 0,
    name: "",
    team: "",
    rank: "",
}

const IssueIssueRegisterComponent = () => {
    const MEMBER_ROLE_KOR = {
        CONTRACT_WORKER: "계약직",
        INTERN: "인턴",
        STAFF: "사원",
        ASSOCIATE: "주임",
        ASSISTANT_MANAGER: "대리",
        MANAGER: "과장",
        DEPUTY_MANAGER: "차장",
        GENERAL_MANAGER: "부장",
        DIRECTOR: "이사",
        SENIOR_DIRECTOR: "상무 이사",
        EXECUTIVE_VICE_PRESIDENT: "전무이사",
        PRESIDENT: "사장",
        VICE_CHAIRMAN: "부회장",
        CHAIRMAN: "회장",
        CEO: "대표이사",
    };

    const MEMBER_TEAM_KOR = {
        AWAIT: "대기",
        TECHNIC: "기술팀",
        PERSONNEL: "인사팀",
        ACCOUNTING: "회계팀",
        FINANCIAL_MANAGEMENT: "재무관리팀",
        팀장: "팀장"
    }

    // pno를 파라미터에서 가져옴
    const {pno} = useParams()
    // issue 값 세팅
    const [issue, setIssue] = useState({...initState});
    // path 경로 설정
    const navigate = useNavigate()
    // 서버와 통신 상태를 나타냄
    const [fetching, setFetching] = useState(false);
    // 결과 모달창
    const [result, setResult] = useState(null)
    // ProjectMemberList 값
    const [projectMembers, setProjectMembers] = useState([]);
    // 선택된 ProjectMember
    const [projectSelectMembers, setProjectSelectMembers] = useState({...minitState});
    // ino 가져오기
    const [newIno, setNewIno] = useState(null);
    // status 가져오기
    const [rstatus, setRstatus] = useState(false);
    // 파일
    const [uploadFile, setUploadFile] = useState([]);
    // 썸네일
    const [previewImages, setPreviewImages] = useState([]);
    // error
    const [error, setError] = useState({})
    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeIssue = (e) => {
        issue[e.target.name] = e.target.value
        setIssue({...issue})
    }
    // Add 버튼 클릭시
    const handleClickAdd = async () => {
        // 기존 formData.append로 했더니 객체가 안들어가서 방법을 바꿈.
        const formData = {
            pno: pno,
            title: issue.title,
            content: issue.content,
            projectMember: projectSelectMembers,
            priority: issue.priority || "LOW"
        };
        setFetching(true);
        // formData로 등록

        const response = await postAdd(formData);
        console.log(response)
        if (response.success) {
            const ino = response.data.ino;
            setRstatus(response.data.status)
            if (uploadFile.length > 0) {
                for (const file of uploadFile) {
                    const formData = new FormData();
                    formData.append("ino", ino);
                    formData.append("file", file);

                    const data = await postUploadFile(formData);
                    setResult(data);
                    console.log(data);
                }
            }
        } else {
            setError(response.errors)
        }
        setFetching(false)
    }
    // 모달창 닫기
    const closeModal = (pno) => {
        setResult(null)
        navigate({
            pathname: `../project/issue/${pno}`
        })
    }
    // 이미지 변경시
    const handleChangeImage = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        if (invalidFiles.length > 0) {
            alert(`이미지 파일만 업로드 가능합니다. 잘못된 파일: ${invalidFiles.join(", ")}`);
            event.target.value = "";
        }

        // 유효한 파일만 업로드 목록에 추가
        setUploadFile(validFiles);

        // 유효한 파일로만 미리보기 생성
        const previews = validFiles.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        });

        Promise.all(previews).then((images) => {
            setPreviewImages(images);
        });
    };


    // ProjectMember 선택되면 값 가져와서 세팅함.
    useEffect(() => {
        if (issue.projectMember > 0) {
            getOneMember(issue.projectMember, pno).then(data => {
                setProjectSelectMembers(data)
            })
        } else {
            setProjectSelectMembers({})
        }
    }, [issue.projectMember, pno])

    // pno로 연관된 ProjectMemberList 가져옴
    useEffect(() => {
        getList(pno).then(data => {
            setProjectMembers(data);
        });
    }, [pno])

    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <ResultModal
                isOpen={result === "SUCCESS" || rstatus === "SUCCESS"}
                content="이슈 등록 완료"
                callbackFn={() => closeModal(pno)}
            />
            <Row>

                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            이슈 생성
                        </CardTitle>
                        <CardBody>

                            <Form>
                                <FormGroup>
                                    <Label for="title">이슈 제목 {error.title &&
                                        <small style={{color: "red"}}>{error.title}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        placeholder="제목을 입력하세요"
                                        onChange={handleChangeIssue}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">담당자 선택 </Label>
                                    <Input
                                        id="projectMember"
                                        name="projectMember"
                                        type="select"
                                        onChange={handleChangeIssue}
                                    >
                                        {projectMembers.map(projectMember => (
                                            <option key={projectMember.mno}
                                                    value={projectMember.mno}>
                                                {MEMBER_TEAM_KOR[projectMember.team]} - {projectMember.name} {MEMBER_ROLE_KOR[projectMember.memberRole]}
                                            </option>
                                        ))}
                                        <option defaultValue={0}>
                                            선택안함(공통사항)
                                        </option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label>우선순위 </Label>
                                    <Input
                                        type="select"
                                        name="priority"
                                        onChange={handleChangeIssue}
                                    >
                                        <option value={""}>
                                            미선택시 우선순위 낮음으로 등록됩니다.)
                                        </option>
                                        <option value={"LOW"}>
                                            낮음
                                        </option>
                                        <option value={"MEDIUM"}>
                                            중간
                                        </option>
                                        <option value={"HIGH"}>
                                            높음
                                        </option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="content">이슈 내용 {error.content &&
                                        <small style={{color: "red"}}>{error.content}</small>}</Label>
                                    <Input id="content" name="content" type="textarea"
                                           onChange={handleChangeIssue} rows={10} placeholder={"아래 양식에 맞춰 작성 해주세요"}/>
                                </FormGroup>
                                <div style={{marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "10px"}}>
                                    <h5>이슈 내용 작성 예시</h5>
                                    <ul>
                                        <li><strong>이슈 설명:</strong> 로그인 페이지에서 로그인 시도가 오래 걸리며, 페이지가 10초 이상 로딩됩니다.</li>
                                        <li><strong>재현 단계:</strong>
                                            <ul>
                                                <li>1. 로그인 페이지로 이동한다.</li>
                                                <li>2. 사용자 이름과 비밀번호를 입력한다.</li>
                                                <li>3. 로그인 버튼을 클릭한다.</li>
                                                <li>4. 페이지가 10초 이상 로딩된다.</li>
                                            </ul>
                                        </li>
                                        <li><strong>예상 결과:</strong> 로그인 페이지가 3초 이내에 정상적으로 로드되어야 한다.</li>
                                        <li><strong>실제 결과:</strong> 로그인 페이지 로딩 시간이 10초 이상 걸린다.</li>
                                        <li><strong>기타 사항:</strong> 최근 배포 후 문제가 발생한 것으로 보임.</li>
                                        <li><strong>담당자:</strong> 홍길동 (개발자)</li>
                                    </ul>
                                </div>
                                <FormGroup>
                                    <Label for="image"> 이미지 등록 </Label>
                                    <Input name="image" type="file" multiple={true}
                                           onChange={handleChangeImage}></Input>
                                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px"}}>
                                        {previewImages.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`미리보기 ${index + 1}`}
                                                style={{width: "250px", height: "250px"}}
                                            />
                                        ))}
                                    </div>
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
export default IssueIssueRegisterComponent;