import React, {useEffect, useState} from "react";
import {deleteOne, getOneByCno, putOne} from "../../api/PartnersApi";
import {useNavigate, useParams} from "react-router-dom";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Modal, ModalBody, Row} from "reactstrap";
import {deleteFile, getFiles, getFilesList, postUploadFile} from "../../api/PartnersFileApi";
import generateThumbnail from "../common/generateThumnail";
import usePartnersMove from "../../hooks/usePartnersMove";

const initState = {
    cno: 0,
    comName: "",
    coNum: "",
    phone: "",
    site: "",
    visibility: "",
    address: "",
    bizType: "",
}

const PartnersReadComponent = () => {
    // cno를 파라미터에서 가져와 변수로 사용
    const {cno} = useParams();
    // 고객사 정보
    const [partner, setPartner] = useState({...initState});
    // path 설정
    const navigate = useNavigate()
    // 로딩모달
    const [fetching, setFetching] = useState(false);
    // 파일 설정
    const [files, setFiles] = useState([])
    // url 설정
    const [fileUrls, setFileUrls] = useState([]);
    // moveTo
    const {moveToModify} = usePartnersMove();

    const [modalOpen, setModalOpen] = useState(false); // 모달 열기/닫기 상태
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지

    // 이미지 클릭 시 모달 열기
    const openModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setModalOpen(false);
        setSelectedImage(null);
    };


// cno로 고객사 정보 가져옴
    useEffect(() => {
        setFetching(true)
        getOneByCno(cno).then(data => {
            setPartner(data)
            console.log(data)
        })
        setFetching(false)
    }, [cno])

// 고객사 파일 리스트 가져와 url 셋팅
    useEffect(() => {
        if (partner?.cno) {
            getFilesList(partner?.cno).then(async (data) => {
                setFiles(data);
                const urls = await Promise.all(data.map(async (file) => {
                    const fileUrl = await getFiles(file.fileName);

                    if (file.fileName.endsWith(".pdf")) {
                        // PDF 처리
                        const response = await fetch(fileUrl);
                        const pdfBlob = await response.blob();
                        const thumbnail = await generateThumbnail(pdfBlob);
                        return {url: fileUrl, thumbnail}; // 썸네일과 URL 모두 저장
                    } else if (file.fileName.match(/\.(png|jpe?g|gif)$/i)) {
                        // 이미지 처리
                        return {url: fileUrl, thumbnail: fileUrl}; // 이미지 URL을 썸네일로 사용
                    }

                    return {url: fileUrl, thumbnail: null}; // 처리되지 않은 파일
                }));
                setFileUrls(urls);
            });
        }
    }, [partner?.cno]);


    return (
        <div>
            <>
                <FetchingModal isOpen={fetching}/>
            </>
            <Row>
                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            고객사 조회 화면
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="title">회사 이름</Label>
                                    <Input
                                        id="title"
                                        name="comName"
                                        type="text"
                                        placeholder="회사 이름을 입력하세요"
                                        value={partner.comName}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>대표자 </Label>
                                    <Input
                                        type="text"
                                        placeholder="이름 입력"
                                        name="ceoName"
                                        value={partner?.ceoName || ""}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">사업자 번호</Label>
                                    <Input
                                        id="title"
                                        name="coNum"
                                        type="text"
                                        placeholder="ex) 000-00-00000"
                                        value={partner.coNum}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">대표번호</Label>
                                    <Input
                                        id="title"
                                        name="phone"
                                        type="text"
                                        placeholder="ex) 000-0000-0000"
                                        value={partner.phone}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">홈페이지 주소</Label>
                                    <Input
                                        id="title"
                                        name="site"
                                        type="text"
                                        placeholder="ex) www.example.com"
                                        value={partner.site}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">회사 주소</Label>
                                    <Input
                                        id="title"
                                        name="address"
                                        type="text"
                                        placeholder="ex) 경기도 수원시 ㅇㅇㅇ"
                                        value={partner.address}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">업태(종목)</Label>
                                    <Input
                                        id="title"
                                        name="bizType"
                                        type="text"
                                        value={partner.bizType}
                                        readOnly
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>등록된 파일</Label>
                                    <div>
                                        {files.map((file, index) => (
                                            <div key={file.fno}
                                                 style={{display: "flex", alignItems: "center", marginBottom: "20px"}}>
                                                {fileUrls[index]?.thumbnail ? (
                                                    <img
                                                        src={fileUrls[index].thumbnail}
                                                        alt="파일 썸네일"
                                                        style={{
                                                            width: "150px",
                                                            height: "auto",
                                                            marginRight: "20px",
                                                            borderRadius: "5px",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => openModal(fileUrls[index].url)} // 이미지 클릭 시 모달 열기
                                                    />
                                                ) : (
                                                    <p style={{
                                                        marginRight: "20px",
                                                        fontWeight: "bold"
                                                    }}>{file.oldFileName}</p>
                                                )}
                                                <div style={{
                                                    flex: "1",
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center"
                                                }}>
                                                    {fileUrls[index]?.url ? (
                                                        <div style={{display: "flex", alignItems: "center"}}>
                                                            <Button
                                                                href={fileUrls[index].url}
                                                                download={file.oldFileName}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                style={{marginRight: "10px"}}
                                                            >
                                                                다운로드
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <p>URL을 불러오는 중...</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </FormGroup>


                                <Button type={"button"} color={"primary"} onClick={() => moveToModify(cno)}>수정</Button>
                                <Button onClick={() => navigate(`../partners`)}>목록</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={modalOpen} toggle={closeModal} size="lg">
                <ModalBody>
                    {selectedImage && <img src={selectedImage} alt="큰 이미지" style={{ width: "100%", height: "auto" }} />}
                </ModalBody>
            </Modal>
        </div>
    )
}

export default PartnersReadComponent