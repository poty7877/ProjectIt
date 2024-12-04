import React, {useState, useEffect} from "react";
import {Button, FormGroup, Label, Input, Form} from "reactstrap";

import useDocumentMove from "../../hooks/useDocumentMove";
import {getOne, putOne} from "../../api/DocumentApi";
import {getOneAsset} from "../../api/LicenseApi";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import ResultModal from "../projectModal/ResultModal";
import {statusRead} from "../../api/memberApi";
import {getOneAssetC} from "../../api/ComputerApi";
import DocumentRejectModal from "../documentModal/DocumentRejectModal";
import {getDocumentReject} from "../../api/DocumentRejectApi";
import {getCookie} from "../../util/cookieUtil";


const initState = {
    dno: 0,
    title: "",
    description: "",
    writer: "",
    sano: [],
    hano: [],
    mno: "",
    approvalDate: "",
    approved: "",
    regDate: "",
    approver: "",
    updateDate: ""
}

const DocumentReadComponent = () => {
    // dno를 파라미터에서 가져와 사용
    const {dno} = useParams()

    // document 객체값 관리
    const [document, setDocument] = useState({...initState});

    // 이동 관련
    const navigate = useNavigate();

    const location = useLocation();

    // software 객체값 관리
    const [software, setSoftware] = useState([])

    const [hardware, setHardware] = useState([])

    // 모달 내용 관리
    const [modalContent, setModalContent] = useState(null);

    // 반려 사유 모달
    const [rejectModal, setRejectModal] = useState(false);

    // 결과 모달창
    const [result, setResult] = useState(null);

    // 결재자 값 세팅
    const [approver, setApprover] = useState(null);

    const [writer, setWriter] = useState(null);

    const [team, setTeam] = useState(null);
    // 반려 문서값
    const [documentReject, setDocumentReject] = useState({});

    const backToList = () => {
        navigate(-1)
    }


    const token = getCookie("member")
    // 결재자 true
    const isEditable = (token && (parseInt(token.mno) === parseInt(document.mno)));
    // 작성자 true
    const isWriter = (token && (writer === document.writer));
    // 재무지원팀 true
    const isTeam = (token && (team === "TECHNIC" || team === "FINANCIAL_MANAGEMENT"))

    useEffect(() => {
        statusRead(token?.mno).then(data => {
            setWriter(data.name)
            setTeam(data.team)
        })
    }, [token?.mno])


    // dno를 이용해 api호출,
    // 문서 정보와, 문서에 관련된 소프트웨어 번호로 소프트웨어 객체 가져옴
    useEffect(() => {
        getOne(dno).then(data => {
            setDocument(data);
            console.log(data);
            statusRead(data.mno).then(data => {
                setApprover(data.name)
            })
            if (data.approved === "REJECTED") {
                getDocumentReject(data.dno).then(data => {
                    setDocumentReject(data)
                })
            }
            // 모든 getOneAsset 호출을 배열로 모아 Promise.all로 처리
            // Promise.all은 getOneAsset 호출을 병렬로 처리해 배열로모아 요청이 완료될때까지 기다림.
            // 여러 정보를 동시에 가져올때 유용함.
            Promise.all(data.sano.map(assetId => getOneAsset(assetId)))
                .then(assets => {
                    setSoftware(assets); // 한 번에 전체 배열 설정
                })
            Promise.all(data.hano.map(assetId => getOneAssetC(assetId)))
                .then(assets => {
                    setHardware(assets)
                })
        });
    }, [dno]);

    // 결재 버튼 클릭시
    const handleClickApprove = () => {
        if(!isEditable) {
            alert("결재 권한이 없습니다.")
            return;
        }
        const formData = {
            dno: document.dno,
            title: document.title,
            description: document.description,
            writer: document.writer,
            sano: document.sano,
            hano: document.hano,
            mno: document.mno,
            approver: document.approver,
            visibility: document.visibility,
            approvalDate: document.approvalDate,
            approved: "APPROVED",
            regDate: document.regDate,
            updateDate: document.updateDate
        }
        putOne(dno, formData).then(data => {
            setResult(data);
            console.log(formData);
            console.log("Approve response:", data);  // 데이터 응답을 콘솔에 출력
            setModalContent("결재가 완료되었습니다.")
        })
    }

    // 반려 버튼 클릭시
    const handleClickReject = () => {
        if(!isEditable) {
            alert("반려 권한이 없습니다.")
            return;
        }
        setRejectModal(true);
    }

    // 모달 창 닫음
    const closeModal = () => {
        setResult(null)
        navigate({
            pathname: `../document/requested/list`
        })
    }
    useEffect(() => {
        if (!token?.mno) {
            alert("로그인 후 이용 가능한 기능입니다.");
            // 이전 페이지로 이동
            const previousPage = location.state?.from || "/document/requested/list";
            navigate(previousPage);
        }
    }, [token, navigate, location]);
    const handleReject = () => {
        const formData = {
            dno: document.dno,
            title: document.title,
            description: document.description,
            writer: document.writer,
            sano: document.sano,
            hano: document.hano,
            mno: document.mno,
            visibility: document.visibility,
            approvalDate: document.approvalDate,
            approved: "REJECTED",
            approver: document.approver,
            regDate: document.regDate,
            updateDate: document.updateDate
        }
        console.log(formData)
        putOne(dno, formData).then(data => {
            setResult(data);
            setModalContent("반려 처리 되었습니다.");
            setRejectModal(false); // 반려 처리 후 모달 닫기
        })
    }

    // 반려 모달 닫기 함수 (등록 버튼이 아닌 경우)
    const closeRejectModalWithoutAction = () => {
        setRejectModal(false);
    }


    const [hasShownAlert, setHasShownAlert] = useState(false);

    useEffect(() => {
        // token, writer, document, team 값이 모두 존재하는지 확인
        if (!token || !writer || !document || !team) {
            return; // 값이 없으면 아무것도 하지 않음
        }

        // 값들이 모두 로드된 후에 조건 확인
        console.log(isEditable);
        console.log(isWriter);
        console.log(isTeam);

        // 조건이 맞지 않으면 한 번만 alert 띄운 후 페이지를 떠나기
        if (document.visibility === "PRIVATE" && !(isEditable || isWriter || isTeam)) {
            if (!hasShownAlert) {
                alert("조회 권한이 없습니다.");
                setHasShownAlert(true);
                navigate(-1);  // 이전 페이지로 이동
            }
        } else {
            // 조회가 가능한 항목에 들어가면 상태값 재설정
            setHasShownAlert(false);
            setHasShownAlert(false);
        }
    }, [isEditable, isWriter, isTeam, token, writer, document, team, hasShownAlert]);  // 의존성 배열에 필요한 값들 추가






    return (
        <div className="project-details">
            <ResultModal
                isOpen={result === "SUCCESS"}
                content={modalContent}
                callbackFn={closeModal}
            />
            <h3>문서 상세 정보</h3>
            <Form>
                <FormGroup>
                    <Input type={"hidden"} name={"dno"} value={document.dno || ""}></Input>
                    <Label>제목</Label>
                    <Input type="text" value={document.title} name="title" readOnly
                           style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>

                <FormGroup>
                    <Label>주요 내용</Label>
                    <Input type="textarea" value={document.description || ""} name="description" readOnly
                           style={{backgroundColor: '#f0f0f0', height: 300}}/>
                </FormGroup>
                <FormGroup>
                    <Label className="d-flex align-items-center">결제 상태</Label>
                    <Input type="text" name="approved" value={document.approved === "REQUESTED" ? "결재 요청"
                        : document.approved === "APPROVED" ? "결재 완료"
                            : document.approved === "REJECTED" ? "반려" : "오류"} readOnly
                           style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                {document.approved === "REJECTED" &&
                    <FormGroup>
                        <Label>반려 사유</Label>
                        <Input type="textarea" name="reason"
                               value={documentReject.reason}
                               readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                }

                <FormGroup>
                    <Label>요청 소프트웨어</Label>
                    <Input type="text" name="sano"
                           value={software.map((data) => data.rightName || "").join(" || ")}
                           readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>요청 하드웨어</Label>
                    <Input type="text" name="hano"
                           value={hardware.map((data) => data.productName || "").join(" || ")}
                           readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>작성자</Label>
                    <Input type="text" name="writer" value={
                        document.writer || ""
                    } readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>결재자</Label>
                    <Input type="text" name="mno" value={
                        document.approver || "로딩중"
                    } readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <div className="d-flex">
                    <FormGroup className="mr-2" style={{width: 630}}>
                        <Label>작성일</Label>
                        <Input type="text" name="regDate" value={document.regDate || ""} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                    <FormGroup style={{width: 630}}>
                        <Label>결재일</Label>
                        <Input type="text" name="approvalDate" value={document.approvalDate || ""} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>
                <div className="button-group">
                    {!(document.approved === "APPROVED" || document.approved === "REJECTED") && (
                        <>
                            <Button id="approveButton" color="primary" className={"me-2"}
                                    onClick={handleClickApprove}>결재</Button>
                            <Button id="rejectButton" color="danger" className={"me-2"}
                                    onClick={handleClickReject}>반려</Button>
                        </>
                    )}
                    <Button color="secondary" className={"me-2"} onClick={backToList}>뒤로가기</Button>
                </div>
            </Form>
            <DocumentRejectModal isOpen={rejectModal} callbackFn={closeRejectModalWithoutAction}
                                 handleReject={handleReject} document={document} approver={approver}/>
        </div>
    );

}

export default DocumentReadComponent;