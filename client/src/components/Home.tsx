import React from 'react'
import { useAuth } from '../context/AuthContext';
import { getHeaders } from '../utils/platform';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Todos from './Todos';

export const Home = () => {
  const navigate = useNavigate();
  const { user,logout } = useAuth();

  const onLogout = async () => {
    const id = toast.loading("Please wait while logging you out...");
    try {
        const headers = getHeaders();
        const response = await axios.post("/users/logout",{
          headers
        });
        const data = response.data;
        if (data?.success) {
          toast.update(id, {
            render: data?.message || "User logged out successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          logout();
          navigate("/login");
        } else {
          toast.update(id, {
            render: data?.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
          console.error("Error login user out", data?.message);
        }
      } catch (error: any) {
        toast.update(id, {
          render: error?.response?.data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.error("Logout failed:", error);
      }
  }

  return (
    <div style={{
        padding: "3rem"
    }}>
        <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"space-around",
        }}>
            <h1>Welcome {user?.username} to the todos app!!!</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
        <Todos/>
    </div>
  )
}
