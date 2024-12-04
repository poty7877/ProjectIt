// ResultModal.js
import React from 'react';

import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
} from "reactstrap";

function PartnersReadModal({isOpen, callbackFn, partner}) {
    return (
        <Modal isOpen={isOpen} toggle={callbackFn} partner={partner}>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                <div>
                    <div>
                        <FormGroup>
                            <Label>회사명</Label>
                            <Input
                                type="text"
                                placeholder="이름 입력"
                                name="comName"
                                value={partner?.comName || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>대표자</Label>
                            <Input
                                type="text"
                                placeholder="이름 입력"
                                name="ceoName"
                                value={partner?.ceoName || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>사업자번호</Label>
                            <Input
                                type="text"
                                placeholder="ex) 000-11-22222"
                                name="coNum"
                                value={partner?.coNum || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>전화번호</Label>
                            <Input
                                type="text"
                                placeholder="ex) 010-1111-2222"
                                name="phone"
                                value={partner?.phone || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>홈페이지</Label>
                            <Input
                                type="text"
                                placeholder="ex) www.example.com"
                                name="site"
                                value={partner?.site || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>주소</Label>
                            <Input
                                type="text"
                                placeholder="ex) 경기도 수원시 ㅇㅇㅇ"
                                name="address"
                                value={partner?.address || ""}
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>업태</Label>
                            <Input
                                type="text"
                                placeholder="ex) 도소매"
                                name="biztype"
                                value={partner?.bizType || ""}
                                readOnly
                            />
                        </FormGroup>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={callbackFn}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default PartnersReadModal;
