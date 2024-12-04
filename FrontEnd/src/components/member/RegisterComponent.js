import {useRef, useState} from "react";
import {Card, Row, Col, CardTitle, CardBody, FormGroup, Label, Input, Button} from "reactstrap";
import { registerMember } from "../../api/memberApi";
import useCustomLogin from "../../hooks/useCustomLogin";

  const initState = {
    email: '',
    password: '',
    name: '',
    birth: '',
    tel: '',
    sex: '',
    marital_status: '',
    children_count: '0',
    qualifications: [],
    education: '',
    antecedents: [],
    files: null, //파일은 초기화
  }



  const RegisterComponent = () => {

     const [registerParam, setRegisterParam] = useState(initState)
     const [password, setPassword] = useState(''); // Original password
     const [password2, setPassword2] = useState(''); // Password check
     const [isPasswordMatch, setIsPasswordMatch] = useState(true);
     const uploadRef = useRef();
     const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지 상태

     const {moveToLogin} = useCustomLogin()

     const handleFileChange = (e) => {
        const { name, files } = e.target;

        // 파일이 존재하는지 확인하고 상태에 저장
         if (files && files.length > 0) {
         setRegisterParam((prevState) => ({
              ...prevState,
              [name]: files, // 파일 배열을 상태에 저장
              }));
              console.log(setRegisterParam.files)

             const file = files[0]; // 첫 번째 파일만 미리보기
             const reader = new FileReader();
             reader.onloadend = () => {
                 setPreviewImage(reader.result); // 읽은 파일을 상태에 저장
             };
             reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
            }
        };



    const handleChange = (e) => {
        registerParam[e.target.name] = e.target.value
        setRegisterParam({...registerParam})
    }

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword2(value);
        setIsPasswordMatch(value === password); // 비밀번호 확인과 원래 비밀번호 비교

    };

    const handlePasswordInputChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        setIsPasswordMatch(value === password2); // 비밀번호와 확인 비밀번호 일치 여부 확인

    };

      // 자격증 항목 추가
      const handleAddQualification = () => {
          setRegisterParam((prevState) => ({
              ...prevState,
              qualifications: [...prevState.qualifications, ""], // 빈 문자열로 새로운 항목 추가
          }));
      };

      // 경력 항목 추가
      const handleAddAntecedent = () => {
          setRegisterParam((prevState) => ({
              ...prevState,
              antecedents: [...prevState.antecedents, ""], // 빈 문자열로 새로운 항목 추가
          }));
      };

      // 자격증 수정
      const handleQualificationChange = (index, value) => {
          const updatedQualifications = [...registerParam.qualifications];
          updatedQualifications[index] = value; // 특정 인덱스의 값을 업데이트
          setRegisterParam((prevState) => ({
              ...prevState,
              qualifications: updatedQualifications,
          }));
      };

      // 경력 수정
      const handleAntecedentChange = (index, value) => {
          const updatedAntecedents = [...registerParam.antecedents];
          updatedAntecedents[index] = value; // 특정 인덱스의 값을 업데이트
          setRegisterParam((prevState) => ({
              ...prevState,
              antecedents: updatedAntecedents,
          }));
      };

      // 자격증 항목 삭제
      const handleDeleteQualification = (index) => {
          const updatedQualifications = registerParam.qualifications.filter((_, i) => i !== index);
          setRegisterParam((prevState) => ({
              ...prevState,
              qualifications: updatedQualifications,
          }));
      };

      // 경력 항목 삭제
      const handleDeleteAntecedent = (index) => {
          const updatedAntecedents = registerParam.antecedents.filter((_, i) => i !== index);
          setRegisterParam((prevState) => ({
              ...prevState,
              antecedents: updatedAntecedents,
          }));
      };


    const handleClickRegister = () => {
        if(password != null){
            handleChange(registerParam.pw, password);
        }
        console.log(registerParam);
        registerMember(registerParam).then(data => {
            if(data.error){
                alert("중복된 계정이 있습니다.")
            } else {
                alert("가입 성공")
                moveToLogin()


            }
        })


    }

    return (
      <Row>
        <Col>
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
              <i className="bi bi-bell me-2"> </i>
              회원 가입 페이지
            </CardTitle>
            <CardBody  style={{justifyItems:"center"}}>
                <table>
                    <tbody style={{verticalAlign:"bottom"}}>
                    <tr>
                        <td>
                            <Label>이메일</Label>
                        </td>
                        <td>
                            <Input
                                id="email"
                                name="email"
                                placeholder="example@mail.com"
                                type="email"
                                onChange={handleChange}
                            />
                        </td>
                        <td></td>
                        <td colSpan={2} rowSpan={4} style={{textAlign: "center", verticalAlign:"middle"}}>
                            {previewImage == null ? (
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
                            ):(
                            <div>

                            <div>
                                {previewImage && (
                                    <div>
                                        <img
                                            src={previewImage}
                                            alt="preview"
                                            style={{maxWidth: "100px"}}
                                        />
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
                                )}
                            </div>
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
                            )}
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
                                onChange={handleChange}
                            />

                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Label>성별</Label>
                        </td>
                        <td>
                            <Input style={{marginRight:"10px"}}
                                id="sex"
                                name="sex"
                                type="radio"
                                value={"Male"}
                                onChange={handleChange}
                            />
                            <Label for="Male" style={{marginRight:"30px"}}>남</Label>

                            <Input style={{marginRight:"10px"}}
                                id="sex"
                                name="sex"
                                type="radio"
                                value={"Female"}
                                onChange={handleChange}
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
                                onChange={handlePasswordInputChange}
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
                                onChange={handlePasswordChange}
                                style={{borderColor: isPasswordMatch ? 'initial' : 'red'}} // 비밀번호 확인 필드 스타일
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
                                required
                                onChange={handleChange}
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
                                onChange={handleChange}
                            >
                                <option> 중학교 졸업</option>
                                <option> 직업학교 졸업</option>
                                <option> 고등학교 졸업</option>
                                <option> 전문대 졸업</option>
                                <option> 4년제 대학 졸업</option>
                                <option> 대학원 졸업</option>


                            </Input>

                        </td>
                    </tr>

                    <tr>
                        <td>
                            <Label for="registerParam.marital_status">혼인유무</Label>
                        </td>
                        <td>

                            <Input
                                style={{marginRight:"10px"}}
                                id="marital_status"
                                name="marital_status"
                                type="radio"
                                value={"기혼"}
                                onChange={handleChange}
                            />
                            <Label for="기혼"  style={{marginRight:"30px"}}>기혼</Label>

                            <Input
                                style={{marginRight:"10px"}}
                                id="marital_status"
                                name="marital_status"
                                type="radio"
                                value="미혼"
                                onChange={handleChange}
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
                                value={registerParam.children_count}
                            >

                                <option>0</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Input>
                        </td>


                    </tr>

                    {/* 자격증 항목 추가 및 관리 */}
                    <tr>
                        <td colSpan={5}>
                            <Label>보유 자격증</Label>
                        </td>
                    </tr>
                    {registerParam.qualifications.map((qualification, index) => (
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
                                <Button onClick={() => handleDeleteQualification(index)} color="danger" style={{marginBottom:"18px"}}>
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5}  style={{textAlign:'right'}}>
                            <Button onClick={handleAddQualification} color="primary"  style={{marginBottom:"18px"}}>자격증 추가</Button>
                        </td>
                    </tr>

                    {/* 경력 항목 추가 및 관리 */}
                    <tr>
                        <td colSpan={5}>
                            <Label>경력</Label>
                        </td>
                    </tr>
                    {registerParam.antecedents.map((antecedent, index) => (
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
                                <Button onClick={() => handleDeleteAntecedent(index)} color="danger" style={{marginBottom:"18px"}}>
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5} style={{textAlign:'right'}}>
                            <Button onClick={handleAddAntecedent} color="primary" style={{marginBottom:"18px"}}>경력 추가</Button>
                        </td>
                    </tr>

                    <tr>
                        <td colSpan={5} style={{textAlign:'right'}}>
                            <Button onClick={handleClickRegister} color="primary" disabled={!isPasswordMatch}> 사원정보 등록하기 </Button>
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

  export default RegisterComponent;
