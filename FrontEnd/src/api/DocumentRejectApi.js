import axios from "axios";

const API_DOCUMENT_HOST = `http://ysy.tplinkdns.com:8003/api/document/reject`


// 문서 반려 등록
export const postAdd = async (documentReject) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.post(`${API_DOCUMENT_HOST}/`, documentReject, header)
    return res.data
}

// 문서 반려사유 조회
export const getDocumentReject = async (dno) => {
    const res = await axios.get(`${API_DOCUMENT_HOST}/${dno}`)
    return res.data
}