import { shortMonths } from "./constants";

export const getTodoDateFormatted = (date:Date) => {
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const formattedDate = `${day}-${shortMonths[month]}-${year}`;
    return formattedDate;
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