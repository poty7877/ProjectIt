import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi";
import { getCookie, setCookie, removeCookie } from "../util/cookieUtil.js";




const initState = {
    email : ''
}

const loadMemberCookie = () => {
    //쿠키에서 로그인 정보 로딩
    const memberInfo = getCookie("member")

    //닉네임 처리
    if(memberInfo && memberInfo.nickname){
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
    }
    return memberInfo
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    return loginPost(param)
})

// 컴포넌트는 액션을 통하여 리듀서를 호출
// 리듀서는 액션의 페이로드 값을 처리해서 애플리케이션 상태 데이터 반환 : 슬라이스
const loginSlice = createSlice({
    name: 'LoginSlice',
    initialState: loadMemberCookie() || initState, // 쿠키가 없다면 초기값 사용
    reducers: {
        login: (state, action) => {
            console.log("login.....")
            //{email, pw로 구성}
            const payload = action.payload

            setCookie("member", JSON.stringify(payload), 1) //1일
            console.log(payload.mno)
            return {mno: payload.mno}
        },
         logout: (state, action) => {
            console.log("logout....")
            removeCookie("member")
            return{...initState}
        }                
    },
    extraReducers: (builder) => {
        builder.addCase(loginPostAsync.fulfilled, (state, action) => {
            console.log("fulfilled")

            const payload = action.payload

            //정상적인 로그인일때만 저장
            if(!payload.error){
                setCookie("member", JSON.stringify(payload), 1) // 1일
            }
            console.log(payload.mno);
            return payload
        })
        .addCase(loginPostAsync.pending, (state, action) => {
            console.log("pending")
        })
        .addCase(loginPostAsync.rejected, (state, action) => {
            console.log("rejected")
        })
    }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer