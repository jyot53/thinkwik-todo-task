import React from 'react';
import { Todo } from '../typings';
import { getTodoDateFormatted } from '../utils/functions';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import { getHeaders } from "../utils/platform";
import axios from 'axios';

const SingleTodo = ({todo}:{todo:Todo}) => {
    const navigate = useNavigate();

    const onTodoEdit = () => {
        navigate(`/edit/${todo.id}`);
    }

    const onTodoDelete = async () => {
        const todoId = todo.id;
        if(!todoId){
            toast.error('Cannot delete todo - id is not present', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "light",
                isLoading:false
            });
            return;
        }
        const id = toast.loading("Please wait while deleting your todo...");
        try {
            const headers = getHeaders();
            const response = await axios.delete(`/todos/${todoId}`,{
                headers
            });
            const data = response.data;
            if(data?.success){
                toast.update(id, {
                    render: data?.message || "Todo deleted successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 5000,
                });
                window.location.reload();
            }else{
                toast.update(id, {
                    render: data?.message || "Something went wrong",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
                console.error("Error deleting user todo", data?.message);
            }
        } catch (error:any) {
            toast.update(id, {
                render: error?.response?.data?.message || "Something went wrong",
                type: "error",
                isLoading: false,
                autoClose: 5000,
            });
            console.error("Todo deletion failed:", error);
        }
    }

  return (
    <div>
        <h1>{todo.title}</h1>
        <p>{todo.description}</p>
        <p>{todo.isCompleted ? "Completed" : "Pending"}</p>
        <p>Due Date - {getTodoDateFormatted(todo.dueDate)}</p>
        <button onClick={onTodoDelete}>Delete</button>
        <button onClick={onTodoEdit}>Edit</button>
    </div>
  )
}

export default SingleTodo;