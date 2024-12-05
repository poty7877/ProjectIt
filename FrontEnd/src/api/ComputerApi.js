import axios from "axios"

export const API_DISTRIBUSUION_HOST = "http://ysy.tplinkdns.com:8001"
const prefix = `${API_DISTRIBUSUION_HOST}/dist/computer`
const lno = 0
const ano = 0

/* 등록 : info computer */
export const registInfo = async (dto) => {
    const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    const res = await axios.post(`${prefix}/info`, dto)
    return res.data
}
/* 조회 one : info computer */
export const getOneInfo = async (cino) => {
    const res = await axios.get(`${prefix}/info/${cino}`)
    return res.data
}
/* 조회 all : info computer */
export const getListInfo = async (pageParam) => {
    const { page, size } = pageParam
    const res = await axios.get(`${prefix}/info`)
    return res.data
}


/* 영구삭제 : info computer */
export const delForeverInfo = async (cino) => {
    const res = await axios.delete(`${prefix}/info_del/${cino}`)
    return res.data
}


/* 등록 : asset computer */
export const registAsset = async (dto) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await axios.post(`${prefix}/asset`, dto, header)
    return res.data
}
/* 조회 one :asset computer(with file list) */
export const getOneAsset = async (cno) => {
    const res = await axios.get(`${prefix}/asset/${cno}`)
    return res.data
}
/* 조회 all : asset computer(with paging+file count) */
export const getListAsset = async (pageParam) => {
    const { page, size } = pageParam
    const res = await axios.get(`${prefix}/asset`)
    return res.data
}
/* 변경 :asset computer(with file list) */
export const modAsset = async (dto) => {
    const header = { headers: { "Content-Type": "multipart/form-data" } }
    const res = await axios.put(`${prefix}/asset/${ano}`, dto, header)
    return res.data
}
/* 삭제처리(상태변경) : asset computer(with file list) */
export const delAsset = async (cno) => {
    const res = await axios.delete(`${prefix}/asset/${cno}`)
    return res.data
}
/* 영구삭제 : asset computer(with file list) */
export const delForeverAsset = async (cno) => {
    const res = await axios.delete(`${prefix}/asset_del/${cno}`)
    return res.data
}


/* 조회 one :asset computer(with file list) */
// 같은 곳에서 두개를 동시에 써야하는데 겹쳐서 추가했어요 ㅠ
export const getOneAssetC = async (cno) => {
    const res = await axios.get(`${prefix}/asset/${cno}`)
    return res.data
}

/* 조회 all(list) : asset computer(with paging+file count) */
export const getListAsset_list = async () => {
    const res = await axios.get(`${prefix}/asset_list`)
    return res.data
}

