'use client';

import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "../../styles/calendar.css"
import EventModal from "../projectModal/EventModal";
import {useParams} from "react-router-dom";
import {getAll} from "../../api/ProjectEventApi";
import EventReadModal from "../projectModal/EventReadModal";
import {getOne} from "../../api/ProjectApi";

// 이벤트 값 초기 상태
const initState = {
    eno: 0,
    isFirst: true,
    pno: 0,
    title: "",
    start: "",
    end: ""
}

function CalendarComponent() {
    // pno를 파라미터로 사용
    const {pno} = useParams()
    // 새로 등록하는 Modal
    const [modalOpen, setModalOpen] = useState(false);
    // 조회, 수정, 삭제 Modal
    const [rmodalOpen, setRmodalOpen] = useState(false);
    // 이벤트값
    const [events, setEvents] = useState([initState]);
    // 이벤트 번호
    const [eno, setEno] = useState(null);
    // 프로젝트 참여멤버 인지 확인
    const [isProjectMember, setIsProjectMember] = useState(false);
    // 프로젝트 객체
    const [project, setProject] = useState({});

    // 새로고침 함수
    const fetchEvents = () => {
        // pno를 이용해서 프로젝트 일정 가져옴
        getAll(pno).then(data => {
            // 아래 메서드는 기존 FullCalendar의 이벤트 바가 등록한 end 날짜에 비해 하루 일찍끝남.
            // 보여지는 이벤트 바 값만 하루 늘려주는 함수임.
            const adjustedEvents = data.map(event => {
                const endDate = new Date(event.end);
                endDate.setDate(endDate.getDate() + 1); // 하루 더하기
                return {...event, end: endDate.toISOString().split('T')[0]}; // ISO 형식으로 변환하여 날짜만 가져오기
            });
            setEvents(adjustedEvents);
        });
    }
    // Event 버튼 클릭시
    const handleEventClick = (info) => {
        // 이벤트 오브젝트에 정보를 넣음
        const eventObj = info.event;
        // eno, 이벤트 번호를 가져오고
        setEno(eventObj.extendedProps.eno);
        // 조회하는 모달 창 오픈
        setRmodalOpen(true);
    };
    // Add버튼 클릭시 모달창 오픈
    const handleClickAdd = () => {
        setModalOpen(true)
    }
    // Modal창 끄기
    const toggleModal = () => {
        setModalOpen(!modalOpen);
        if (modalOpen) {
            fetchEvents();
        }
    }
    // Modal창 끄기
    const toggleRmodal = (end) => {
        setRmodalOpen(!rmodalOpen);
        if (rmodalOpen) {
            fetchEvents();
        }
    }
    // 등록완료 클릭시 창 닫음
    const handleRegisterComplete = () => {
        window.close();
    };

    // pno로 프로젝트 객체 가져옴
    useEffect(() => {
        getOne(pno).then(data => {
            setProject(data)
        })
    }, [pno])

    // 저장된 프로젝트멤버 상태 불러옴( 프로젝트 멤버인지 확인후 수정가능,불가여부 셋팅)
    useEffect(() => {
        const storedIsProjectMember = localStorage.getItem('isProjectMember');
        if (storedIsProjectMember) {
            setIsProjectMember(JSON.parse(storedIsProjectMember));
        }
    }, []);

    // pno 변경시마다 fetchEvents함수 호출
    useEffect(() => {
        fetchEvents();
    }, [pno])


    return (
        <div id="calendar-container">
            <div>
                <h2 style={{textAlign: 'center', fontWeight: 'bold', fontSize: '1.5em', marginBottom: '20px'}}>
                    {project.title}의 일정표 입니다.
                </h2>
                <h5>일정관리는 팀장, 프로젝트 참여 멤버만 가능합니다.</h5>
                {/* FullCalendar 기본 설정값 */}
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    height="auto"
                    headerToolbar={{
                        start: "prev next",
                        center: "title",
                        end: "dayGridMonth dayGridWeek",
                    }}
                    locale={'ko'}
                    events={events}
                    eventClick={handleEventClick} // 이벤트 클릭 핸들러 추가
                />
                {/* 이벤트 등록하는 모달 */}
                <EventModal isOpen={modalOpen} callbackFn={toggleModal} pno={pno}/> {/* 모달 추가 */}

                {/* 이벤트 조회, 수정, 삭제 모달 */}
                <EventReadModal isOpen={rmodalOpen} callbackFn={toggleRmodal} pno={pno} eno={eno}
                                isProjectMember={isProjectMember}/>
                {isProjectMember &&
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>

                        <button className={"btn btn-primary"} onClick={handleClickAdd}>새 일정 등록</button>
                        <button className={"btn btn-secondary"} style={{marginLeft: '10px'}}
                                onClick={handleRegisterComplete}>등록 완료
                        </button>
                    </div>
                }
            </div>

        </div>
    );
}

export default CalendarComponent;
