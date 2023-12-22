import React, {useState,useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import { getHeaders } from "../utils/platform";
import { Todo } from '../typings';
import SingleTodo from './SingleTodo';
import CreateTodo from './CreateTodo';

const Todos = () => {

    const [todos, setTodos] = useState<Todo[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=>{
        const getUserTodos = async () => {
            const id = toast.loading("Please wait while fetching your todos...");
            try {
                setIsLoading(true);
                const headers = getHeaders();
                const response = await axios.get('/todos/',{
                    headers
                });
                const data = response.data;
                if(data?.success){
                    let {data : info} = data;
                    toast.update(id, {
                        render: data?.message || "Todos fetched successfully",
                        type: "success",
                        isLoading: false,
                        autoClose: 5000,
                    });
                    if(info && info.length){
                        info = info.map((todo:any) => (
                            {
                                title: todo.title,
                                description: todo.description,
                                isCompleted: todo.isCompleted,
                                dueDate: todo.dueDate,
                                id: todo._id
                            }
                        ))
                        setTodos(info);
                    }
                }else{
                    toast.update(id, {
                        render: data?.message || "Something went wrong",
                        type: "error",
                        isLoading: false,
                        autoClose: 5000,
                    });
                    console.error("Error fetching user todos", data?.message);
                }
            } catch (error:any) {
                toast.update(id, {
                    render: error?.response?.data?.message || "Something went wrong",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
                console.error("Todos failed:", error);
            } finally{
                setIsLoading(false);
            }
        };

        getUserTodos();

    },[]);

    if(isLoading){
        return (
            <h1>Loading...</h1>
        )
    }

  return (
    <div>
        <h1>Your Todos</h1>
        {
            todos?.length ? (
                <div>
                    {todos?.map((todo:Todo) => (
                         <SingleTodo todo={todo}/>
                    ))}
                </div>
            ) : <h4>You have not created any todo</h4>
        }
        <CreateTodo/>
    </div>
  )
}

export default Todos;