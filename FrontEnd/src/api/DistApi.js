/*물류 Distribution 공통 Api*/
import axios from "axios"
import { API_DISTRIBUSUION_HOST } from "./LicenseApi"

export const prefixFile = `${API_DISTRIBUSUION_HOST}/dist/file`

/* 공통 : file download */
export const fileDownload = async (path, filename) => {
    const res = await axios({method:'GET' , url: `${prefixFile}/${path}/${filename}`, responseType:'blob'})
    return res.data
}


/* fileList : 전체 리스트*/
export const getFileAllList = async(pageParam)=>{
    const{page, size} = pageParam;
    const res = await axios.get(`${prefixFile}/all`, {params:{page:page, size:size}});
    return res.data;
}

/* fileList : 삭제여부 따라*/
export const getFileStateList = async(pageParam, state) =>{
    const{page, size} = pageParam;
    const res = await axios.get(`${prefixFile}/all/${state}`, {params:{page:page, size:size}});
    return res.data;
}

/* fileList : 리스트 복구(삭제처리 취소)*/
export const restoreFiles = async(fnos) =>{
    const res = await axios.put(`${prefixFile}/restore`, fnos);
    return res.data;
}

/* fileList : 리스트 영구삭제(db삭제)*/
export const removeFileList = async(fnos) =>{
    const res = await axios.delete(`${prefixFile}/remove`, fnos);
    return res.data;
}

