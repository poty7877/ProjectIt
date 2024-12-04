import { useEffect, useState } from "react";
import { Card, Row, Col, CardBody, Label, Button, Modal, ModalHeader, ModalBody, Table, Input } from "reactstrap";
import FetchingModal from "../../common/FetchingModal"; 
import { getFiles, modifyMember, readOne } from "../../../api/applicationAPI";

const AppOneModal = ({ no, isOpen, closeModal }) => {
  const initState = {
    name: '',
    phoneNum: '',
    mail: '',
    teamName: '',
    files: null, // 파일은 null로 초기화
    joinStatus: '',
    startdate:'',
    no:'',
    
};

  const [memberS, setMember] = useState(initState);
  const [fetching, setFetching] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // 이미지 URL 상태 추가

  useEffect(() => {
    if (!no) return; // `no`가 없으면 API 호출하지 않음

    setFetching(true);

    // 데이터 가져오기
    const fetchData = async () => {
      try {
        const res = await readOne(no);
        setMember(res);
        console.log(memberS);
            
        // 파일 URL 가져오기
        if (res.uploadFileNames && res.uploadFileNames.length > 0) {
          const url = await getFiles(res.uploadFileNames[0]);
          console.log(url);
          setImageUrl(url);
        }
    
        } catch (error) {
          console.error("데이터를 가져오는 중 오류 발생:", error);
        } finally {
          setFetching(false);
        }
        };
    
        fetchData();
  }, [no]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prevState) => ({
        ...prevState,
        [name]: value, // 해당 필드 업데이트        
    }));
    console.log(memberS);
};

const handleClickModify = () => {
        
  console.log(memberS);     
  
  modifyMember(memberS)
  .then(data => {                        
      console.log("modify success")            
      if(data.error){
          alert("오류가 발생되었습니다.")
      } else {
          alert("정보 수정 성공")       
          closeModal()       
      }
  });
// 수정데이터 서버 전송 로직 자리  
};

  // 파일 다운로드 처리 함수
  const handleDownload = async () => {
    try {
      const fileUrl = await getFiles(memberS.uploadFileNames[0]); // 첫 번째 파일 URL을 가져옴
      const link = document.createElement('a');
      link.href = fileUrl; // Blob URL을 사용
      link.download = memberS.uploadFileNames[0]; // 파일 이름 설정
      link.click(); // 다운로드 실행

    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  if (!no) return null;

  return (
    <Modal isOpen={isOpen} toggle={closeModal} backdrop="static" size="m">
      {fetching ? (
        <FetchingModal />
      ) : (
        <>
          <ModalHeader toggle={closeModal}> 지원자 이력서 </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                {/* Card-1 */}
                <Card>
                  <CardBody>
                    <Table>
                      <tbody>
                        <tr>
                          <td>
                            <Label for="no">입사지원번호</Label>
                          </td>
                          <td align="center" >{memberS.no}</td>
                        </tr>
                        <tr>
                          <td>
                            <Label>지원서</Label>
                          </td>
                          <td align="center">
                            {imageUrl ? (
                              <img src={imageUrl} alt="지원서 이미지" width="200" />
                            ) : (
                              <p>이미지가 없습니다.</p>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>지원 결과</td>
                          <td align="center">
                          <Input
                            id="joinStatus"
                            name="joinStatus"
                            type="select"                                                 
                            onChange={handleChange}
                             >
                              <option value={"WAITING"}>신규지원</option>
                              <option value={"HOLD"}>보류</option>
                              <option value={"DISMISSED"}>불합격</option>
                              <option value={"PASSED"}>합격</option>
                            </Input>                            
                            </td>
                        </tr>
                        <tr>
                          <td colSpan={2} align="center">
                            <Button color="primary" onClick={handleDownload}>
                              이력서 다운로드
                            </Button>
                            <Button color="success" onClick={handleClickModify}> 저장 </Button>
                            <Button color="secondary" onClick={closeModal}>닫기</Button>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
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

export default AppOneModal;
