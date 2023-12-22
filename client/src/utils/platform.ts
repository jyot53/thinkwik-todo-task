import { TOKEN_NAME } from "./constants";

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

export const getClientCookie = (cname:string) => {
    try {
        let ca = document.cookie.split(';');
        let c, x;
        for (let i = 0; i < ca.length; i++) {
            c = ca[i];
            x = c.split('=');
            if (x[0].trim() === cname) {
            return x.slice(1).join('') || '';
            }
        }
    return '';
    } catch (error) {
        console.error("Error getting client cookies ",error);
        return '';
    }
}