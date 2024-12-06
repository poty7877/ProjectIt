<h1  align='center'>Project It</h1>

# ERP 시스템 웹 페이지 (팀 프로젝트)

## 데모 홈페이지
http://ysy.tplinkdns.com:8004/

Spring Boot와 React를 활용해 IT 기업에서 사용할 수 있는 ERP 시스템을 개발한 팀 프로젝트입니다.  

## 🚩 개요
- **프로젝트 기간:** 2024년 10월 28일 ~ 2024년 11월 28일 (24일)
- **참여 인원:** 3명
- **목표:** IT 기업 내부에서 사용 가능한 ERP시스템 구현
- **주요 기능:**
  - 사용자 관리 (로그인, 인사관리)
  - 프로젝트 관리 (등록, 수정, 일정 및 상태관리)
  - 자원 관리 (등록, 수정, 상태관리)


## 프로젝트 설명 영상
[![Watch the video](https://img.youtube.com/vi/cYiKhlWzpkM/0.jpg)](https://www.youtube.com/watch?v=cYiKhlWzpkM)




## 🛠️ 사용 기술
- **Backend:** Spring Boot, JPA, MariaDB, MongoDB  
- **Frontend:** React, Redux  
- **Authentication:** JWT 기반 인증  
- **Deployment:** Nginx

## 🙋‍♂️ ** 개인 역할 및 기여 **
### 1. **백엔드 개발**
<details>
- **Spring Boot**와 JPA를 활용해 RESTful API를 설계 및 구현.
- 프로젝트 CRUD 및 상태 관리 API
- 프로젝트 이슈 CRUD 및 상태 관리 API
- 캘린더 이벤트 처리 API
- 채팅방, 채팅참가인원 관리 API
- 결재 요청 문서 CRUD 및 상태 관리 API
- 고객사 CRUD 및 상태 관리 API
- 프로젝트 이슈 및 결재 요청에 대한 알림 이벤트 처리 API 
</details>

### 2. **DB 설계 및 최적화**
<details>
- MariaDB를 사용하여 데이터베이스를 설계.
    - 프로젝트, 프로젝트 참여인원, 일정, 프로젝트 이슈, 고객사 데이터 테이블 구조 설계
    - 효율적인 쿼리 작성을 위한 인덱스 추가
- MongoDB를 사용하여 채팅메시지 데이터 관리.
    - 메시지의 경우 실시간으로 많은 양의 데이터가 조회되고 추가 되기 때문에 DB 따로 분리.
</details>

### 3. **프론트엔드 개발**
<details>
- **React**를 활용해 ERP 웹 애플리케이션의 사용자 인터페이스(UI)를 개발.
    - **프로젝트 관리 페이지**: 프로젝트 등록/수정 및 상태 관리를 위한 UI 개발.
    - **프로젝트 이슈 관리 페이지**: 프로젝트 이슈 등록/수정 및 상태 관리를 위한 UI개발.
    - **캘린더 기능**: Full-Calendar 라이브러리 활용한 일정 관리 화면 구현.
    - **채팅방 기능**: WebSocket을 활용한 채팅방 기능 및 화면 구현.
    - **문서 기능**: 문서 등록/수정 및 상태 관리를 위한 UI 개발.
    - **고객사 기능** : 고객사 등록/수정 및 상태관리를 위한 UI 개발.
 
- **Axios**를 사용 API와의 데이터 연동을 위한 비동기 요청 처리

- **ReactStrap** 으로 UI 구성 및 반응형 디자인 적용.
</details>

### 4. **팀원 협업 지원 및 MSA 환경 운영**
  <details>
- API연동과 데이터 테스트를 통해 팀원 간 협업 원활화.
  
- **MSA 아키텍처** 를 기반으로 총 6개의 서버(DB 2개, BackEnd 3개, FrontEnd 1개) 운영:
    - 백엔드 서비스를 분리하여 유지보수 및 확장성 강화.
    - 각 서비스 간 RestFul API를 통해 통신.
- **SourceTree**를 활용한 Git 버전 관리 및 배포 지원:
    - 백엔드와 프론트 엔드 코드를 효율적으로 관리하여 팀원의 작업 충돌 최소화.
    - Git 브랜치 전략(예: `Project`, `license`, `member`)을 적용하여 코드 품질 유지.
    - 릴리스 버전 태그를 통해 주요 업데이트 이력을 체계적으로 관리.
    - 배포 전 테스트 완료 후, 수동으로 변경 사항을 병합하고 운영 서버에 배포.
</details>

## 🎯 주요 성과
- 팀 내 협업을 통해 1개월만에 완성된 ERP 시스템 프로토타입.
- 원스톱 페이지 구조를 설계하여 외부 프로그램 없이 모든 기능을 단일 페이지에서 제공.
    - 사용자 편의성을 위해 복잡한 기능들을 한 화면에서 직관적으로 처리 가능하도록 구현.
- 프로젝트 관리 및 일정 관리 기능을 직관적으로 구현하여 업무 효율성 향상.
- 문서 결재 요청시 현재 회사가 보유한 Software, Hardware를 한눈에 파악 가능.

## 문제 해결 (Troubleshooting)

1. **문제: 모달창 안에서의 페이징 처리 실패**
  <details>
   - 발생 원인: route와 url이 없어 페이징처리가 안되고있음.
   - 해결 방법: 
     - react의 특성을 이용해 실제 페이지 이동이아닌 데이터만 갈아끼우는 형식으로 변경.
     - 페이지 버튼 클릭시 api를 통해 해당 페이지의 데이터를 불러와 표시.
     - 검색기능은 빠른 처리를 위해 페이징된 데이터가아닌 리스트api를 이용해 한번에 필터링 하는 형식으로 변경.
   - 결과: 검색기능과 페이징처리 둘다 작동.
  </details>

2. **문제: 페이지 로딩 속도 저하**
  <details>
   - 발생 원인: 프론트엔드의 비효율적인 API 호출. 팀장,작성자 이름 표시할때 데이터베이스에 저장되있지않아 api를 통해 페이지당 10개의 api호출이 이루어지고있음
   - 해결 방법: 프로젝트 테이블에 작성자 이름 추가하여 페이지 로딩시간 단축.
   - 결과: 페이지 로딩 시간이 3초 → 1초로 단축.
  </details>
  
3. **문제: WebSocket사용시 데이터 전달 오류**
  <details>
   - 발생 원인: 채팅메시지를 보낸 시간은 LocalDateTime 타입. ObjecMapper 사용시 이 타입은 Json으로 직렬화,역직렬화가 불가
   - 해결 방법: jackson-datatype-jsr310 의존성 추가후 dto에 @JsonSerialize, @JsonDeserialize 추가
   - 결과: 오류없이 직렬화, 역직렬화 작동.
  </details>
  
4. **문제: 채팅메시지 보낼시 로딩 속도 저하**
  <details>
   - 발생 원인: 채팅메시지 보낼 때 마다, 채팅방에 있는 메시지 전체를 다시 불러오고 있음.
   - 해결 방법:
     - 처음 채팅방 오픈 시에만 전체 메시지를 불러오도록 변경.
     - 이후 채팅메시지 보내면 이미 셋팅되어있는 전체 메시지에 보낸 메시지만 추가함.
     - 메시지 보낼때 Post방식으로 저장하고 Get방식으로 전체 메시지를 불러와 리로드 하는 방식에서
     - 보낸 메시지만 추가해 보여주는 방식으로 변경
   - 결과 : 채팅방 로딩 시간이 1초 -> 0.2초로 단축
  </details>
  
## 📞 연락처
- Email: kuc00623@gmail.com
- GitHub: https://github.com/poty7877
