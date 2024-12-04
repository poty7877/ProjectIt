import axios from "axios";


export const submitFormData = async (url, formData) => {
    try {
        // 서버로 폼 데이터 전송
        const response = await axios.post(url, formData, {
            headers: {  "Content-Type": "application/json" },
        });

        // 성공 시 응답 데이터 반환
        return { success: true, data: response.data };
    } catch (error) {
        // 에러 처리: 백엔드에서 반환된 에러 메시지
        if (error.response && error.response.data) {
            return { success: false, errors: error.response.data };
        }
        // 기타 에러 처리
        return { success: false, errors: { message: "서버와의 통신에 실패했습니다." } };
    }
};
