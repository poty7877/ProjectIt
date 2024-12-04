import {useRecoilState} from "recoil";
import base64 from "base-64";
import { getCookie } from "./cookieUtil";

export function useDecodeInfo(){
    const [Tokens, setTokens] = useRecoilState(getCookie());
    const accessToken = Tokens.accessToken;
    console.log(accessToken);
    let payload = accessToken.substring(accessToken.indexOf(".") + 1, accessToken.lastIndexOf("."));
    let decodingInfo = base64.decode(payload);
    console.log(decodingInfo);
    return decodingInfo;

}