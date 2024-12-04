// ResultModal.js
import React, {useEffect, useState} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Col,
    Card,
    CardTitle,
    CardBody,
    Form,
    FormGroup, Label, Input, Row
} from 'reactstrap';
import {deleteOne, getOne, putOne} from "../../api/ProjectEventApi";

const initState = {
    eno: 0,
    pno: 0,
    isFirst: false,
    title: 0,
    start: "",
    end: ""
}

const EventReadModal = React.memo(function EventReadModal({isOpen, callbackFn, pno, eno, isProjectMember}) {

    console.log(eno);
    // event값 세팅
    const [event, setEvent] = useState({...initState});
    // error
    const [error, setError] = useState({});

    // 이벤트 수정시
    const handleChangeProject = (e) => {
        if (!isProjectMember) {
            alert("수정 권한이 없습니다.");
        } else {
            setEvent(prevEvent => ({
                ...prevEvent,
                [e.target.name]: e.target.value // 객체의 속성을 안전하게 업데이트
            }));
        }
    };

    // 수정 버튼 클릭시
    const handleClickModify = async () => {
        const formData = new FormData();
        formData.append("eno", eno);
        formData.append("title", event.title);
        formData.append("start", event.start);
        formData.append("end", event.end);
        formData.append("isFirst", event.isFirst)
        formData.append("pno", pno);
        console.log(formData);

        const response = await putOne(formData, eno);
        if(response.success){
            setError({})
            callbackFn(event.isFirst)
        } else{
            setError(response.errors)
        }
    }

    // 삭제 버튼 클릭
    const handleClickDelete = () => {
        deleteOne(eno).then(data => {
            alert("삭제 완료!")
            callbackFn()
        })
    }

    // eno 초기값 api로 불러옴
    useEffect(() => {
        // eno가 존재하고, event.eno와 eno가 다르거나, isOpen이 true일 경우에만 로드
        if (eno && (event.eno !== eno || isOpen)) {
            getOne(eno).then(data => {
                setEvent(data);
            });
        }
    }, [eno, isOpen, event.eno]); // event.eno를 의존성 배열에 추가하여 eno가 변경될 때마다 다시 비교
    useEffect(() => {
            setError({}); // 모달이 닫히면 에러 상태 초기화
    }, [isOpen]); // 모달 열고 닫을 때마다 에러 상태 초기화


    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                <div>
                    <Row>
                        <Col>
                            {/* --------------------------------------------------------------------------------*/}
                            {/* Card-1*/}
                            {/* --------------------------------------------------------------------------------*/}
                            <Card>
                                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                                    <i className="bi bi-bell me-2"> </i>
                                    일정 등록
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
                                                value={event.title}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="start">시작일 {error.start &&
                                                <small style={{color: "red"}}>{error.start}</small>}</Label>
                                            <Input
                                                id="start"
                                                name="start"
                                                placeholder="yyyy-MM-dd"
                                                type="date"
                                                onChange={handleChangeProject}
                                                value={event.start}
                                                readOnly={event.isFirst}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="end">종료일 {error.end &&
                                                <small style={{color: "red"}}>{error.end}</small>}
                                                {error.endDateAfterStartDate && <small style={{color: "red"}}>{error.endDateAfterStartDate}</small>}</Label>
                                            <Input
                                                id="end"
                                                name="end"
                                                placeholder="yyyy-MM-dd"
                                                type="date"
                                                onChange={handleChangeProject}
                                                value={event.end}
                                            />
                                        </FormGroup>
                                        {isProjectMember &&
                                            <Button type={"button"} className={"btn btn-primary"}
                                                    onClick={handleClickModify}>수정</Button>}
                                        {isProjectMember &&
                                            <Button type={"button"} className={"btn btn-secondary"}
                                                    onClick={handleClickDelete}
                                                    disabled={event.isFirst}>{event.isFirst ? "삭제불가" : "삭제"}</Button>}
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={callbackFn}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
});

export default EventReadModal;
