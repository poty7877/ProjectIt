const useChangeData = () => {
    const roleNameMapping = {
        CONTRACT_WORKER: '계약직',
        INTERN: '인턴',
        STAFF: '사원',
        ASSOCIATE: '주임',
        ASSISTANT_MANAGER: '대리',
        MANAGER: '과장',
        DEPUTY_MANAGER: '차장',
        GENERAL_MANAGER: '부장',
        PRESIDENT: '사장',        
    };

    const changeRoleName = (data) => {
        return roleNameMapping[data] || data;
    };

    const teamNameMapping ={
        AWAIT: '부서발령대기',
        TECHNIC: '기술부',
        PERSONNEL: '인사부',
        ACCOUNTING: '회계부',
        FINANCIAL_MANAGEMENT: '재무관리팀',
    };

    const changeTeamName = (data) => {
        return teamNameMapping[data] || data;
    };

    const joinStatusMapping = {
        WAITING: '신규 지원',
        HOLD: '보류',
        DISMISSED: '기각',
        PASSED: '통과',
    }

    const changeJoinStatus = (data)=>{
        return joinStatusMapping[data] || data;
    }

    return{
        changeTeamName,
        changeRoleName,
        changeJoinStatus
        
    };
};

export default useChangeData;