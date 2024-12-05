import axios from "axios";

const API_CHATROOM_HOST = `http://ysy.tplinkdns.com:8003/api/chatroom`
const API_CHATMESSAGE_HOST = `http://ysy.tplinkdns.com:8003/api/chat`

// 채팅방 가져오기
export const getChatRoom = async (pno) => {
    const res = await axios.get(`${API_CHATROOM_HOST}/${pno}`);
    return res.data
}


export const sendMessage = async (chatMessageDTO) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    console.log(chatMessageDTO);
    const res = await axios.post(`${API_CHATMESSAGE_HOST}/send`, chatMessageDTO, header)
    return res.data
}

export const getMessage = async (crno) => {
    const res = await axios.get(`${API_CHATMESSAGE_HOST}/${crno}`);
    return res.data
}
