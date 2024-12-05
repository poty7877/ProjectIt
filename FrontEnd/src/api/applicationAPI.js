import axios from "axios";
import { Form } from "reactstrap";

const API_SERVER_HOST = 'http://ysy.tplinkdns.com:8002/it'

const host = `${API_SERVER_HOST}/application`

const header = {headers: {"Content-Type": "x-www.form.urlencoded"}};


// API 요청 함수
export const list = async (pageParam) => {
    const { page, size, searchQuery } = pageParam;

    // 검색어가 있을 경우 params에 추가
    const params = { page, size };
    if (searchQuery) {
        params.searchQuery = searchQuery; // 검색어 추가
    }

    // axios를 사용하여 서버에 GET 요청
    const res = await axios.get(`${host}/page`, { params });

    console.log(res.data); // 응답 데이터 확인

    return res.data;
};


export const add = async (formData) => {   

    console.log('ModalData : ' + formData)
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    const header = {headers: {"Content-Type": "multipart/form-data"}}
   
    const res = await axios.post(`${host}/register`, formData, header)

    console.log(res.data);

    return res.data
}

export const readOne = async (no) => {
    console.log('no : ' + no)
    const res = await axios.get(`${host}/getOne/${no}`);
    console.log(res)
    return res.data;    
}

export const modifyMember = async (memberS) => {
    console.log('ModalData : ' + memberS.no)

    const form = new FormData();
    form.append('no', memberS.no)
    form.append('joinStatus', memberS.joinStatus)

    form.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    })

    const header = {headers: {"Content-Type": "multipart/form-data"}}
   
    const res = await axios.post(`${host}/modify`, form, header)

    console.log(res.data);

    return res.data

}

export const getFiles = async (fileName) => {
    const res = await axios.get(`${host}/getFile/${fileName}`, {
        // 이미지 파일이나, 비디오 파일처럼 바이너리 데이터를 받을때 사용함.
        responseType: "blob"
    })
    console.log(res.data)
    console.log(URL.createObjectURL(res.data))
    // 반환된 데이터가 blob 객체이기 때문에 변환해주는 API가 필요함.
    
    return URL.createObjectURL(res.data);
}

