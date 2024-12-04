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
import {postAdd} from "../../api/DocumentRejectApi";

const initState = {
    drno: 0,
    rejector: "",
    reason: "",
    documentDTO: {}
}

function DocumentRejectModal({ isOpen, handleReject,callbackFn, document, approver }) {
    // event 객체 값 관라
    const [documentReject, setDocumentReject] = useState({...initState});
    // 값 변경시 event객체값 업데이트
    const handleChangeProject = (e) => {
        documentReject[e.target.name] = e.target.value
        setDocumentReject({...documentReject})
        console.log(e.target.value);
    }

    // 등록 버튼 클릭
    const handleClickAdd = () => {
        if (!documentReject.reason) {
            let errorMessage = "다음 필드는 필수 입력 사항입니다:\n";
            if (!documentReject.reason) errorMessage += "- 반려 사유\n";
            alert(errorMessage); // alert 창으로 오류 메시지 표시
            return; // null 값이 있을 경우 이후 코드 실행 중단
        }
        const formData = {
            reason: documentReject.reason,
            rejector: approver,
            documentDTO: document
        }
        console.log(formData);
        postAdd(formData).then(data => { // 서버에서 data 가져옴
            console.log(data)
            handleReject()
        })

    }

    const closeModal = () => {
        callbackFn()
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
                                    반려 사유 등록
                                </CardTitle>
                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            <Label for="title">반려자</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                type="text"
                                                readOnly={true}
                                                value={approver}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="reason">반려사유</Label>
                                            <Input
                                                id="reason"
                                                name="reason"
                                                type="textarea"
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
                <Button color="secondary" onClick={closeModal}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DocumentRejectModal;
