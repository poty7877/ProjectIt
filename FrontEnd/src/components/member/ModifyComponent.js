import {useEffect, useRef, useState} from "react";
import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    FormGroup,
    Label,
    Input, Button,
} from "reactstrap";
import {BankCode, modifyMember, registerMember, statusRead} from "../../api/memberApi";
import { getCookie } from "../../util/cookieUtil";
import useCustomLink from "../../hooks/useCustomLink";
import useCustomLogin from "../../hooks/useCustomLogin";
import {getFiles, getFiles2} from "../../api/memberApi";

const ModifyComponent = () => {
    const initState = {
        antecedents: [],
        birth: '',
        children_count: '0',
        education: '',
        marital_status: '',
        email: '',
        memberRoleList: '',
        mno: '',
        pw: '',
        start_date: '',
        name: '',
        qualifications: [],
        sex: '',
        tel: '',
        files: null,
        files2: null,
        account: '',
        bankCode:'',
    };

    const [Member, setMember] = useState(initState);
    const [fetching, setFetching] = useState(false);
    const [password, setPassword] = useState(''); // Original password
    const [password2, setPassword2] = useState(''); // Password check
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const token = getCookie('member'); // member라는 이름을 가진 쿠키 추출
    const uploadRef = useRef();
    const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 상태
    const [previewImage2, setPreviewImage2] = useState(null); // 미리보기 이미지 상태
    const {moveToLogin} = useCustomLogin()
    const { moveToMain } = useCustomLink();
    const [imageUrl, setImageUrl] = useState(null); // 이미지 URL 상태 추가
    const [imageUrl2, setImageUrl2] = useState(null); // 이미지 URL 상태 추가
    const mno = token.mno;
    //은행코드
    const [bankCodes, setBankCodes] = useState([]);
    const [selectedBankCode, setSelectedBankCode] = useState('');

    useEffect(() => {
        const fetchData = async (mno) => {
            setFetching(true);
            console.log(mno);

            try {
                const res = await statusRead(mno);
                console.log(res.qualifications);
                const cleandData = replaceNullsWithEmptyString(res);
                const qArray = cleandData.qualifications.split(",").map(item => item.trim())
                console.log(qArray);
                const qAntecedents = cleandData.antecedents.split(",").map(item => item.trim())
                console.log(qAntecedents);
                cleandData.qualifications = qArray;
                cleandData.antecedents = qAntecedents;
                console.log(cleandData);
                setMember(cleandData);
                const bankList = await BankCode();
                console.log(bankList);
                setBankCodes(bankList);

                if (cleandData.uploadFileNames && cleandData.uploadFileNames.length > 0) {
                    const blob = await getFiles(cleandData.uploadFileNames[0]);
                    setPreviewImage(URL.createObjectURL(blob));

                    //const updatedFiles = [...Member.files, blob];

                    // Member.files 배열이 존재하지 않으면 빈 배열로 초기화
                    const updatedFiles = Array.isArray(Member.files) ? [...Member.files, blob] : [blob];


                    setMember((prevMember) =>({
                        ...prevMember,
                            files: updatedFiles
                }));

                if (cleandData.uploadFileNames2 && cleandData.uploadFileNames2.length > 0) {
                    const blob2 = await getFiles2(cleandData.uploadFileNames2[0]);
                    setPreviewImage2(URL.createObjectURL(blob2));

                        //const updatedFiles = [...Member.files, blob];

                        // Member.files 배열이 존재하지 않으면 빈 배열로 초기화
                    const updatedFiles2 = Array.isArray(Member.files2) ? [...Member.files2, blob2] : [blob2];


                    setMember((prevMember) => ({
                        ...prevMember,
                        files2: updatedFiles2
                        }));
                    }



                }
            } catch (error) {
                console.error("데이터를 가져오는 중 오류 발생:", error);
            } finally {
                setFetching(false);
            }
        };
            // token이 있고 mno가 있을 때만 fetchData 호출
            if (token && token.mno) {
                fetchData(token.mno);
            }
    }, []);

    // 재귀적으로 객체 또는 배열 내의 모든 null 값을 ""으로 변경하는 함수
    const replaceNullsWithEmptyString = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(replaceNullsWithEmptyString);  // 배열일 경우 각 항목에 대해 처리
        } else if (obj !== null && typeof obj === 'object') {
            // 객체일 경우 각 속성에 대해 처리
            return Object.keys(obj).reduce((acc, key) => {
                acc[key] = replaceNullsWithEmptyString(obj[key]);
                return acc;
            }, {});
        }
        return obj === null ? "" : obj;  // null 값은 빈 문자열로 변환, 그 외 값은 그대로 반환
    };


    const handleClickModify = async (e) => {
        // 비밀번호 확인이 필요할 때만 처리
        const form = new FormData();
        const files = Member.files;

        console.log(files.data);
        console.log(files.length);

        for(let i = 0; i< files.length; i++) {
            form.append("files", files[i]);
        }

        //계좌
        const files2 = Member.files2;
        for(let i = 0; i< files2.length; i++) {
            form.append("files2", files2[i]);
        }

        form.append('account', Member.account)
        form.append('bankCode', Member.bankCode)


        form.append('antecedents', Member.antecedents)
        form.append('birth', Member.birth)
        form.append('children_count', Member.children_count)
        form.append('education', Member.education)
        form.append('marital_status', Member.marital_status)
        form.append('email', Member.email)
        form.append('name', Member.name)
        form.append('qualifications', Member.qualifications)
        form.append('tel', Member.tel)
        form.append('sex', Member.sex)
        form.append('mno', token.mno)

        form.append('password', "test")//테스트용으로 강제 고정


        for (let [key, value] of form.entries()) {
            console.log(`${key}: ${value}`);
        }

        modifyMember(form, token.mno)
            .then((data) => {
                if (data.error) {
                    alert("오류가 발생되었습니다. 인사과에 문의해주세요");
                } else {
                    alert("정보 수정 성공");
                    moveToMain(); // 성공 시 메인 페이지로 이동
                }
            })
            .catch((error) => {
                console.error("회원 수정 실패", error);
            });
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

    const handleFileChange = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append(name, files[0]); // 첫 번째 파일을 FormData에 추가

            // 상태 업데이트 (파일을 상태에 저장)
            setMember((prevState) => ({
                ...prevState,
                [name]: files, // 상태에도 파일을 저장
            }));

            // 파일 미리보기
            const file = files[0]; // 첫 번째 파일만 미리보기
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 읽은 파일을 상태에 저장
            };
            reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기

            // FormData를 서버로 보내는 코드 예시 (여기서는 수정이 필요)
            // 예시:
            // axios.post('/api/upload', formData)
            //     .then(response => console.log(response))
            //     .catch(error => console.error(error));
        }
    };

    const handleFileChange2 = (e) => {
        const { name, files } = e.target;

        if (files && files.length > 0) {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append(name, files[0]); // 첫 번째 파일을 FormData에 추가

            // 상태 업데이트 (파일을 상태에 저장)
            setMember((prevState) => ({
                ...prevState,
                [name]: files, // 상태에도 파일을 저장
            }));

            // 파일 미리보기
            const file = files[0]; // 첫 번째 파일만 미리보기
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage2(reader.result); // 읽은 파일을 상태에 저장
            };
            reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기

            // FormData를 서버로 보내는 코드 예시 (여기서는 수정이 필요)
            // 예시:
            // axios.post('/api/upload', formData)
            //     .then(response => console.log(response))
            //     .catch(error => console.error(error));
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        // 전화번호 입력시 하이픈 추가
        if (name === "tel") {
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



    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword2(value);
        setIsPasswordMatch(value === password); // 비밀번호 확인과 원래 비밀번호 비교

    };

    const handlePasswordInputChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        setIsPasswordMatch(value === password2);
    };


    // 자격증 항목 추가
    const handleAddQualification = () => {
        setMember((prevState) => ({
            ...prevState,
            qualifications: [...prevState.qualifications, ""], // 빈 문자열로 새로운 항목 추가
        }));
    };


    // 경력 항목 추가
    const handleAddAntecedent = () => {
        setMember((prevState) => ({
            ...prevState,
            antecedents: [...prevState.antecedents, ""], // 빈 문자열로 새로운 항목 추가
        }));
    };

    // 자격증 수정
    const handleQualificationChange = (index, value) => {
        const updatedQualifications = [...Member.qualifications];
        updatedQualifications[index] = value; // 특정 인덱스의 값을 업데이트
        setMember((prevState) => ({
            ...prevState,
            qualifications: updatedQualifications,
        }));
    };

    // 경력 수정
    const handleAntecedentChange = (index, value) => {
        const updatedAntecedents = [...Member.antecedents];
        updatedAntecedents[index] = value; // 특정 인덱스의 값을 업데이트
        setMember((prevState) => ({
            ...prevState,
            antecedents: updatedAntecedents,
        }));
    };


    // 자격증 항목 삭제
    const handleDeleteQualification = (index) => {
        const updatedQualifications = Member.qualifications.filter((_, i) => i !== index);
        setMember((prevState) => ({
            ...prevState,
            qualifications: updatedQualifications,
        }));
    };


    // 경력 항목 삭제
    const handleDeleteAntecedent = (index) => {
        const updatedAntecedents = Member.antecedents.filter((_, i) => i !== index);
        setMember((prevState) => ({
            ...prevState,
            antecedents: updatedAntecedents,
        }));
    };


    return (
        <Row>
            <Col>
                {/* --------------------------------------------------------------------------------*/}
                {/* Card-1*/}
                {/* --------------------------------------------------------------------------------*/}
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-bell me-2"> </i>
                        회원 정보 수정 페이지
                    </CardTitle>
                    <CardBody  style={{justifyItems:"center"}}>
                        <table>
                            <tbody style={{verticalAlign: "bottom"}}>
                            <tr>
                                <td>
                                    <Label>아이디</Label>
                                </td>
                                <td>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="example@mail.com"
                                        type="email"
                                        value={Member.email}
                                        onChange={handleChange}
                                        readOnly={true}
                                        style={{color: "blue", backgroundColor: "gray"}}
                                    />
                                </td>
                                <td></td>
                                <td colSpan={2} rowSpan={4} style={{textAlign: "center", verticalAlign: "middle"}}>
                                    {
                                        previewImage != null ? (
                                            <div>
                                                <img
                                                    src={previewImage}
                                                    alt="preview"
                                                    style={{maxWidth: "100px"}}
                                                />
                                                <div>
                                                    <Label for="files" className="custom-file-upload-btn">
                                                        증명사진 변경
                                                    </Label>
                                                    <Input
                                                        id="files"
                                                        name="files"
                                                        type="file"
                                                        ref={uploadRef}
                                                        multiple
                                                        onChange={handleFileChange}
                                                        style={{display: "none"}}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Label for="files" className="custom-file-upload-btn">
                                                    증명사진 선택
                                                </Label>
                                                <Input
                                                    id="files"
                                                    name="files"
                                                    type="file"
                                                    ref={uploadRef}
                                                    multiple
                                                    onChange={handleFileChange}
                                                    style={{display: "none"}}
                                                />
                                            </div>

                                        )
                                    }


                                </td>


                            </tr>
                            <tr>
                                <td>
                                    <Label>이름</Label>
                                </td>
                                <td>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="name"
                                        type="text"
                                        onChange={handleChange}
                                        value={Member.name}
                                        readOnly={true}
                                        style={{color: "blue", backgroundColor: "gray"}}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Label>생년월일</Label>
                                </td>
                                <td>
                                    <Input
                                        id="birth"
                                        name="birth"
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}  // 현재 날짜 이후는 선택 불가
                                        required
                                        value={Member.birth}
                                        onChange={handleChange}
                                    />

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Label>성별</Label>
                                </td>
                                <td>
                                    <Input style={{marginRight: "10px", marginLeft: "10px"}}
                                           id="sex"
                                           name="sex"
                                           type="radio"
                                           value={"male"}
                                           onChange={handleChange}
                                           checked={Member.sex === "male"}
                                    />
                                    <Label for="Male" style={{marginRight: "30px"}}>남</Label>

                                    <Input style={{marginRight: "10px"}}
                                           id="sex"
                                           name="sex"
                                           type="radio"
                                           value={"female"}
                                           onChange={handleChange}
                                           checked={Member.sex === "female"}
                                    />
                                    <Label for="Male">여</Label>
                                </td>
                                <td></td>
                                <td colSpan={2}>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <Label>비밀번호</Label>
                                </td>
                                <td>
                                    <Input
                                        id="password"
                                        name="password"
                                        placeholder="password"
                                        type="password"
                                        //onChange={handlePasswordInputChange}
                                        value={"test"}
                                        readOnly
                                        style={{backgroundColor:"gray"}}
                                    />
                                </td>

                                <td></td>

                                <td>
                                    <Label>비밀번호 재입력</Label>
                                </td>
                                <td>
                                    <Input
                                        id="Password2"
                                        name="password2"
                                        placeholder="password"
                                        type="password"
                                        //onChange={handlePasswordChange}
                                        readOnly
                                        value={"test"}
                                        style={{backgroundColor:"gray"}}
                                        //style={{borderColor: isPasswordMatch ? 'initial' : 'red'}} // 비밀번호 확인 필드 스타일
                                    />
                                </td>
                            </tr>

                            <tr>


                                <td>
                                    <Label>Tel</Label>
                                </td>
                                <td>
                                    <Input
                                        id="tel"
                                        name="tel"
                                        placeholder="010-0000-0000"
                                        type="tel"
                                        pattern={"^\d{3}-\d{3,4}-\d{4}$"}
                                        onChange={handleChange}
                                        value={Member.tel}
                                        style={{color: "blue"}}
                                    />
                                </td>

                                <td></td>

                                <td>
                                    <Label> 최종학력 </Label>
                                </td>
                                <td>
                                    <Input
                                        id="education"
                                        name="education"
                                        type="select"
                                        required
                                        value={Member.education}
                                        onChange={handleChange}
                                    >
                                        <option value=""> 선택하세요</option>
                                        <option value="중학교 졸업">중학교 졸업</option>
                                        <option value="직업학교 졸업">직업학교 졸업</option>
                                        <option value="고등학교 졸업">고등학교 졸업</option>
                                        <option value="전문대 졸업">전문대 졸업</option>
                                        <option value="4년제 대학 졸업">4년제 대학 졸업</option>
                                        <option value="대학원 졸업">대학원 졸업</option>


                                    </Input>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <Label for="Member.marital_status">혼인유무</Label>
                                </td>
                                <td>

                                    <Input
                                        style={{marginRight: "10px", marginLeft: "10px"}}
                                        id="marital_status"
                                        name="marital_status"
                                        type="radio"
                                        value={"기혼"}
                                        onChange={handleChange}
                                        checked={Member.marital_status === "기혼"}
                                    />
                                    <Label for="기혼" style={{marginRight: "30px"}}>기혼</Label>

                                    <Input
                                        style={{marginRight: "10px"}}
                                        id="marital_status"
                                        name="marital_status"
                                        type="radio"
                                        value="미혼"
                                        onChange={handleChange}
                                        checked={Member.marital_status === "미혼"}
                                    />
                                    <Label for="미혼">미혼</Label>
                                </td>

                                <td width="5%"></td>

                                <td>
                                    <Label> 자녀 수 </Label>
                                </td>

                                <td>
                                    <Input
                                        id="children_count"
                                        name="children_count"
                                        type="select"
                                        required
                                        onChange={handleChange}
                                        value={Member.children_count}
                                    >

                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Input>
                                </td>


                            </tr>

                            {/* 자격증 항목 추가 및 관리 */}
                            <tr>
                                <td colSpan={5}>
                                    <Label>보유 자격증</Label>
                                </td>
                            </tr>
                            {Array.isArray(Member.qualifications) && Member.qualifications.map((qualification, index) => (
                                <tr key={index}>
                                    <td colSpan={5}>
                                        <FormGroup>
                                            <Input
                                                type="text"
                                                value={qualification}
                                                onChange={(e) => handleQualificationChange(index, e.target.value)}
                                                placeholder={`자격증 ${index + 1}`}
                                            />
                                        </FormGroup>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleDeleteQualification(index)} color="danger"
                                                style={{marginBottom: "18px"}}>
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={5} style={{textAlign: 'right'}}>
                                    <Button onClick={handleAddQualification} color="primary"
                                            style={{marginBottom: "18px"}}>
                                        자격증 추가
                                    </Button>
                                </td>
                            </tr>

                            {/* 경력 항목 추가 및 관리 */}
                            <tr>
                                <td colSpan={5}>
                                    <Label>경력</Label>
                                </td>
                            </tr>
                            {Array.isArray(Member.antecedents) && Member.antecedents.map((antecedent, index) => (
                                <tr key={index}>
                                    <td colSpan={5}>
                                        <FormGroup>
                                            <Input
                                                type="text"
                                                value={antecedent}
                                                onChange={(e) => handleAntecedentChange(index, e.target.value)}
                                                placeholder={`경력 ${index + 1}`}
                                            />
                                        </FormGroup>
                                    </td>
                                    <td>
                                        <Button onClick={() => handleDeleteAntecedent(index)} color="danger"
                                                style={{marginBottom: "18px"}}>
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={5} style={{textAlign: 'right'}}>
                                    <Button onClick={handleAddAntecedent} color="primary"
                                            style={{marginBottom: "18px"}}>
                                        경력 추가
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={5}>
                                    <Label> 계좌 정보 </Label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="bank-code">은행 선택</label>
                                    <Input type="select" id="bankCode" name="bankCode" value={Member.bankCode} onChange={handleChange}>
                                        <option value="">-- 은행 선택 --</option>
                                        {bankCodes.map((bank) => (
                                            <option key={bank.code} value={bank.code}>
                                                {bank.bankName} ({bank.code})
                                            </option>
                                        ))}
                                    </Input>
                                </td>
                                <td colSpan={2}>
                                    <Label>계좌 번호</Label>
                                    <Input id="account" name="account" type="text" value={Member.account} onChange={handleChange}/>

                                </td>
                                <td colSpan={2} style={{textAlign: "center", verticalAlign: "middle"}}>
                                    {
                                        previewImage2 != null ? (
                                            <div>
                                                <img
                                                    src={previewImage2}
                                                    alt="preview2"
                                                    style={{maxWidth: "100px"}}
                                                />
                                                <div>
                                                    <Label for="files2" className="custom-file-upload-btn">
                                                        통장사본 변경
                                                    </Label>
                                                    <Input
                                                        id="files2"
                                                        name="files2"
                                                        type="file"
                                                        ref={uploadRef}
                                                        multiple
                                                        onChange={handleFileChange2}
                                                        style={{display: "none"}}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <Label for="files2" className="custom-file-upload-btn">
                                                    통장사본 선택
                                                </Label>
                                                <Input
                                                    id="files2"
                                                    name="files2"
                                                    type="file"
                                                    ref={uploadRef}
                                                    multiple
                                                    onChange={handleFileChange2}
                                                    style={{display: "none"}}
                                                />
                                            </div>

                                        )
                                    }


                                </td>
                            </tr>


                            <tr>
                                <td colSpan={5} style={{textAlign: 'right'}}>
                                    <Button onClick={handleClickModify} color="primary" disabled={!isPasswordMatch}>
                                        사원정보 등록하기
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default ModifyComponent;
