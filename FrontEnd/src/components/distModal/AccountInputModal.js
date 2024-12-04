
import { useState } from "react"
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const InitState = {//inputAccountectIPDTO
    ac_id: '',
    ac_pw: '',
    accountType: '등록자'
}


function AccountInputModal({ isOpen, callbackFn }) {


    const [inputAccount, setInputAccount] = useState({ ...InitState }); //개별객체 세팅용
    

    //입력값 변경시 객체 값 세팅(inputAccount)
    const handleChangeinputAccount = (e) => {
        const { name, value } = e.target;
        setInputAccount((prev) => ({ ...prev, [name]: value }));
    }

    const handleSave = (e) =>{
        e.preventDefault();
        callbackFn(inputAccount);
        setInputAccount(InitState);
    }


    return (
        <Modal isOpen={isOpen} toggle={() =>callbackFn()} size="md" >
            <ModalHeader toggle={() =>callbackFn()}>사용자 정보 입력</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label for="accountType">계정구분</Label>
                        <Input id="accountType" name="accountType" type="select" value={inputAccount.accountType} onChange={handleChangeinputAccount} >
                            <option>등록자</option>
                            <option>사용자</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="ac_id">아이디</Label>
                        <Input id="ac_id" name="ac_id" type="text" value={inputAccount.ac_id} onChange={handleChangeinputAccount} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="ac_pw">패스워드</Label>
                        <Input id="ac_pw" name="ac_pw" type="text" value={inputAccount.ac_pw} onChange={handleChangeinputAccount} /><span className="small" style={{color: "#980000"}}><p>업무용 계정으로 타인에게 공유될 수 있습니다.  개인적인 패스워드는 등록할 수 없습니다.</p></span>
                    </FormGroup>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={handleSave}>입력완료</Button>
            </ModalFooter>
        </Modal>
    );
}

export default AccountInputModal;