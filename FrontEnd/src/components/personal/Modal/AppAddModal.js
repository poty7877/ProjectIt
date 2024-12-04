import  { Card, Row, Col, CardTitle, CardBody, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import useCustomLink from "../../../hooks/useCustomLink";
import { add } from "../../../api/applicationAPI";
import FetchingModal from "../../common/FetchingModal";

const AppAddModal = ({ isOpen, closeModal }) => {
    const initState = {
        name: '',
        phoneNum: '',
        mail: '',
        teamName: '기술부',
        files: null, // 파일은 null로 초기화
    };

    const [memberS, setMember] = useState(initState);
    const [fetching, setFetching] = useState(false);
    const { moveToMain } = useCustomLink();
    const uploadRef = useRef();

    useEffect(() => {
        if (isOpen) {
            console.log("모달 열림");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMember((prevState) => ({
            ...prevState,
            [name]: value, // 해당 필드 업데이트
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
    
        // 파일이 존재하는지 확인하고 상태에 저장
        if (files && files.length > 0) {
            setMember((prevState) => ({
                ...prevState,
                [name]: files, // 파일 배열을 상태에 저장
            }));
            console.log(memberS.files)
        }
    };

    const handleClickAdd = async (e) => {
        const formData = new FormData();

        const files = memberS.files
        
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            // 다른 입력 값들도 FormData에 추가
            formData.append("name", memberS.name);
            formData.append("phoneNum", memberS.phoneNum);
            formData.append("mail", memberS.mail);
            formData.append("organizationTeam", memberS.teamName);

            try {

                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }                

                // add API 호출
                const data = await add(formData);
                console.log("register success", data);

                if (data.error) {
                    alert("오류가 발생되었습니다.");
                } else {
                    alert("정보 입력 성공");
                    closeModal();
                }
            } catch (error) {
                console.error("Error Modifying member: ", error);
                alert("정보 수정 중 오류 발생");
            }
        
    };

    return (
        <Modal isOpen={isOpen} toggle={closeModal} backdrop="static" size="flex">
            {fetching ? (
                <FetchingModal />
            ) : (
                <>
                    <ModalHeader toggle={closeModal}>사원 정보 입력</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <Label for="Name">이름</Label>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            id="Name"
                                                            name="name"
                                                            placeholder="name"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <Label for="phoneNum">전화번호</Label>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            id="phoneNum"
                                                            name="phoneNum"
                                                            placeholder="000-0000-0000"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <Label for="mail">메일</Label>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            id="mail"
                                                            name="mail"
                                                            placeholder="example@mail.com"
                                                            type="text"
                                                            onChange={handleChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <Label for="teamName">지원부서</Label>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            id="teamName"
                                                            name="teamName"
                                                            type="select"
                                                            onChange={handleChange}
                                                        >
                                                            <option value={"기술부"}>기술부</option>
                                                            <option value={"인사부"}>인사부</option>
                                                            <option value={"회계부"}>회계부</option>
                                                            <option value={"재무관리팀"}>재무관리팀</option>
                                                        </Input>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <Label for="files">이력서</Label>
                                                    </td>
                                                    <td>
                                                        <Input
                                                            id="files"
                                                            name="files"
                                                            type="file"
                                                            ref={uploadRef}
                                                            multiple
                                                            onChange={handleFileChange}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colSpan={2}>
                                                        <Button color="primary" onClick={handleClickAdd}>입력하기</Button>
                                                        <Button color="secondary" onClick={closeModal}>닫기</Button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </ModalBody>
                </>
            )}
        </Modal>
    );
};

export default AppAddModal;
