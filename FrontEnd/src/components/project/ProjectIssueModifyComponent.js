import React, {useState, useEffect} from "react";
import {Button, FormGroup, Label, Input, Form} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";
import {deleteOne, getOne, putOne} from "../../api/ProjectIssueApi";
import {useNavigate, useParams} from "react-router-dom";
import ResultModal from "../projectModal/ResultModal";
import FetchingModal from "../projectModal/FetchingModal";
import {deleteImage, getFilesList, getImages, postUploadFile} from "../../api/ProjectIssueFilesApi";

// ProjectIssue 기본값 세팅
const initState = {
    ino: 0,
    pno: 0,
    projectMember: {},
    title: "",
    content: "",
    status: "",
    priority: ""
}

const ProjectIssueModifyComponent = () => {
    // ino를 파라미터에서 가져옴
    const {ino} = useParams()
    // List로 이동하는 메서드
    const {moveToProjectIssueList} = useProjectMove()
    // issue값 설정
    const [issue, setIssue] = useState(initState);
    // 결과모달
    const [result, setResult] = useState(null);
    // path 설정
    const navigate = useNavigate()
    // fetching
    const [fetching, setFetching] = useState(false);
    // error
    const [error, setError] = useState({});
    // 파일
    const [uploadFile, setUploadFile] = useState([]);
    // 썸네일
    const [previewImages, setPreviewImages] = useState([]);
    // image 목록 가져오기
    const [image, setImage] = useState([]);
    // url 처리
    const [imageUrls, setImageUrls] = useState([]); // Store image URLs
    // status 가져오기
    // 값 변경시 마다 issue 값 세팅
    const handleChangeIssue = (e) => {
        issue[e.target.name] = e.target.value
        setIssue({...issue})
    }
    // 수정 버튼 클릭시
    const handleClickModify = async () => {
        const formData = {
            ino: issue.ino,
            pno: issue.pno,
            title: issue.title,
            content: issue.content,
            status: issue.status,
            projectMember: issue.projectMember,
            priority: issue.priority
        };
        // formData 값 저장하고 수정하는 메서드
        setFetching(true)
        const response = await putOne(formData);
        if (response.success) {
            // newIno 업데이트
            console.log(response.data)
            setResult(response.data)
            if (uploadFile.length > 0) {
                for (const file of uploadFile) {
                    const formData = new FormData();
                    formData.append("ino", ino);
                    formData.append("file", file);

                    const data = await postUploadFile(formData);
                    setResult(data);
                    console.log(data);
                }
            }
        }
        setFetching(false)
    }
    // 삭제 클릭 버튼
    const handleClickDelete = (ino) => {
        if (window.confirm("삭제후 복원 불가능합니다. 정말 삭제하시겠습니까?")) {
            setFetching(true)
            deleteOne(ino).then(data => {
                setResult(data)
                setFetching(false)
            })
        }
    }
    // 모달창 닫음
    const closeModal = (pno) => {
        setResult(null)
        navigate({
            pathname: `../project/issue/${pno}`
        })
    }

    // ino이용해서 객체 가져옴
    useEffect(() => {
        setFetching(true);
        getOne(ino).then(data => {
            setIssue(data)
            setFetching(false)
        })
    }, [ino])

    // 이미지 변경시
    const handleChangeImage = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];
        const invalidFiles = [];

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        });

        if (invalidFiles.length > 0) {
            alert(`이미지 파일만 업로드 가능합니다. 잘못된 파일: ${invalidFiles.join(", ")}`);
            event.target.value = "";
        }

        // 유효한 파일만 업로드 목록에 추가
        setUploadFile(validFiles);

        // 유효한 파일로만 미리보기 생성
        const previews = validFiles.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        });

        Promise.all(previews).then((images) => {
            setPreviewImages(images);
        });
    };

    // 이미지 가져옴
    useEffect(() => {
        setFetching(true)
        getFilesList(ino).then(async (data) => {
            // ino를 이용해서 파일 이름리스트를 가져옴
            setImage(data);
            const urls = await Promise.all(data.map(async (file) => {
                // 파일이름을 파라미터로 이용해서 이미지URL, blob객체를 URL로 변경한 값을 가져옴
                const imageUrl = await getImages(file.fileName);  // 이미지 URL 가져오기
                return imageUrl;
            }));
            setImageUrls(urls);  // 여러 이미지 URL을 상태에 저장
            setFetching(false)
        });
    }, [ino]);

    const handleClickDeleteImage = async (fno) => {
        await deleteImage(fno).then(data => {
            console.log(data)
        })
        await getFilesList(ino).then(async (data) => {
            // ino를 이용해서 파일 이름리스트를 가져옴
            setImage(data);
            const urls = await Promise.all(data.map(async (file) => {
                // 파일이름을 파라미터로 이용해서 이미지URL, blob객체를 URL로 변경한 값을 가져옴
                const imageUrl = await getImages(file.fileName);  // 이미지 URL 가져오기
                return imageUrl;
            }));
            setImageUrls(urls);  // 여러 이미지 URL을 상태에 저장
            setFetching(false)
        });
    }

    return (
        <div className="project-details">
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <ResultModal
                isOpen={result === "SUCCESS" || result === "MODIFY_SUCCESS" || result === "DELETE_SUCCESS"}
                content={result === "SUCCESS" ? "수정이 완료되었습니다." : result === "MODIFY_SUCCESS" ? "수정이 완료되었습니다." : "삭제가 완료되었습니다."}
                callbackFn={() => closeModal(issue.pno)}
            />
            <h5>Project Details</h5>
            <Form>
                <FormGroup>
                    <Label>제목</Label>
                    <Input type="text" name="title" value={issue.title || ""} readOnly
                           style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>주요 내용 {error.content && <small style={{color: "red"}}>{error.content}</small>}</Label>
                    <Input type="textarea" name="content" defaultValue={issue.content || ""}
                           onChange={handleChangeIssue}>

                    </Input>
                </FormGroup>
                <div className="d-flex">
                    <FormGroup style={{width: 630}}>
                        <Label>상태</Label>
                        <Input type="select" name="status" defaultValue={issue.status || ""}
                               onChange={handleChangeIssue}>
                            <option value={"REGISTERED"}>
                                등록됨
                            </option>
                            <option value={"PROGRESSING"}>
                                진행중
                            </option>
                            <option value={"HOLD"}>
                                보류
                            </option>
                            <option value={"COMPLETED"}>
                                완료
                            </option>
                            <option value={"CANCELED"}>
                                취소
                            </option>
                        </Input>
                    </FormGroup>
                    <FormGroup style={{width: 630}}>
                        <Label>우선순위</Label>
                        <Input type="text" name="priority" value={issue.priority === "LOW" ? "낮음" :
                            issue.priority === "MEDIUM" ? "중간" :
                                issue.priority === "HIGH" ? "높음" : "오류발생"} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>
                <FormGroup>
                    <Label>담당자</Label>
                    <Input type="text" value={issue.projectMember.name || ""} readOnly
                           style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>등록된 이미지</Label>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px"}}>
                        {image.map((file, index) => (
                            <div key={file.fno}>
                                <img
                                    src={imageUrls[index]}
                                    alt={file.oldFileName}
                                    width="300"
                                    height="auto"
                                />
                                <div></div>
                                <Button
                                    style={{marginRight: "10px"}}
                                    onClick={() => handleClickDeleteImage(file.fno)}
                                >
                                    이미지 삭제
                                </Button>
                            </div>
                        ))}
                    </div>
                </FormGroup>
                <FormGroup>
                    <Label for="image"> 이미지 등록 </Label>
                    <Input name="image" type="file" multiple={true} onChange={handleChangeImage}></Input>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px"}}>
                        {previewImages.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`미리보기 ${index + 1}`}
                                style={{width: "250px", height: "250px"}}
                            />
                        ))}
                    </div>
                </FormGroup>


                <div className="button-group">
                    <Button color="primary" className={"me-2"} onClick={handleClickModify}>수정</Button>
                    <Button color="warning" className={"me-2"} onClick={() => handleClickDelete(issue.ino)}>삭제</Button>
                    <Button color="secondary" className={"me-2"}
                            onClick={() => moveToProjectIssueList(issue.pno)}>목록보기</Button>
                </div>
            </Form>
        </div>
    );

}

export default ProjectIssueModifyComponent;