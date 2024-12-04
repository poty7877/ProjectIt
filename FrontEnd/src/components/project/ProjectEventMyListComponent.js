'use client';

import React, {useEffect, useState} from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import "../../styles/calendar.css"
import {getMyList} from "../../api/ProjectEventApi";
import EventReadModal from "../projectModal/EventReadModal";
import {getCookie} from "../../util/cookieUtil";
import {useNavigate, useParams} from "react-router-dom";

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
    const {mno} = useParams()
    // 조회, 수정, 삭제 Modal
    const [rmodalOpen, setRmodalOpen] = useState(false);
    // 이벤트값
    const [events, setEvents] = useState([initState]);
    // 이벤트 번호
    const [eno, setEno] = useState(null);
    // 수정 권한
    const [isEditable, setIsEditable] = useState(false);

    const navigate = useNavigate();

    const token = getCookie("member");

    // 새 탭에서 localStorage에서 'isEditable' 값 읽기
    useEffect(() => {
        const storedIsEditable = localStorage.getItem('isEditable');
        if (storedIsEditable) {
            setIsEditable(JSON.parse(storedIsEditable));
        }
    }, []);

    // pno 변경시마다 fetchEvents함수 호출
    useEffect(() => {
        if (token?.mno) {
            fetchEvents();
        } else {
            alert("로그인 하세요!")
            navigate(-1)
        }
    }, [mno])

    // 새로고침 함수
    const fetchEvents = () => {
        // pno를 이용해서 프로젝트 일정 가져옴
        getMyList(mno).then(data => {
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


    // Modal창 끄기
    const toggleRmodal = (end) => {
        setRmodalOpen(!rmodalOpen);
        if (rmodalOpen) {
            fetchEvents();
        }
    }

    return (
        <div id="calendar-container">
            <div>

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

                {/* 이벤트 조회, 수정, 삭제 모달 */}
                <EventReadModal isOpen={rmodalOpen} callbackFn={toggleRmodal} eno={eno}
                                isEditable={isEditable}/>

            </div>

        </div>
    );
}

export default CalendarComponent;
