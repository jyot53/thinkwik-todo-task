import {ReactNode} from 'react';

type User = {
    username: string;
    email: string;
}
  
type AuthContextProps = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

type AuthProviderProps = {
    children: ReactNode;
}

type Todo = {
    title:string,
    description:string,
    isCompleted:boolean,
    dueDate:Date,
    id:string
}
