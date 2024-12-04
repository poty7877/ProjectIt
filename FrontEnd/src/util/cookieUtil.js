import { Cookies } from "react-cookie";

const cookies = new Cookies()

export const setCookie = (name, value, days) => {

    const expires = new Date()
    expires.setUTCDate(expires.getUTCDate() + days ) //보관기한

    return cookies.set(name, value, {path:'/', expires:expires})
}

export const getCookie = (name)=>{
    const value = `; ${document.cookie}`;
    const parts = value.split(`;${name}=`);
    if(parts.length === 2) return parts.pop().split(';').shift();        
    return cookies.get(name);
}

export const removeCookie = (name, path="/") => {
    cookies.remove(name, {path})
}