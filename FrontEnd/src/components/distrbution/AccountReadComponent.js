import { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Form, FormGroup, Input, Label, Table } from "reactstrap";

import useDistMove from "../../hooks/useDistMove";
import { getOneAccount } from "../../api/LicenseApi";
import FetchingModal from "../common/FetchingModal";




const initState = {//ListAccountOPDTO - no asset
    siNum: 0,
    siteName: '',
    siteUrl: '',
    useState: true,
    userAuthentication: false,
    accountObjectList: []
}



const AccountReadComponent = ({ siNum }) => {
    const [account, setAccount] = useState({ ...initState }); //등록용 객체 set용
    const [fetching, setFetching] = useState(false); //진행모달(로딩)
    const [inputList, setInputList] = useState([]);

    const { moveToAccountList } = useDistMove(); //페이지 이동
    useEffect(() => {
        setFetching(true);
        getOneAccount(siNum).then(data => {
            setAccount(data);
            setInputList(data.accountObjectList);
            setFetching(false);

        })
            .catch((error) => {
                console.log(error);
                setFetching(false);
            });

    }, [siNum]);


    return (
        <div>
            {fetching ? <FetchingModal /> : <></>}
            <Form>
                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        계정 상세보기</CardTitle>
                    <CardBody>
                        <FormGroup>
                            <Label for="siteName">사이트 명</Label>
                            <Input id="siteName" name="siteName" type="text" value={account.siteName} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="siteUrl">URL</Label>
                            <Input id="siteUrl" name="siteUrl" type="text" value={account.siteUrl} readOnly />
                        </FormGroup>
                        <FormGroup>
                            <Label for="userAuthentication">실명인증여부</Label>
                            <Input type="text" id="userAuthentication" name="userAuthentication" value={account.userAuthentication ? "인증필요" : "필요없음"} readOnly />
                        </FormGroup>
                    </CardBody>
                </Card>

                <Card>
                    <CardTitle tag="h5" className="d-flex justify-content-between align-items-center border-bottom p-3 mb-0">
                        사용자 정보</CardTitle>
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
                    <Button className="btn" color="secondary" onClick={moveToAccountList}>리스트</Button></div>
            </Form>
        </div>
    );
};
export default AccountReadComponent;