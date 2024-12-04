import axios from "axios";

const API_PRODUCT_HOST = `http://mbc-webcloud.iptime.org:8103/api/projectpartner`

// 고객사 정보 등록
export const postAdd = async (projectPartner) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_PRODUCT_HOST}/`, projectPartner, header)
        return {success: true, data: res.data};
    } catch (error) {
        // 에러 처리: 백엔드에서 반환된 에러 메시지
        if (error.response && error.response.data) {
            return {success: false, errors: error.response.data};
        }
        // 기타 에러 처리
        return {success: false, errors: {message: "서버와의 통신에 실패했습니다."}};
    }

}

// 고객사 정보 가져오기
export const getOnePp = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${pno}`);
    return res.data;
}

// 고객사 정보 수정
export const putOne = async (projectPartner) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.put(`${API_PRODUCT_HOST}/${projectPartner.ppno}`, projectPartner, header);
        return {success: true, data: res.data};
    } catch (error) {
        // 에러 처리: 백엔드에서 반환된 에러 메시지
        if (error.response && error.response.data) {
            return {success: false, errors: error.response.data};
        }
        // 기타 에러 처리
        return {success: false, errors: {message: "서버와의 통신에 실패했습니다."}};
    }
}