import React, {useState, useEffect} from "react";
import {Button, FormGroup, Label, Input, Form} from "reactstrap";
import {deleteForeverOne, deleteOne, getOne, putOne} from "../../api/ProjectApi";
import useProjectMove from "../../hooks/useProjectMove";
import ResultModal from "../projectModal/ResultModal";
import {getCookie} from "../../util/cookieUtil";

const initState = {
    pno: 0,
    title: "",
    regDate: "",
    updateDate: "",
    startDate: "",
    dueDate: "",
    content: "",
    status: 0,
    version: "",
    isDeleted: false
}

const UpdateComponent = ({pno}) => {
    // 이동관련 함수
    const {moveToList, moveToRead} = useProjectMove()
    // 결과 창 모달
    const [result, setResult] = useState(null)
    // project객체 관라ㅣ
    const [project, setProject] = useState({...initState});
    // 값 변경시 마다 세팅
    const handleChangeProject = (e) => {
        project[e.target.name] = e.target.value
        setProject({...project})
    }
    // 수정 버튼 클릭시
    const handleClickModify = () => {
        putOne(project, pno).then(data => {
            setResult(data)
        })
    }
    // 삭제 버튼 클릭시
    const handleClickDelete = () => {
        if (window.confirm("삭제후 복원 불가능합니다. 정말 삭제하시겠습니까?")) {
            if (project.isDeleted === false) {
                deleteOne(pno).then(data => {
                    setResult(data)
                })
            } else if (project.isDeleted === true) {
                deleteForeverOne(pno).then(data => {
                    setResult(data)
                })
            }
        }
    }
    const token = getCookie("member")
    // 모달창 닫음.
    const closeModal = () => {
        if (result === "SUCCESS") {
            setResult(null)
            moveToRead(pno, token?.mno)
        } else {
            setResult(null)
            moveToList({page: 1})
        }
    }

    // 프로젝트의 상태를 가져와 변수 설정
    let status = project.status
    // enum.string을 안하면 프론트에서 이렇게 설정을 해줘야함.
    if (status === "COMPLETE") {
        status = 1
    } else if (status === "PROGRESS") {
        status = 0
    } else if (status === "RETIRE") {
        status = 2
    }

    // api 호출로 기본 값 가져옴
    useEffect(() => {
        getOne(pno).then(data => {
            setProject(data)
        })
    }, [pno])


    return (
        <div className="project-details">

            <h5>프로젝트 정보 수정</h5>
            <ResultModal
                isOpen={result === "SUCCESS" || result === "DELETE" || result === "DELETE FOREVER"}
                content={result === "SUCCESS"
                    ? "프로젝트 수정이 완료되었습니다."
                    : result === "DELETE"
                        ? "프로젝트 삭제가 완료되었습니다."
                        : "프로젝트 영구삭제가 완료되었습니다."
                }
                callbackFn={closeModal}
            />
            <Form>
                <FormGroup>
                    <Label>제목</Label>
                    <Input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleChangeProject}
                    />
                </FormGroup>
                <div className={"d-flex"}>
                    <FormGroup style={{ width:630 }}>
                        <Label>시작일</Label>
                        <Input
                            type="date"
                            name="startDate"
                            value={project.startDate}
                            onChange={handleChangeProject}
                            style={{backgroundColor: '#f0f0f0'}}
                            readOnly
                        />
                    </FormGroup>
                    <FormGroup style={{ width:630 }}>
                        <Label>종료일</Label>
                        <Input
                            type="date"
                            name="dueDate"
                            value={project.dueDate}
                            onChange={handleChangeProject}
                        />

                    </FormGroup>
                </div>
                <FormGroup>
                    <Label>주요 내용</Label>
                    <Input
                        type="textarea"
                        name="content"
                        value={project.content}
                        onChange={handleChangeProject}
                    />
                </FormGroup>
                <FormGroup>
                    <Label>진행 상태</Label>
                    <Input
                        type="select"
                        name="status"
                        onChange={handleChangeProject}
                        value={status}
                    >
                        <option value={0}>
                            진행중
                        </option>
                        <option value={1}>
                            완료
                        </option>
                        <option value={2}>
                            폐기
                        </option>
                    </Input>

                </FormGroup>
                <FormGroup>
                    <Label>Version</Label>
                    <Input
                        type="text"
                        name="version"
                        value={project.version}
                        onChange={handleChangeProject}
                        readOnly={true}
                    />
                </FormGroup>

                <div className="button-group">
                    <Button color="primary" className={"me-2"} onClick={handleClickModify}>수정</Button>
                    <Button color="danger" className={"me-2"} onClick={handleClickDelete}
                    > {project.isDeleted === true ? "영구 삭제" : "삭제"}
                    </Button>
                    <Button color="secondary" className={"me-2"} onClick={() => moveToList()}>List</Button>
                </div>
            </Form>

        </div>

    );

}

export default UpdateComponent;