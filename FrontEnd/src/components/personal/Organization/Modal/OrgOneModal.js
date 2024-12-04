import { useEffect, useState } from "react";
import { Card, Row, Col, CardTitle, CardBody, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import FetchingModal from "../../../common/FetchingModal"; 
import useCustomLink from "../../../../hooks/useCustomLink";
import { modifyMember, teamRead } from "../../../../api/organizationAPI";



  const OrgOneModal = ({mno, isOpen, closeModal}) => {
      

    const initState = {
        team : '',
        memberRole : '',
        teamName : '',
        mno : '',
        name : ''
      }

    
    const [memberS, setMember] = useState(initState)       
    const [fetching, setFetching ] = useState(false)               
    const {moveToMain} = useCustomLink();
    
      
    useEffect(()=> {
        console.log("mno data : " + mno)
        console.log(isOpen)
        if(!mno) return; //mno가 없을 경우에는 호출하지 않음
        setFetching(true)                
        // 데이터 가져오기               

        teamRead(mno).then(data => {            
            console.log('Reading data: ', data.name)            
            setMember(data);           
            setFetching(false);                                
        }).catch(error => {
            console.error('Error fetching data : ', error);
            setFetching(false);
        })
    }, [mno])
    //mno 변경시마다 호출한다.        
        
    const handleChange = (e) => {        
        const { name, value } = e.target;   //input, name. value추출        
        setMember((prevState) => ({
            ...prevState,   // 이전 상태 복사
            [name]: value,   // 해당 필드 업데이트            
        }));
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
                moveToMain()               
            }
        })
        .catch(error => {
            console.error("Error Modifying member : ", error)            
            alert("정보 수정 중 오류 발생")
        });      
    };

    if(!mno) return null;  

    return (
        <Modal
        isOpen={isOpen}
        toggle={closeModal}
        backdrop="static"
        
        size="sm"
        
      >
        {fetching ? (
          <FetchingModal />
        ) : (
          <>
            <ModalHeader toggle={closeModal}>사원 정보 수정</ModalHeader>
            <ModalBody>
                   
      <Row>
        
        <Col>
          {/* --------------------------------------------------------------------------------*/}
          {/* Card-1*/}
          {/* --------------------------------------------------------------------------------*/}
          <Card>            
            <CardBody>
                <table>
                    <tbody>
                    <tr>
                        <td>
                             <Label for="Name" >Name</Label>
                        </td>
                        <td>
                            <Input
                                id="Name"
                                name="name"
                                placeholder="name"
                                type="text"
                                value={memberS.name || ""}
                                readOnly
                                
                            />                            
                        </td>
                    </tr>

                    <tr>
                        <td>
                             <Label for="memberRole" >직책</Label>
                        </td>               
                        <td>
                            <Input
                                id="memberRole"
                                name="memberRole"
                                type="select"
                                value={memberS.memberRole || ""}
                                onChange={handleChange}
                            >
                                <option value={"CONTRACT_WORKER"}> 계약직 </option>
                                <option value={"INTERN"}> 인턴 </option>
                                <option value={"STAFF"}> 사원 </option>
                                <option value={"ASSOCIATE"}> 주임 </option>
                                <option value={"ASSISTANT_MANAGER"}> 대리 </option>
                                <option value={"MANAGER"}> 과장 </option>                     
                                <option value={"DEPUTY_MANAGER"}> 차장 </option>                     
                                <option value={"GENERAL_MANAGER"}> 부장 </option>                     
                                <option value={"PRESIDENT"}> 사장 </option>    

                            </Input>

                        </td>
                    </tr>

                    <tr>
                        <td>
                             <Label for="team" >team</Label>
                        </td>
                        <td>
                            <Input
                                id="team"
                                name="team"
                                type="select"
                                value={memberS.team || ""}
                                onChange={handleChange}
                            >
                                <option value={"AWAIT"}> 부서발령대기 </option>
                                <option value={"TECHNIC"}> 기술부 </option>
                                <option value={"PERSONNEL"}> 인사부 </option>
                                <option value={"ACCOUNTING"}> 회계부 </option>
                                <option value={"FINANCIAL_MANAGEMENT"}> 재무관리팀 </option>
                            </Input>

                        </td>
                    </tr>

                    <tr>
                        <td>
                             <Label for="teamName" >TeamName</Label>
                        </td>
                        <td>
                            <Input
                                id="teamName"
                                name="teamName"
                                type="text"
                                value={memberS.teamName || ""}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>                   

                    <tr>
                        <td colSpan={2}>
                            <Button color="primary" onClick={handleClickModify}> 사원정보 수정하기 </Button>
                            <Button color="secondary" onClick={closeModal}>닫기 </Button>
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
  
  export default OrgOneModal;
  