import axios from "axios"

export const API_DISTRIBUSUION_HOST = "http://ysy.tplinkdns.com:8001"
const prefix = `${API_DISTRIBUSUION_HOST}/dist/license`
const prefixAccount = `${API_DISTRIBUSUION_HOST}/dist/account`


/* INFO---------------------------------------------------------------------------------------- */
/* 등록 : info license */
export const registInfo = async (dto) => {
    const res = await axios.post(`${prefix}/info`, dto)
    return res.data
}
/* 조회 one : info license */
export const getOneInfo = async (lno) => {
    const res = await axios.get(`${prefix}/info/${lno}`)
    return res.data
}
/* 조회 all : info license */
export const getListInfo = async (pageParam) => {
    const { page, size } = pageParam;
    const res = await axios.get(`${prefix}/info`,{params:{page:page, size:size}});
    return res.data
}
/* 변경 :info license */
export const modInfo = async (dto) => {
    const res = await axios.put(`${prefix}/info/${dto.lno}`, dto)
    return res.data
}
/* 삭제처리(상태변경) : info license */
export const delInfo = async (lno) => {
    const res = await axios.delete(`${prefix}/info/${lno}`)
    return res.data
}
/* 영구삭제 : info license */
export const delForeverInfo = async (lno) => {
    const res = await axios.delete(`${prefix}/info_del/${lno}`)
    return res.data
}

/* License Asset---------------------------------------------------------------------------------------- */
/* 등록 : asset license */
export const registAsset = async (formData) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await axios.post(`${prefix}/asset`, formData, header)
    return res.data
}
/* 조회 one :asset license(with file list) */
export const getOneAsset = async (ano) => {
    console.log("요청 async ano : "+ano);
    const res = await axios.get(`${prefix}/asset/${ano}`)
    return res.data
}
/* 조회 all : asset license(with paging+file count) */
export const getListAsset = async (pageParam) => {
    const { page, size } = pageParam;
    const res = await axios.get(`${prefix}/asset`,{params:{page:page, size:size}})
    return res.data
}
/* 변경 :asset license(with file list) */
export const modAsset = async (dto) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await axios.put(`${prefix}/asset/${dto.ano}`, dto, header)
    return res.data
}
/* 계약해지 - 삭제처리(상태변경) : asset license(with file list) */
export const cancleAsset = async (ano) => {
    const res = await axios.delete(`${prefix}/asset/${ano}`)
    return res.data
}
/* 영구삭제 : asset license(with file list) */
export const delForeverAsset = async (ano) => {
    const res = await axios.delete(`${prefix}/asset_del/${ano}`)
    return res.data
}

/* Account ---------------------------------------------------------------------------------------- */

/* 등록  -no asset*/
export const registAccount = async (sendData) => {
    console.log(sendData);
    const header = { headers: { "Content-Type": "application/json" } }
    const res = await axios.post(`${prefixAccount}/register`, sendData, header)
    return res.data
}

/* 등록  -asset*/
export const registAssetAccount = async (formData) => {
    const res = await axios.post(`${prefixAccount}/register_asset`, formData)
    return res.data
}
/* 조회 */
export const getOneAccount = async (siNum) => {
    console.log("요청 async siNum : "+siNum);
    const res = await axios.get(`${prefixAccount}/${siNum}`)
    return res.data
}
/* 조회 all  */
export const getListAccount = async (pageParam) => {
    const { page, size } = pageParam;
    const res = await axios.get(`${prefixAccount}/list`,{params:{page:page, size:size}})
    return res.data
}
/* 변경 :리스트 정보변경(주소, 사용여부, 인증여부) */
export const modAccountInfo = async (dto) => {
    const res = await axios.put(`${prefixAccount}/modify_list`, dto)
    return res.data
}

/* 변경 :리스트-계정만 변경 */
export const modAccountList = async (accounts, siNum) => {
    const res = await axios.put(`${prefixAccount}/modify_account/${siNum}`, accounts)
    return res.data
}
/* 삭제처리 */
export const useNotAccount = async (siNum) => {
    const res = await axios.delete(`${prefixAccount}/usenot/${siNum}`)
    return res.data
}
/* 영구삭제 : asset license(with file list) */
export const removeAccount = async (siNum) => {
    const res = await axios.delete(`${prefixAccount}/${siNum}`)
    return res.data
}
/* 조회 all : asset license(with paging+file count) */
export const getListAsset_list = async () => {
    const res = await axios.get(`${prefix}/asset_list`)
    return res.data
}