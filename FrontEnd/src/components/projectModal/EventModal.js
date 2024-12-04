// ResultModal.js
import React, {useState} from 'react';
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
import {postAdd} from "../../api/ProjectEventApi";

const initState = {
    eno:0,
    pno:0,
    title:0,
    start:"",
    end:""
}

function EventModal({ isOpen, callbackFn, pno }) {
    // event 객체 값 관라
    const [event, setEvent] = useState({...initState});
    // error
    const [error, setError] = useState({});
    // 값 변경시 event객체값 업데이트
    const handleChangeProject = (e) => {
        event[e.target.name] = e.target.value
        setEvent({...event})
        console.log(e.target.value);
    }
    // 등록 버튼 클릭
    const handleClickAdd = async () => {

        const formData = new FormData();
        formData.append("title", event.title);
        formData.append("start", event.start);
        formData.append("end", event.end);
        formData.append("pno", pno);
        console.log(formData);

        const response = await postAdd(formData)
        if (response.success) {
            callbackFn()
        } else {
            setError(response.errors)
        }


    }

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
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="end">종료일 {error.end &&
                                                <small style={{color: "red"}}>{error.end}</small>}
                                                {error.endDateAfterStartDate && <small style={{color: "red"}}>{error.endDateAfterStartDate}</small>}
                                            </Label>

                                            <Input
                                                id="end"
                                                name="end"
                                                placeholder="yyyy-MM-dd"
                                                type="date"
                                                onChange={handleChangeProject}
                                            />
                                        </FormGroup>
                                        <Button type={"button"} onClick={handleClickAdd}>등록</Button>
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
}

export default EventModal;
