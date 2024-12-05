import axios from "axios";

const API_DOCUMENT_HOST = `http://ysy.tplinkdns.com:8003/api/document`


// 결재 대기중 리스트
export const getList = async (pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam

    const res = await axios.get(`${API_DOCUMENT_HOST}/requested`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchText: searchText,
            searchType: searchType,
        }
    })
    return res.data
}

// 결재 완료 리스트
export const getApprovedList = async (pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam
    const res = await axios.get(`${API_DOCUMENT_HOST}/approved`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchText: searchText,
            searchType: searchType,
        }
    })
    return res.data
}

// 결재 반려 리스트
export const getRejectedList = async (pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam
    const res = await axios.get(`${API_DOCUMENT_HOST}/rejected`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchText: searchText,
            searchType: searchType,
        }
    })
    return res.data
}

// 결재 해야할 리스트
export const getApproverList = async (mno, pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam
    const res = await axios.get(`${API_DOCUMENT_HOST}/approver/${mno}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchText: searchText,
            searchType: searchType,
        }
    })
    return res.data
}

// 결재 반려 리스트
export const getWriterList = async (writer, pageParam) => {
    const {page, size, sort, order, searchType, searchText} = pageParam
    const res = await axios.get(`${API_DOCUMENT_HOST}/writer/${writer}`, {
        params: {
            page: page,
            size: size,
            sort: sort,
            order: order,
            searchText: searchText,
            searchType: searchType,
        }
    })
    return res.data
}

// 문서 등록
export const postAdd = async (document) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    try {
        const res = await axios.post(`${API_DOCUMENT_HOST}/`, document, header)
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

// 문서 조회
export const getOne = async (dno) => {
    const res = await axios.get(`${API_DOCUMENT_HOST}/${dno}`)
    return res.data
}

// 문서 수정
export const putOne = async (dno, document) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.put(`${API_DOCUMENT_HOST}/${dno}`, document, header)
    return res.data
}