import axios from "axios";

const API_PRODUCT_HOST = `http://ysy.tplinkdns.com:8003/api/project/files`

// ProjectIssueFiles Register
export const postUploadFile = async (uploadFiles, ino) => {
    const header = {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
    const res = await axios.post(`${API_PRODUCT_HOST}/`, uploadFiles, ino, header)
    return res.data;
}

// ProjectIssueFiles Read
export const getFilesList = async (ino) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${ino}`)
    return res.data;
}

// ProjectIssueImages Read
export const getImages = async (fileName) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/view/${fileName}`, {
        // 이미지 파일이나, 비디오 파일처럼 바이너리 데이터를 받을때 사용함.
        responseType: "blob"
    })
    // 반환된 데이터가 blob 객체이기 때문에 변환해주는 API가 필요함.
    return URL.createObjectURL(res.data);
}

export const deleteImage = async (fno) => {
    const res = await axios.delete(`${API_PRODUCT_HOST}/${fno}`)
    return res.data
}
