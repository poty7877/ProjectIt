import { useState } from "react";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Table } from "reactstrap";
import FetchingModal from "../common/FetchingModal";
import ResultModal from "../common/ResultModal";
import useDistMove from "../../hooks/useDistMove";
import { registAccount } from "../../api/LicenseApi";
import AccountInputModal from "../distModal/AccountInputModal";


const initState = {//ListAccountIPDTO - no asset
    siteName: '',
    siteUrl: '',
    useState: true,
    userAuthentication: false,
    accountObjectList: []
}




const AccountRegisterComponent = () => {

    const [account, setAccount] = useState({ ...initState }); //등록용 객체 set용

    const [inputList, setInputList] = useState([]); //입력 정보 담을 배열
    const [fetching, setFetching] = useState(false); //진행모달(로딩)
    const [result, setResult] = useState(null); //결과모달창
    const [inputModal, setInputModal] = useState(false); //입력용 모달

    const { moveToAccountList } = useDistMove(); //페이지 이동


    //입력값 변경시 객체 값 세팅(account)
    const handleChangeaccount = (e) => {
        const { name, value } = e.target;
        setAccount((prev) => ({ ...prev, [name]: value }));
    };

    //모달창 열기(info모달)
    const inputModalOpen = () => {
        console.log("버튼작동");
        setInputModal(true);
    };

    //모달창 닫기(계정 입력 결과)
    const handleInfoSave = (inputAccount) => {
        if(inputAccount){
            setInputList((prev) => [...prev, inputAccount]); //리스트 추가
        }
        setInputModal(false);
    };


    //전송용 formdata->axios
    const handleClickAdd = (e) => {
        e.preventDefault();
        console.log("등록하기 실행");
        if (!account.siteName || !account.siteUrl) {
            alert("사이트 명과 URL을 입력해주세요.");
            return;
        }

        const formData = {//ListAccountIPDTO
            siteName : account.siteName,
            siteUrl : account.siteUrl,
            useState : account.useState,
            userAuthentication : account.userAuthentication,
            accountObjectList : inputList
        }

        const sendData = JSON.stringify(formData);

        console.log("등록 : " + JSON.stringify(sendData));
        setFetching(true)
        registAccount(sendData).then(data => {
            setFetching(false)
            setResult(data.result)
        }).catch((error)=>{
            setFetching(false);
            console.error(error);
        });
    };


    //모달창 닫기(결과확인 후)
    const closeModal = () => {
        setResult(null);
        moveToAccountList({ page: 1 });
    }


    return (
        <div>
            {fetching ? <FetchingModal/> : <></>}
            {result ? <ResultModal
                isOpen={result > 0 || result !== ''}
                content={"등록이 완료되었습니다."}
                callbackFn={closeModal}></ResultModal> : <></>}
            <Form>
                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        계정 등록</CardTitle>
                    <CardBody>
                        <FormGroup>
                            <Label for="siteName">사이트 명</Label>
                            <Input id="siteName" name="siteName" type="text" onChange={handleChangeaccount} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="siteUrl">URL</Label>
                            <Input id="siteUrl" name="siteUrl" type="text" onChange={handleChangeaccount} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="userAuthentication">실명인증여부</Label>
                            <Input type="select" id="userAuthentication" name="userAuthentication" onChange={handleChangeaccount} >
                                <option value={false}>필요없음</option>
                                <option value={true}>인증필요</option>
                            </Input>
                        </FormGroup>
                    </CardBody>
                </Card>

                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        사용자 정보<span className="text-end">
                            <Button className="btn " color="info" onClick={inputModalOpen}>사용자 추가</Button>
                            <AccountInputModal isOpen={inputModal} callbackFn={handleInfoSave} ></AccountInputModal></span></CardTitle>
                    <CardBody>
                        <Table bordered striped>
                            <thead>
                            <tr>
                                <th width="20%">계정구분</th>
                                <th width="40%">아이디</th>
                                <th width="40%">패스워드</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inputList.map((item, index) => (
                                <tr key={index} >
                                    <td>{item.accountType}</td>
                                    <td>{item.ac_id}</td>
                                    <td>{item.ac_pw}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                <div className="text-center">
                    <Button className="btn" color="primary" onClick={handleClickAdd} style={{ marginRight: 10 }}>등록하기</Button>
                    <Button className="btn" color="secondary" onClick={moveToAccountList}>리스트</Button></div>
            </Form>
        </div>
    );
}
export default AccountRegisterComponent;