package com.project.it.constant;

public enum ProjectIssueStatus {
    // 프로젝트 이슈의 진행상태를 나타냄
    // 등록, 작업중, 대기중, 완료, 작업 불가
    
    REGISTERED, // 등록됨
    PROGRESSING, // 작업중
    HOLD, // 보류중
    COMPLETED, // 완료
    CANCELED, // 취소
}
