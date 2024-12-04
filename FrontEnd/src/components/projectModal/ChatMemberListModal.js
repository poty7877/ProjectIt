
import React from 'react';

import {
    Button,
    FormGroup,
    Input,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
} from "reactstrap";

function ChatMemberListModal({isOpen, callbackFn, writer}) {
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
        팀장: "팀장"
    };

    const MEMBER_TEAM_KOR = {
        AWAIT: "대기",
        TECHNIC: "기술팀",
        PERSONNEL: "인사팀",
        ACCOUNTING: "회계팀",
        FINANCIAL_MANAGEMENT: "재무관리팀",
        팀장: ""
    }
console.log(writer);
    return (
        <Modal isOpen={isOpen} toggle={callbackFn} style={{width:`50%`}}>
            <ModalHeader toggle={callbackFn}>참여 목록</ModalHeader>
            <ModalBody>
                <div>
                    {writer.map((pm) => (
                    <FormGroup>
                        <Input
                            type="text"
                            value={`${pm.name}  ${MEMBER_ROLE_KOR[pm.memberRole]} - ${MEMBER_TEAM_KOR[pm.team]}`}
                            readOnly
                        />
                    </FormGroup>
                    ))}
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

export default ChatMemberListModal;
