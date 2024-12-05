import axios from "axios";

const API_PRODUCT_HOST = `http://ysy.tplinkdns.com:8003/api/pmember`

// ProjectMember List
export const getList = async (pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${pno}`);
    return res.data
}

// ProjectMember Register
export const postAdd = async (projectMember, pno) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.post(`${API_PRODUCT_HOST}/${pno}`, projectMember, header)
    return res.data;
}

// ProjectMember Read
export const getOneMember = async (mno,pno) => {
    const res = await axios.get(`${API_PRODUCT_HOST}/${pno}/${mno}`);
    return res.data
}

// ProjectMember Delete
export const deleteOne = async (pno, mno) => {
    const res = await axios.delete(`${API_PRODUCT_HOST}/${pno}/${mno}`);
    return res.data
}


// ProjectMember Register
export const postAddPm = async (projectMember, pno) => {
    const header = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.post(`${API_PRODUCT_HOST}/${pno}`, projectMember, header)
    return res.data;
}



