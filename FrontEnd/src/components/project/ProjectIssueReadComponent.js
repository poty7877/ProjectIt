import React, {useState, useEffect} from "react";
import {Button, FormGroup, Label, Input, Form, Card, CardBody, CardHeader, CardFooter} from "reactstrap";
import useProjectMove from "../../hooks/useProjectMove";
import {getOne, postReplyAdd} from "../../api/ProjectIssueApi";
import {useNavigate, useParams} from "react-router-dom";
import {deleteImage, getFilesList, getImages} from "../../api/ProjectIssueFilesApi";
import FetchingModal from "../projectModal/FetchingModal";
import {getCookie} from "../../util/cookieUtil";
import {getList} from "../../api/ProjectMemberApi";
import {postAdd} from "../../api/ProjectApi";
import {statusRead} from "../../api/memberApi";

// ProjectIssue 기본값 세팅
const initState = {
    ino: 0,
    pno: 0,
    projectMember: {},
    title: "",
    content: "",
    status: "",
    priority: "",
    replies: []
}

const ProjectIssueReadComponent = () => {
    // ino를 파라미터에서 가져옴
    const {ino} = useParams()
    // 이동에 관련된 함수
    const {moveToProjectIssueList, moveToIssueModify} = useProjectMove()
    // issue값 세팅
    const [issue, setIssue] = useState(initState);
    // image 목록 가져오기
    const [image, setImage] = useState([]);
    // url 처리
    const [imageUrls, setImageUrls] = useState([]); // Store image URLs
    // fetching
    const [fetching, setFetching] = useState(false)
    // isProjectMember?
    const [isProjectMember, setProjectMembers] = useState([]);
    const token = getCookie("member");
    // replyContent
    const [content, setContent] = useState(null);
    // error
    const [error, setError] = useState(null);
    // loginMember
    const [loginMember, setLoginMember] = useState({});


    // issue값 가져옴
    useEffect(() => {
        setFetching(true)
        getOne(ino).then(data => {
            setIssue(data)
            setFetching(false)
            getList(data.pno).then(data => {
                setProjectMembers(data)
            })
        })

        statusRead(token?.mno).then(data => {
            setLoginMember(data)
        })
    }, [ino])

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

    const navigate = useNavigate()

    const backToList = () => {
        navigate(-1)
    }

    let checkmno = issue.projectMember.mno === 0 ? true : isProjectMember.some(member => member.mno === token.mno);
    console.log(checkmno)

    const handleChangeReplyContent = (e) => {
        setContent(e.target.value)
        console.log(e.target.value);
    }

    const handleClickReplyAdd = async () => {
        const formData = {
            ino: issue.ino,
            writer: loginMember.name,
            content: content
        }
        const response = await postReplyAdd(formData)
        if (response.success) {
                getOne(ino).then(data => {
                    setIssue(data); // 업데이트된 issue 값 저장
                    setFetching(false);
                });

                // 콘텐츠 초기화
                setContent(""); // 댓글 작성 후 내용 초기화
                setError("");
            }
        else {
            setError(response.errors)
        }
    }

    return (
        <div className="project-details">
            <>
                <FetchingModal isOpen={fetching}/>
                {/* serverData와 approver를 사용하는 UI */}
            </>
            <h5>ProjectIssue Details</h5>
            <Form>
                <FormGroup>
                    ㄴ <Label>제목</Label>
                    <Input type="text" value={issue.title || ""} readOnly style={{backgroundColor: '#f0f0f0'}}/>
                </FormGroup>
                <FormGroup>
                    <Label>주요 내용</Label>
                    <Input type="textarea" value={issue.content || ""} readOnly style={{backgroundColor: '#f0f0f0'}}
                           rows={10}/>
                </FormGroup>
                <div className="d-flex">
                    <FormGroup style={{width: 630}}>
                        <Label>상태</Label>
                        <Input type="text" value={
                            issue.status === "REGISTERED" ? "등록됨"
                                : issue.status === "PROGRESSING" ? "작업중"
                                    : issue.status === "HOLD" ? "보류"
                                        : issue.status === "COMPLETED" ? "완료" : "취소"
                        } readOnly style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>

                    <FormGroup style={{width: 630}}>
                        <Label>우선순위</Label>
                        <Input type="text" value={issue.priority === "LOW" ? "낮음" :
                            issue.priority === "MEDIUM" ? "중간" :
                                issue.priority === "HIGH" ? "높음" : "오류발생"} readOnly
                               style={{backgroundColor: '#f0f0f0'}}/>
                    </FormGroup>
                </div>
                <Card>
                    <CardHeader>댓글로 진행상황을 공유하세요</CardHeader>
                    <CardBody>
                        <FormGroup>
                            <Label></Label>
                            <div className="comments-section" style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                marginTop: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                backgroundColor: '#f9f9f9'
                            }}>
                                {issue.replies && issue.replies.length > 0 ? (
                                    issue.replies.sort((a, b) => (b.rno) - (a.rno)) // regDate를 기준으로 내림차순 정렬
                                        .map((comment) => (
                                            <div key={comment.rno} className="comment" style={{
                                                backgroundColor: '#fff',
                                                border: '1px solid #ddd',
                                                borderRadius: '5px',
                                                padding: '10px',
                                                marginBottom: '10px',
                                                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                wordWrap: 'break-word'
                                            }}>
                                                <p style={{
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                    marginBottom: '5px'
                                                }}>{comment.writer}</p>
                                                <p style={{
                                                    fontSize: '14px',
                                                    color: '#555',
                                                    marginBottom: '5px'
                                                }}>{comment.content}</p>
                                                <small style={{
                                                    fontSize: '12px',
                                                    color: '#999'
                                                }}>{comment.regDate}</small>
                                            </div>
                                        ))
                                ) : (
                                    <p style={{
                                        fontStyle: 'italic',
                                        color: '#999'
                                    }}>댓글이 없습니다.</p>
                                )}
                            </div>
                            {checkmno &&
                                <CardFooter>
                                    <FormGroup style={{marginTop: '20px'}}>
                                        <Label>댓글 작성</Label> {error?.content ? <small style={{color: "red"}}>{error?.content}</small> : "" }
                                        <Input type="textarea" placeholder="진행상황을 입력하세요"
                                               name={"replyContent"}
                                               value={content}
                                               onChange={handleChangeReplyContent}
                                        />
                                    </FormGroup>

                                    <div className="button-group" style={{marginTop: '10px'}}>
                                        <Button color="primary" className="me-2" onClick={handleClickReplyAdd}>댓글
                                            저장</Button>
                                    </div>
                                </CardFooter>
                            }
                        </FormGroup>
                    </CardBody>
                </Card>
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
                                    width="1250"
                                    height="auto"
                                />
                                <Button
                                    href={imageUrls[index]}
                                    download={file.oldFileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{marginRight: "10px"}}
                                >
                                    이미지 다운로드
                                </Button>
                            </div>
                        ))}
                    </div>
                </FormGroup>
                <div className="button-group">
                    <Button color="primary" className={"me-2"} onClick={() => moveToIssueModify(issue.ino)}>수정</Button>
                    <Button color="secondary" className={"me-2"}
                            onClick={backToList}>목록보기</Button>
                </div>
            </Form>
        </div>
    );

}

export default ProjectIssueReadComponent;