import axios from "axios";

const API_PRODUCT_HOST = `http://mbc-webcloud.iptime.org:8103/api/pissue`
const list = `http://mbc-webcloud.iptime.org:8103/api/project/list`
const API_REPLY_HOST = `http://mbc-webcloud.iptime.org:8103/api/reply`

// Project List
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

// ProjectIssue List
export const getIssueList = async (pno, pageParam) => {
    const {page, size, sort, order} = pageParam
    const res = await axios.get(`${API_PRODUCT_HOST}/list/${pno}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order
        }
    })
    return res.data
}

// ProjectIssue Register
export const postAdd = async (projectIssue) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_PRODUCT_HOST}/`, projectIssue, header)
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

// ProjectIssue Read
export const getOne = async (ino) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${ino}`);
    return res.data
}

// ProjectIssue Update
export const putOne = async (projectIssue) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.put(`${API_PRODUCT_HOST}/${projectIssue.ino}`, projectIssue, header);
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

// ProjectIssue Delete
export const deleteOne = async (ino) => {
    const res = await axios.delete(`${API_PRODUCT_HOST}/${ino}`);
    return res.data
}


// 수정사항
// mno를 이용해서 내 앞으로 담당이된 이슈리스트 출력해야함.
export const getMyList = async (mno, pageParam) => {
    const {page, size, sort, order} = pageParam
    const res = await axios.get(`${API_PRODUCT_HOST}/mylist/${mno}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order
        }
    })
    return res.data
}


// mno가 null인 count
export const getMcount = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/all/${pno}`);
    return res.data

}


// ProjectIssue List
export const getIssueNullList = async (pno, pageParam) => {
    const {page, size, sort, order} = pageParam
    const res = await axios.get(`${API_PRODUCT_HOST}/nulllist/${pno}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order
        }
    })
    return res.data
}

// project Issue Count
export const getIssueCount = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/count/${pno}`);
    return res.data;
}

export const postReplyAdd = async (projectIssueReply) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_REPLY_HOST}/`, projectIssueReply, header);
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
