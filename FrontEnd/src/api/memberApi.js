import axios from "axios";
import data from "bootstrap/js/src/dom/data";

const API_SERVER_HOST = 'http://mbc-webcloud.iptime.org:8102/it'

const host = `${API_SERVER_HOST}/members`

const header = {headers: {"Content-Type": "x-www.form.urlencoded"}};

export const BankCode = async() => {
    const bankResult = await axios.get(`${host}/bankcode`);
    return bankResult.data;
}


export const loginPost = async (loginParam) => {
    console.log("loginAPI")

    const form = new FormData();
    form.append('username', loginParam.email)
    form.append('password', loginParam.pw)

    console.log(form);
    console.log(header);

    const res = await axios.post(`${host}/login`, form, header)

    return res.data
}

export const registerAccount = async(memberS) => {
    console.log(memberS);
    const form = new FormData();
    form.append('email', memberS.mail);
    form.append('name', memberS.name);
    form.append('tel', memberS.phoneNum);

    const res = await axios.post(`${host}/account`, form, header)

    return res.data;
}

export const readData = async (data) => {
    if (!data) {
        console.error("No data provided for readData function");
        return null; // 처리하지 않도록
    }

    try {
        const res = await axios.get(`${host}/one/${data}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // 예외 처리
    }
};




// export const readOne = async (memberS) => {
//     console.log(memberS.name);
//     console.log(memberS.phoneNum);
//     console.log(memberS.mail);
//
//     // 쿼리 문자열로 데이터 설정
//     const params = new URLSearchParams();
//     params.append('email', memberS.mail);
//     params.append('name', memberS.name);
//     params.append('tel', memberS.phoneNum);
//
//     try {
//         // axios.get을 사용하여 쿼리 문자열로 데이터를 전송
//         const res = await axios.get(`${host}/one`, { params, headers: header });
//
//         return res.data;
//     } catch (error) {
//         console.error("Error fetching data", error);
//         throw error;  // 오류가 발생하면 호출한 곳에서 처리하도록 던짐
//     }
// };


export const registerMember = async (registerParam) => {

    console.log(registerParam)

    const form = new FormData();
    console.log(form);
    form.append('email', registerParam.email);
    form.append('password', registerParam.password);
    form.append('name', registerParam.name);
    form.append('birth', registerParam.birth);
    form.append('tel', registerParam.tel);
    form.append('sex', registerParam.sex);
    form.append('marital_status', registerParam.marital_status);
    form.append('children_count', registerParam.children_count);
    form.append('qualifications', registerParam.qualifications);
    form.append('education', registerParam.education);
    form.append('antecedents', registerParam.antecedents);


    for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
    }

    const res = await axios.post(`${host}/register`, form, header)

    console.log(res.data);

    return res.data
}

export const statusRead = async (mno) => {
    console.log(mno)
    const res = await axios.get(`${host}/${mno}`);
    console.log(res.data);

    return (res.data);
}



export const modifyMember = async (form, mno) => {

    for (let [key, value] of form.entries()) {
        console.log(`${key}: ${value}`);
    }
    const header = {headers: {"Content-Type": "multipart/form-data"}}

    const res = await axios.post(`${host}/modify`, form, header)
    console.log(res.data);
    return res.data;

}

export const getFiles = async (fileName) => {
    console.log(fileName);
    const res = await axios.get(`${host}/getFile/${fileName}`, {
        // 이미지 파일이나, 비디오 파일처럼 바이너리 데이터를 받을때 사용함.
        responseType: "blob"
    })


    console.log(res.data)
    console.log(URL.createObjectURL(res.data))
    // 반환된 데이터가 blob 객체이기 때문에 변환해주는 API가 필요함.

    return res.data;
}

export const getFiles2 = async (fileName2) => {
    console.log(fileName2);
    const res = await axios.get(`${host}/getFile2/${fileName2}`, {
        // 이미지 파일이나, 비디오 파일처럼 바이너리 데이터를 받을때 사용함.
        responseType: "blob"

    })

    console.log(res.data)
    console.log(URL.createObjectURL(res.data))

    return res.data;
}