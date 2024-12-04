import axios from "axios";

const API_DOCUMENT_APPROVER_ALARM_HOST = `http://mbc-webcloud.iptime.org:8103/api/document/alarm`
const API_MEMBER_ALARM_HOST = `http://mbc-webcloud.iptime.org:8103/api/member/alarm`

// 문서 개수 불러오기
export const getDocumentApproverCount = async (mno) => {
    const res = await axios.get(`${API_DOCUMENT_APPROVER_ALARM_HOST}/count/${mno}`)
    return res.data
}


// 문서  new 삭제하기
export const deleteDocumentApproverCount = async (dno) => {
    const res = await axios.delete(`${API_DOCUMENT_APPROVER_ALARM_HOST}/${dno}`)
    return res.data
}

// 문서 개수 불러오기
export const getDocumentWriterCount = async (writer) => {
    const res = await axios.get(`${API_DOCUMENT_APPROVER_ALARM_HOST}/wcount/${writer}`)
    return res.data
}

// 문서 new 삭제하기
export const deleteDocumentWriterCount = async (dno) => {
    const res = await axios.delete(`${API_DOCUMENT_APPROVER_ALARM_HOST}/w/${dno}`)
    return res.data
}

