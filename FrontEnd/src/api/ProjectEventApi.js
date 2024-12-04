import axios from "axios";


const API_PRODUCT_HOST = `http://mbc-webcloud.iptime.org:8103/api/pevent`


// pno와 연결된 ProjectEvent List
export const getAll = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/list/${pno}`)
    return res.data
}

// ProjectEvent Register
export const postAdd = async (event) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_PRODUCT_HOST}/`, event, header)
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

// ProjectEvent Read
export const getOne = async (eno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${eno}`);
    return res.data
}

// ProjectEvent Update
export const putOne = async (event, eno) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.put(`${API_PRODUCT_HOST}/${eno}`, event, header);
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

// ProjectEvent Delete
export const deleteOne = async (eno) => {
    const res = await axios.delete(`${API_PRODUCT_HOST}/${eno}`);
    return res.data
}

// ProjectEvent myList
export const getMyList = async (mno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/mylist/${mno}`);
    return res.data
}