import React, {useEffect, useRef, useState} from "react";
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardHeader,
    MDBCardBody,
    MDBCardFooter,
    MDBBtn,
} from "mdb-react-ui-kit";
import '../../assets/images/ChatRoom.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {getChatRoom, getMessage, sendMessage} from "../../api/ChatApi";
import {useParams} from "react-router-dom";
import {getCookie} from "../../util/cookieUtil";
import {getList} from "../../api/ProjectMemberApi";
import ChatMemberListModal from "../projectModal/ChatMemberListModal";

const ChatRoomComponent = () => {

    const MEMBER_ROLE_KOR = {
        CONTRACT_WORKER: "계약직",
        INTERN: "인턴",
        STAFF: "사원",
        ASSOCIATE: "주임",
        ASSISTANT_MANAGER: "대리",
        MANAGER: "과장",
        DEPUTY_MANAGER: "차장",
        GENERAL_MANAGER: "부장",
        DIRECTOR: "이사",
        SENIOR_DIRECTOR: "상무 이사",
        EXECUTIVE_VICE_PRESIDENT: "전무이사",
        PRESIDENT: "사장",
        VICE_CHAIRMAN: "부회장",
        CHAIRMAN: "회장",
        CEO: "대표이사",
        팀장: "팀장"
    };


    // pno (프로젝트 번호를 url에서 가져옴)
    const {pno} = useParams();
    // 채팅방 설정
    const [chatRoom, setChatRoom] = useState({});
    // 메시지 설정
    const [chatMessage, setChatMessage] = useState(null);
    // 채팅참여 인원 설정
    const [cuno, setCuno] = useState(null);
    // 메시지 가져오기
    const [allMessage, setAllMessage] = useState([]);
    // 채팅 오픈 모달
    const [isChatOpen, setIsChatOpen] = useState(false);
    // 작성자
    const [writer, setWriter] = useState([]);
    // 모달창 오픈
    const [modal, setModal] = useState(false);
    // 메시지 올때 맨 아래로 스크롤 가게
    const messageEndRef = useRef(null); // 메시지 영역의 끝을 참조하는 ref

    useEffect(() => {
        getChatRoom(pno).then(data => {
            setChatRoom(data);
            console.log(data);
            if (isChatOpen) {
                console.log("채팅방이 이미 열려 있습니다.");
                return; // 이미 열린 채팅방이므로 새로운 요청을 막음
            }

            setIsChatOpen(true); // 채팅방이 열린 상태로 설정

            const loginMno = token?.mno;
            if (loginMno && data.chatUsersIds.includes(loginMno)) {
                setCuno(loginMno); // Set current user ID as cuno
            } else {
                console.error("참여 프로젝트 멤버가 아닙니다.");
            }

            getMessage(data.crno).then(response => {
                setAllMessage(response)
                console.log(response);
            })
            return () => {
                setIsChatOpen(false); // 컴포넌트 언마운트 시 채팅방 상태를 닫힘으로 변경
            };
        })
    }, [pno])

    useEffect(() => {
        // 스크롤을 맨 아래로 이동
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessage]); // 메시지가 추가될 때마다 호출


    useEffect(() => {
        getList(pno).then(data => {
            setWriter(data)
            console.log(data)
        })
    }, [pno])

    const handleChangeMessage = (e) => {
        setChatMessage(e.target.value); // 채팅 메시지 값 업데이트
    }

    const handleClickModal = () => {
        setModal(true);
    }

    const callbackFn = () => {
        setModal(false)
    }


    const currentDate = new Date();
    const formattedTime = currentDate.getFullYear() + "-" +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
        currentDate.getDate().toString().padStart(2, '0') + " " +
        currentDate.getHours().toString().padStart(2, '0') + ":" +
        currentDate.getMinutes().toString().padStart(2, '0');


    const token = getCookie("member");
    const handleClickSend = () => {
        const trimmedMessage = chatMessage.trim();
        const formData = {
            crno: chatRoom.crno,
            cuno: cuno, // 채팅방에 참여중인사람 == 지금 로그인 한사람
            message: chatMessage,
            createdAt: formattedTime
        }

        if (trimmedMessage) {
            sendMessage(formData).then(data => {
                console.log(data);
            })
        }
        setChatMessage("");
    }


    useEffect(() => {
        const socket = new WebSocket('ws://ysy.tplinkdns.com:8003/ws/alarms');

        socket.onopen = () => {
            console.log('웹소켓 오픈!');
        };

        socket.onmessage = (event) => {
            console.log('웹소켓 메시지:', event.data);
            // 메시지 데이터를 처리하고 상태에 추가
            const newMessage = JSON.parse(event.data);
            setAllMessage(prevMessages => [...prevMessages, newMessage]);
        };

        socket.onerror = (error) => {
            console.error('웹소켓 에러:', error);
        };

        return () => {
            socket.close();
            console.log('웹소켓 연결 종료');
        };
    }, [pno]);

    const handleKeyDown = (e) => {
            if (e.key === "Enter") {  // 엔터키가 눌렸을 때
                e.preventDefault();  // 엔터키로 새 줄이 추가되는 것을 방지
                handleClickSend();  // 메시지 전송
            }
    }


    return (
        <MDBContainer fluid className="py-5" style={{backgroundColor: "#eee"}}>
            <MDBRow className="d-flex justify-content-center">
                <MDBCol md="10" lg="8" xl="6">
                    <MDBCard id="chat2" style={{borderRadius: "15px"}}>
                        <MDBCardHeader className="d-flex justify-content-between align-items-center p-3">
                            <h5 className="mb-0">{chatRoom.name}</h5>
                            <MDBBtn color="primary" size="sm" rippleColor="dark" onClick={handleClickModal}>
                                참여 멤버
                            </MDBBtn>
                        </MDBCardHeader>
                        <MDBCardBody className="chat-messages">
                            {/* 메시지 표시 */}
                            {allMessage ? allMessage.map((message, index) => {
                                const isCurrentUser = message.cuno === token?.mno; // 현재 로그인한 사용자와 메시지 보낸 사람 비교
                                const messageWriter = writer.find(w => w.mno === message.cuno);
                                return (
                                    <div key={index}
                                         className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div>
                                            <small>{messageWriter ? `${messageWriter.name} ${MEMBER_ROLE_KOR[messageWriter.memberRole]}` : ""}</small>
                                            <p
                                                className={`small p-2 ${isCurrentUser ? 'me-3 mb-1 text-white rounded-3 bg-primary' : 'ms-3 mb-1 rounded-3'}`}
                                                style={isCurrentUser ? {backgroundColor: "#007bff"} : {backgroundColor: "#f5f6f7"}}
                                            >
                                                {message.message}
                                            </p>
                                            <p className={`small ${isCurrentUser ? 'me-3 mb-3 rounded-3 text-muted d-flex justify-content-end' : 'ms-3 mb-3 rounded-3 text-muted'}`}>
                                                {message.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }) : ""}
                            <div ref={messageEndRef}/>
                        </MDBCardBody>
                        <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="exampleFormControlInput1"
                                placeholder="Type message"
                                name="chatMessage"
                                value={chatMessage}
                                onChange={handleChangeMessage}
                                onKeyDown={handleKeyDown}
                            ></input>
                            <MDBBtn onClick={handleClickSend} style={{width:80, height:45}}>전송</MDBBtn>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
                <ChatMemberListModal isOpen={modal} callbackFn={callbackFn} writer={writer}/>
            </MDBRow>
        </MDBContainer>
    );
}

export default ChatRoomComponent;