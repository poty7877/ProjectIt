import axios from "axios";

const API_PRODUCT_ALARM_HOST = `http:/ysy.tplinkdns.com:8003/api/project/alarm`
const API_MEMBER_ALARM_HOST = `http://ysy.tplinkdns.com:8003/api/member/alarm`
// 프로젝트 이슈 개수 불러오기
export const getProjectAlarmCount = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_ALARM_HOST}/count/${pno}`)
    return res.data
}

// 프로젝트 이슈 new 삭제하기
export const deleteProjectAlarm = async (ino) => {
    try {
        const res = await axios.delete(`${API_PRODUCT_ALARM_HOST}/${ino}`)
        return res.data
    } catch (error) {
        console.log(error)
        return 0;
    }
}

// 멤버 이슈 개수 불러오기
export const getMemberAlarmCount = async (mno) => {
    const res = await axios.get(`${API_MEMBER_ALARM_HOST}/count/${mno}`)
    return res.data
}

// 멤버 이슈 삭제하기
export const deleteMemberAlarm = async (ino) => {
    try {
        const res = await axios.delete(`${API_MEMBER_ALARM_HOST}/${ino}`)
        return res.data
    } catch (error) {
        console.error(error)
        return 0;
    }
}

// 전체 개수
export const getAllCount = async () => {
    try {
        const res = await axios.get(`${API_MEMBER_ALARM_HOST}/all`)
        return res.data
    } catch (error) {
        console.error(error)
        return 0;
    }
}

// 전체 개수
export const getAllProjectCount = async () => {
    try {
        const res = await axios.get(`${API_PRODUCT_ALARM_HOST}/all`)
        return res.data
    } catch (error) {
        console.log(error)
        return 0;
    }

}

