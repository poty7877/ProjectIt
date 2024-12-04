import React, {useEffect, useState} from "react";
import {deleteOne, getOneByCno, putOne} from "../../api/PartnersApi";
import {useNavigate, useParams} from "react-router-dom";
import FetchingModal from "../projectModal/FetchingModal";
import ResultModal from "../projectModal/ResultModal";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import {deleteFile, getFiles, getFilesList, postUploadFile} from "../../api/PartnersFileApi";
import generateThumbnail from "../common/generateThumnail";

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

const PartnersModifyComponent = () => {
    // cno를 파라미터에서 가져와 변수로 사용
    const {cno} = useParams();
    // 고객사 정보
    const [partner, setPartner] = useState({...initState});
    // 결과창
    const [result, setResult] = useState(false);
    // path 설정
    const navigate = useNavigate()
    // 로딩모달
    const [fetching, setFetching] = useState(false);
    // 파일 설정
    const [files, setFiles] = useState([])
    // url 설정
    const [fileUrls, setFileUrls] = useState([]);
    // error 설정
    const [error, setError] = useState({});
    // 고객사 정보 변경시
    const handleChangePartner = (e) => {
        partner[e.target.name] = e.target.value
        console.log(e.target.value)
        setPartner({...partner})
    }
    // 모달창 닫기
    const closeModal = () => {
        setResult(null)
        navigate({
            pathname: `../partners`
        })
    }
    // 수정 버튼 클릭시
    const handleClickModify = async () => {
        const response = await putOne(partner)
        if (response.success) {
            setResult(response.success);
        } else {
            setError(response.errors)
        }
    }

// 삭제 버튼 클릭시
    const handleClickDelete = () => {
        deleteOne(partner.cno).then(data => {
            setResult(data + 2)
        })
    }
// 파일 삭제 클릭시
    const handleClickFileDelete = (fno) => {
        deleteFile(fno).then((data) => {
            console.log(data);
            // 파일 삭제 후 파일 목록에서 해당 파일 제거
            setFiles(files.filter(file => file.fno !== fno));
        }).catch(error => {
            console.error('파일 삭제 실패:', error);
        });
    };
// 파일 변경시
    const handleChangeImage = (event) => {
        const newFiles = Array.from(event.target.files); // 선택된 파일들
        newFiles.forEach((file) => {
            const formData = new FormData();
            formData.append("cno", partner.cno);
            formData.append("file", file);

            postUploadFile(formData).then(data => {
                console.log(data);

                // 파일 업로드 후 새로 추가된 파일을 파일 목록에 반영
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
                })
            });
        });
    }

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
            <ResultModal
                isOpen={result === true || result === "SUCCESS2"}
                content={result === true ? "수정완료" : "삭제완료"}
                callbackFn={closeModal}
            />
            <Row>
                <Col>
                    <Card>
                        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                            <i className="bi bi-bell me-2"> </i>
                            고객사 수정 화면
                        </CardTitle>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <Label for="title">회사 이름 {error.comName &&
                                        <small style={{color: "red"}}>{error.comName}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="comName"
                                        type="text"
                                        placeholder="회사 이름을 입력하세요"
                                        value={partner.comName}
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>대표자 {error.ceoName &&
                                        <small style={{color: "red"}}>{error.ceoName}</small>}</Label>
                                    <Input
                                        type="text"
                                        placeholder="이름 입력"
                                        name="ceoName"
                                        value={partner?.ceoName || ""}
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">사업자 번호 {error.coNum &&
                                        <small style={{color: "red"}}>{error.coNum}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="coNum"
                                        type="text"
                                        placeholder="ex) 000-00-00000"
                                        value={partner.coNum}
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">대표번호 {error.phone &&
                                        <small style={{color: "red"}}>{error.phone}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="phone"
                                        type="text"
                                        placeholder="ex) 000-0000-0000"
                                        value={partner.phone}
                                        onChange={handleChangePartner}
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
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">회사 주소 {error.address &&
                                        <small style={{color: "red"}}>{error.address}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="address"
                                        type="text"
                                        placeholder="ex) 경기도 수원시 ㅇㅇㅇ"
                                        value={partner.address}
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="title">업태(종목) {error.bizType &&
                                        <small style={{color: "red"}}>{error.bizType}</small>}</Label>
                                    <Input
                                        id="title"
                                        name="bizType"
                                        type="text"
                                        placeholder="ex) 도소매"
                                        value={partner.bizType}
                                        onChange={handleChangePartner}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="image"> 파일 추가 등록 </Label>
                                    <Input type="file" multiple={true} onChange={handleChangeImage}></Input>
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
                                                        alt="PDF Thumbnail"
                                                        style={{
                                                            width: "150px",
                                                            height: "auto",
                                                            marginRight: "20px",
                                                            borderRadius: "5px"
                                                        }}
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
                                                            <Button onClick={() => handleClickFileDelete(file.fno)}
                                                                    color="danger">
                                                                삭제
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


                                <Button type={"button"} color={"primary"} onClick={handleClickModify}>저장</Button>
                                <Button type={"button"} color={"danger"} onClick={handleClickDelete}>삭제</Button>
                                <Button onClick={() => navigate(`../partners`)}>목록</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PartnersModifyComponent