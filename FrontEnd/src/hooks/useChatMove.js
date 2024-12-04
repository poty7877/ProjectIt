// 전역적으로 창을 관리할 객체
const chatWindows = {};

const useChatMove = () => {
    const moveToChatRoom = (pno, isProjectMember) => {
        const windowName = `chatroom_${pno}`; // 고유 창 이름
        localStorage.setItem('isProjectMember', JSON.stringify(isProjectMember));

        // 이미 열린 창인지 확인
        if (chatWindows[pno] && !chatWindows[pno].closed) {
            // 창이 열려있고 닫히지 않았다면 focus
            chatWindows[pno].focus();
            return;
        }

        // 새 창 열기
        const newChatWindow = window.open(
            `../chatroom/${pno}`,
            windowName, // 창 이름으로 관리
            'width=600,height=675,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes'
        );

        // 새 창 핸들을 전역 변수에 저장
        if (newChatWindow) {
            chatWindows[pno] = newChatWindow;
            newChatWindow.focus();
        }
    };

    return {
        moveToChatRoom,
    };
};

export default useChatMove;
