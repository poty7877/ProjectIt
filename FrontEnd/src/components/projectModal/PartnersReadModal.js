
import React, {useEffect, useState} from 'react';

import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
} from "reactstrap";
import FetchingModal from "./FetchingModal";
import {getOne} from "../../api/PartnersApi";
import usePartnersMove from "../../hooks/usePartnersMove";
import {getFiles, getFilesList} from "../../api/PartnersFileApi";

const initState = {
    cno: "",
    coNum: "",
    comName: "",
    phone: "",
    site: "",
    visibility: "",
    address: "",
    bizType: ""
}


function PartnersReadModal({isOpen, callbackFn}) {
    // 로딩 모달
    const [fetching, setFetching] = useState(false);
    // 회사이름
    const [name, setName] = useState("");
    // 전화번호
    const [phone, setPhone] = useState("");
    // 등록된 파일리스트
    const [files, setFiles] = useState([])
    // 파일Url (다운로드)
    const [fileUrls, setFileUrls] = useState([]); // Store image URLs
    // 결과창
    const [result, setResult] = useState({...initState});
    // 상태관리(컨트롤러에서 가져온 상태)
    const [status, setStatus] = useState("");
    // 수정 화면으로 이동
    const {moveToModify} = usePartnersMove();
    // target의 값이 변경되면 바로 값을 넣음
    const handleChangeName = (e) => {
        console.log(e.target.value)
        setName(e.target.value)
    }
    // target의 값이 변경되면 바로 값을 넣음
    const handleChangePhone = (e) => {
        console.log(e.target.value)
        setPhone(e.target.value)
    }
    // 검색버튼 클릭
    const handleClickSearch = () => {
        setFetching(true)
        getOne(name, phone).then(data => {
            setResult(data.data)
            if (data.status === "FAIL") {
                setStatus("FAIL")
            } else {
                setStatus("SUCCESS")
            }
        })
        setFetching(false)
    }
    // 모달창 닫음
    const closeModal = () => {
        setResult(null)
        setStatus(null);
        callbackFn();
    }
    // 파일 리스트 가져오면서 url 셋팅
    useEffect(() => {
        if (result?.cno) {
            getFilesList(result?.cno).then(async (data) => {
                setFiles(data);
                const urls = await Promise.all(data.map(async (file) => {
                    const fileUrl = await getFiles(file.fileName);
                    console.log(file.fileName, fileUrl);
                    return fileUrl;
                }));
                setFileUrls(urls);
            })
        }
    }, [result?.cno])
    return (
        <Modal isOpen={isOpen} toggle={callbackFn}>
            <>
                <FetchingModal isOpen={fetching}/>
            </>
            <ModalHeader toggle={callbackFn}>알림</ModalHeader>
            <ModalBody>
                <div>
                    <FormGroup>
                        <Label>회사명</Label>
                        <Input
                            type="text"
                            placeholder="이름 입력"
                            name="comName"
                            onChange={handleChangeName}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>전화번호</Label>
                        <Input
                            type="text"
                            name="phone"
                            placeholder="ex) 010-0000-0000"
                            onChange={handleChangePhone}
                        />
                    </FormGroup>
                    <Button color={"primary"} onClick={handleClickSearch}>검색</Button>
                    {status === "SUCCESS" ?
                        <div>
                            <FormGroup>
                                <Label>회사명</Label>
                                <Input
                                    type="text"
                                    placeholder="이름 입력"
                                    name="comName"
                                    value={result.comName}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>대표자</Label>
                                <Input
                                    type="text"
                                    placeholder="이름 입력"
                                    name="ceoName"
                                    value={result?.ceoName || ""}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>사업자번호</Label>
                                <Input
                                    type="text"
                                    placeholder="ex) 000-11-22222"
                                    name="coNum"
                                    value={result.coNum}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>전화번호</Label>
                                <Input
                                    type="text"
                                    placeholder="ex) 010-1111-2222"
                                    name="phone"
                                    value={result.phone}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>홈페이지</Label>
                                <Input
                                    type="text"
                                    placeholder="ex) www.example.com"
                                    name="site"
                                    value={result.site}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>주소</Label>
                                <Input
                                    type="text"
                                    placeholder="ex) 경기도 수원시 ㅇㅇㅇ"
                                    name="address"
                                    value={result.address}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>업태</Label>
                                <Input
                                    type="text"
                                    placeholder="ex) 도소매"
                                    name="biztype"
                                    value={result.bizType}
                                    readOnly
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>등록된 파일</Label>
                                <div>
                                    {files.map((file, index) => (
                                        <div key={file.fno}>
                                            <p>{file.oldFileName}</p>
                                            {fileUrls[index] ? (
                                                <Button
                                                    href={fileUrls[index]}
                                                    download={file.oldFileName}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{marginRight: "10px"}}
                                                >
                                                    다운로드
                                                </Button>
                                            ) : (
                                                <p>URL을 불러오는 중...</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </FormGroup>
                        </div> : status === "FAIL" ? <div>
                            <FormGroup>
                                <Input
                                    type="text"
                                    value={"정보를 찾을수 없습니다."}
                                    readOnly={true}
                                />
                            </FormGroup>
                        </div> : <></>
                    }

                </div>
            </ModalBody>
            <ModalFooter>
                {status === "SUCCESS" ?
                    <Button color="warning" onClick={() => moveToModify(result.cno)}>정보수정</Button> : <></>}
                <Button color="secondary" onClick={closeModal}>
                    닫기
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default PartnersReadModal;
