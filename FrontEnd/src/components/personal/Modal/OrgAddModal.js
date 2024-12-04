import { Card, Row, Col, CardBody, Label, Input, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useEffect, useRef, useState } from "react";
import useCustomLink from "../../../hooks/useCustomLink";

import FetchingModal from "../../common/FetchingModal";
import {readData, registerAccount} from "../../../api/memberApi";

const AppAddModal = ({ isOpen, closeModal }) => {
    const initState = {
        mail: '',
        name: '',
        phoneNum: '',
    };

    const [memberS, setMember] = useState(initState);
    const [fetching, setFetching] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // 버튼 상태 관리
    const { moveToMain } = useCustomLink();
    const uploadRef = useRef();

    useEffect(() => {
        if (isOpen) {
            console.log("모달 열림");
        }
    }, [isOpen]);

    useEffect(() => {
        // 폼 유효성 검사
        const checkFormValidity = async () => {
            const isValid = await isFormValid();
            setIsButtonDisabled(!isValid); // 유효성 검사 후 버튼 상태 업데이트
        };

        checkFormValidity();
    }, [memberS]); // `memberS`가 변경될 때마다 유효성 검사



    // 이메일 형식 확인 함수
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@company\.com$/;  // company.com 포함 여부 확인
        return regex.test(email);
    };

    // 전화번호 형식 맞게 수정하는 함수
    const formatPhoneNumber = (value) => {
        // 숫자만 추출
        const cleaned = value.replace(/\D/g, '');

        // 10자리 또는 11자리 숫자에 하이픈을 추가
        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 7) {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
        } else {
            return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 전화번호 입력시 하이픈 추가
        if (name === "phoneNum") {
            const formattedValue = formatPhoneNumber(value);
            setMember((prevState) => ({
                ...prevState,
                [name]: formattedValue,
            }));
        } else {
            setMember((prevState) => ({
                ...prevState,
                [name]: value, // 해당 필드 업데이트
            }));
        }
    };

    // 버튼 활성화 여부를 결정하는 함수
    const isFormValid = async () => {
        const emailExists = await readData(memberS.mail);
        const nameExists = await readData(memberS.name);

        return (
            isValidEmail(memberS.mail) && // 이메일이 올바른지
            memberS.name.trim() !== '' && // 이름이 비어있지 않은지
            memberS.phoneNum.trim() !== '' &&// 전화번호가 비어있지 않은지
            nameExists === 0 &&
            emailExists === 0 //동일한 이메일이 잇는지

        );
    };

    // 각 입력 필드에 대해 빨간색 테두리를 적용하는 조건을 추가
    const getInputStyle = (fieldName) => {
        if (fieldName === 'mail' && !isValidEmail(memberS.mail)) {
            return { borderColor: 'red' };
        }
        if (fieldName === 'name' && memberS.name.trim() === '') {
            return { borderColor: 'red' };
        }
        if (fieldName === 'phoneNum' && memberS.phoneNum.trim() === '') {
            return { borderColor: 'red' };
        }
        return {}; // 유효한 경우 기본 스타일
    };

    const handleClickAdd = async (e) => {


        try {
            // add API 호출
            const data = await registerAccount(memberS);
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
                    <ModalHeader toggle={closeModal}> 신규사원 추가 </ModalHeader>
                    <ModalBody style={{textAlign: "center", justifyItems:"center"}}>
                        <Row>
                            <Col>
                                <Card>
                                    <CardBody>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <Label for="mail">계정</Label>
                                                </td>
                                                <td>
                                                    <Input
                                                        id="mail"
                                                        name="mail"
                                                        placeholder="aaa@company.com"
                                                        type="email"
                                                        onChange={handleChange}
                                                        style={getInputStyle('mail')} // 이메일 유효성에 맞는 스타일 적용
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <Label for="Name">이름</Label>
                                                </td>
                                                <td>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        placeholder="name"
                                                        type="text"
                                                        onChange={handleChange}
                                                        style={getInputStyle('name')} // 이름 유효성에 맞는 스타일 적용
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
                                                        style={getInputStyle('phoneNum')} // 전화번호 유효성에 맞는 스타일 적용
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td colSpan={2}>
                                                    <Button
                                                        color="primary"
                                                        onClick={handleClickAdd}
                                                        disabled={isButtonDisabled} // 폼이 유효하지 않으면 버튼 비활성화
                                                    >
                                                        입력하기
                                                    </Button>
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
