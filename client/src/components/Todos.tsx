import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getHeaders } from "../utils/platform";
import { Todo } from "../typings";
import SingleTodo from "./SingleTodo";
import CreateTodo from "./CreateTodo";
const Todos = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Pagination and Sorting
  const [page, setPage] = useState("1");
  const [pageSize, setPageSize] = useState("5");
  const [sortBy, setSortBy] = useState("createdAt"); // Default sorting by createdAt
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order
  // Filtering
  const [completedFilter, setCompletedFilter] = useState("all");

  const [isInFlight, setIsInFlight] = useState(false);

  useEffect(() => {
    const getUserTodos = async () => {
      if (isInFlight) {
        console.info("Open api is going on...");
        return;
      }

      const id = toast.loading("Please wait while fetching your todos...");
      try {
        setIsLoading(true);
        setIsInFlight(true);
        const queryParams = new URLSearchParams({
          page,
          pageSize,
          sortBy,
          sortOrder,
          completed: completedFilter,
        }).toString();
        const headers = getHeaders();
        const response = await axios.get(`/todos?${queryParams}`, {
          headers,
        });
        const data = response.data;
        if (data?.success) {
          let { data: info } = data;
          toast.update(id, {
            render: data?.message || "Todos fetched successfully",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
          if (info && info.length) {
            info = info.map((todo: any) => ({
              title: todo.title,
              description: todo.description,
              isCompleted: todo.isCompleted,
              dueDate: todo.dueDate,
              id: todo._id,
            }));
            setTodos(info);
          }
        } else {
          toast.update(id, {
            render: data?.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
          console.error("Error fetching user todos", data?.message);
        }
      } catch (error: any) {
        toast.update(id, {
          render: error?.response?.data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.error("Todos failed:", error);
      } finally {
        setIsLoading(false);
        setIsInFlight(false);
      }
    };
    getUserTodos();
  }, [page, pageSize, sortBy, sortOrder, completedFilter]);

  if (isLoading || isInFlight) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <CreateTodo />
      {todos?.length ? (
        <>
            <div>
                <h1>Filtering options :- </h1>
                <button onClick={() => setPage(prevPage => (parseInt(prevPage) - 1).toString()) } disabled={parseInt(page) === 1}>
                Previous Page
                </button>
                <button onClick={() => setPage(prevPage => (parseInt(prevPage) + 1).toString())} disabled={!todos || todos?.length === 0}>Next Page</button>

                <div>
                    <label>
                    Sort By:
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="createdAt">Created At</option>
                        <option value="dueDate">Due Date</option>
                    </select>
                    </label>
                </div>

                <div>
                    <label>
                    Sort Order:
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    </label>
                </div>

                <div>
                    <label>
                    Completed Filter:
                    <select
                        value={completedFilter}
                        onChange={(e) => setCompletedFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="true">Completed</option>
                        <option value="false">Not Completed</option>
                    </select>
                    </label>
                </div>
            </div>
            <div>
            <h1>Your Todos</h1>
            {todos?.map((todo: Todo) => (
                <SingleTodo key={todo.id} todo={todo} />
                ))}
            </div>
        </>
      ) : (
        <h4>You have not created any todo</h4>
      )}
    </div>
  );
};

export default Todos;
