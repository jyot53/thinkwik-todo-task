import React from "react";
import { Todo } from "../typings";
import { getTodoDateFormatted } from "../utils/functions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHeaders } from "../utils/platform";
import axios from "axios";

const SingleTodo = ({ todo }: { todo: Todo }) => {
  const navigate = useNavigate();

  const onTodoEdit = () => {
    navigate(`/edit/${todo.id}`);
  };

  const onTodoDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const todoId = todo.id;
      if (!todoId) {
        toast.error("Cannot delete todo - id is not present", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          theme: "light",
          isLoading: false,
        });
        return;
      }
      const id = toast.loading("Please wait while deleting your todo...");
      try {
        const headers = getHeaders();
        const response = await axios.delete(`/todos/${todoId}`, {
          headers,
        });
        const data = response.data;
        if (data?.success) {
          toast.update(id, {
            render: data?.message || "Todo deleted successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          window.location.reload();
        } else {
          toast.update(id, {
            render: data?.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
          console.error("Error deleting user todo", data?.message);
        }
      } catch (error: any) {
        toast.update(id, {
          render: error?.response?.data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.error("Todo deletion failed:", error);
      }
    }
  };

  return (
    <div style={{
        border:"2px solid grey",
        width:"fit-content",
        borderRadius:"1rem",
        padding:"0.5rem",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#d3d3d3",
        flexDirection:"column",
        marginTop:"2rem",
        marginBottom:"2rem"
    }}>
      <h1>{todo.title}</h1>
      <p>{todo.description}</p>
      <p style={{
        color:`${todo.isCompleted ? 'green' : 'red'}`
        }}>{todo.isCompleted ? "Completed" : "Pending"}</p>
      <p>Due Date - {getTodoDateFormatted(todo.dueDate)}</p>
      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        gap:"2rem"
      }}>
        <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} onClick={onTodoDelete}>Delete</button>
        <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} onClick={onTodoEdit}>Edit</button>
      </div>
    </div>
  );
};

export default SingleTodo;
