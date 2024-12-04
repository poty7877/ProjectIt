import axios from "axios";

/*const API_SERVER_HOST = 'http://192.168.0.212/it'*/
const API_PRODUCT_HOST = `http://mbc-webcloud.iptime.org:8103/api/project`
const list = `${API_PRODUCT_HOST}/list`


// 삭제되지않은 일반 Project List.
export const getList = async (pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam

    const res = await axios.get(list, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchType: searchType,
            searchText: searchText,
        }
    })
    return res.data
}

// 로그인 후 내가 참여중인 Project List
export const getMyList = async (mno, pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam

    const res = await axios.get(`${API_PRODUCT_HOST}/list/${mno}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchType: searchType,
            searchText: searchText,
        }
    })
    return res.data
}


// 삭제된 Project List
export const getDeleteList = async (pageParam) => {
    const {page,size} = pageParam
    const res = await axios.get(`${API_PRODUCT_HOST}/deletedList`, {
        params: {
            page: page,
            size: size
        }
    })
    return res.data
}

// Project Register
export const postAdd = async (project) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_PRODUCT_HOST}/`, project, header)
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

// Project Read
export const getOne = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${pno}`);
    return res.data
}

// Project Update
export const putOne = async (project, pno) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.put(`${API_PRODUCT_HOST}/${pno}`, project, header)
    return res.data;
}

// Project isDeleted update = true
export const deleteOne = async (pno) => {
    const res = await axios.put(`${API_PRODUCT_HOST}/delete/${pno}`);
    return res.data
}

// Project isDeleted update = false
export const deleteCancel = async (pno) => {
    const res = await axios.put(`${API_PRODUCT_HOST}/deleteCancel/${pno}`);
    return res.data
}

// Project foreverDelete
export const deleteForeverOne = async (pno) => {
    const res = await axios.delete(`${API_PRODUCT_HOST}/${pno}`);
    return res.data
}


