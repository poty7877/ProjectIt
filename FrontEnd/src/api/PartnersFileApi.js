import axios from "axios";

const API_PARTNERS_HOST = `http://mbc-webcloud.iptime.org:8103/api/partners/file`

// ProjectIssueFiles Register
export const postUploadFile = async (uploadFiles, cno) => {
    const header = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
    const res = await axios.post(`${API_PARTNERS_HOST}/`, uploadFiles, cno, header)
    return res.data;
}

// ProjectIssueFiles Read
export const getFilesList = async (cno) => {
    const res = await axios.get(`${API_PARTNERS_HOST}/${cno}`)
    return res.data;
}

// ProjectIssueImages Read
export const getFiles = async (fileName) => {
    const res = await axios.get(`${API_PARTNERS_HOST}/view/${fileName}`, {
        // 이미지 파일이나, 비디오 파일처럼 바이너리 데이터를 받을때 사용함.
        responseType: "blob"
    })
    // 반환된 데이터가 blob 객체이기 때문에 변환해주는 API가 필요함.
    return URL.createObjectURL(res.data);
}

// delete ProjectIssueImages
export const deleteFile = async (fno) => {
    const res = await axios.delete(`${API_PARTNERS_HOST}/${fno}`);
    return res.data
}
