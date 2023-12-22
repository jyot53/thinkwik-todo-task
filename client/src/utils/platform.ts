import { TOKEN_NAME } from "./constants";
import { getClientCookie } from "./functions";

export const getToken = () => {
    return getClientCookie(TOKEN_NAME);
}

export const isLoggedIn = () => {
    return !!getClientCookie(TOKEN_NAME);
}

export const getHeaders = (forceAuth:boolean = false) => {
    const headers:any = {};
    if(forceAuth || isLoggedIn()) {
        headers['Authorization'] = 'Bearer ' + getToken();
    }
    headers['X-ThinkWik-Website'] = 'Thinkwik';
    return headers;
}