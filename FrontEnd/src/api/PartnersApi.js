import axios from "axios";

const API_PARTNERS_HOST = `http://mbc-webcloud.iptime.org:8103/api/partners`

// partners List
export const getList = async (pageParam) => {
    const {page, size} = pageParam
    const res = await axios.get(`${API_PARTNERS_HOST}/list`, {
        params: {
            page: page,
            size: size,
        }
    })
    return res.data
}

// name, phone으로 검색
export const getOne = async (name, phone) => {
    console.log(name, phone)
    const res = await axios.get(`${API_PARTNERS_HOST}/info`, {
        params: {
            name: name,
            phone: phone
        }
    });
    return res.data
}

// 등록
export const postAdd = async (infoPartnersDTO) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_PARTNERS_HOST}/`, infoPartnersDTO, header)
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

// 수정화면 기본 정보 불러올때 사용
export const getOneByCno = async (cno) => {
    const res = await axios.get(`${API_PARTNERS_HOST}/${cno}`);
    return res.data
}

// 수정
export const putOne = async (infoPartnersDTO) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.put(`${API_PARTNERS_HOST}/${infoPartnersDTO.cno}`, infoPartnersDTO, header)
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

// 삭제
export const deleteOne = async (cno) => {
    const res = await axios.delete(`${API_PARTNERS_HOST}/${cno}`);
    return res.data
}

// 고객사 전체 리스트
export const getListUp = async () => {
    const res = await axios.get(`${API_PARTNERS_HOST}/listup`);
    return res.data
}

