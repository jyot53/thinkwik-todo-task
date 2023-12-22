import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextProps, AuthProviderProps, User } from '../typings';
import axios from 'axios';
// import {toast} from 'react-toastify';
import { getHeaders } from '../utils/platform';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(()=> {
    const checkAuthentication = async () => {
    // const id = toast.loading("Getting user information...",{autoClose:2000});
      try {
        const headers = getHeaders();
        const response = await axios.get('/users/get-user',{
          headers
        });
        const data = response.data;
        if(data?.success){
          const {data : info} = data;
          // toast.update(id, { render: data?.message || "User information fetched successfully", type: "success", isLoading: false,autoClose: 2000 });
          setUser({username: info.username, email: info.email});
        }else{
          // toast.update(id, { render: data?.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000});
          console.error("Error authenticating user information", data?.message);
        }
      } catch (error:any) {
        // toast.update(id, { render: error?.response?.data?.message || "Something went wrong", type: "error", isLoading: false, autoClose: 2000});
        console.error('Error authenticating user information:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  },[]);

  const login = (userData: User) => {
    //implement login logic here
    setUser({ username: userData.username, email: userData.email });
  };

  const logout = () => {
    // Implement logout logic here
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; //show a loading indicator
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
