import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getHeaders } from "../utils/platform";
import axios from "axios";
import { Todo } from "../typings";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  isCompleted: Yup.boolean().required("Please select completion status"),
});

const Edit = () => {
  const navigate = useNavigate();
  const { todoId } = useParams();
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    const getSingleTodo = async () => {
      const id = toast.loading(
        "Please wait while fetching this todo information..."
      );
      try {
        const headers = getHeaders();
        const response = await axios.get(`/todos/${todoId}`, {
          headers,
        });
        const data = response.data;
        if (data?.success) {
          let { data: info } = data;
          toast.update(id, {
            render: data?.message || "Todo fetched successfully",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
          setTodo({
            title: info.title,
            description: info.description,
            isCompleted: info.isCompleted,
            id: info._id,
            dueDate: info.dueDate,
          });
        } else {
          toast.update(id, {
            render: data?.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          console.error("Error fetching user todos", data?.message);
        }
      } catch (error: any) {
        toast.update(id, {
          render: error?.response?.data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("Todos failed:", error);
      }
    };

    getSingleTodo();
  }, [todoId]);

  const onTodoSave = async (formData: any) => {
    const id = toast.loading("Please wait while updating the todo...");
    try {
      const headers = getHeaders();
      const response = await axios.put(`/todos/${todoId}`, formData,{
        headers,
      });
      const data = response.data;
      if (data?.success) {
        toast.update(id, {
          render: data?.message || "Todo updated successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        // navigating after 2sec to home page
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.update(id, {
          render: data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("Error updating todo", data?.message);
      }
    } catch (error: any) {
      toast.update(id, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error("Todos Save failed:", error);
    }
  };

  return (
    todo && (
      <Formik
        initialValues={todo}
        validationSchema={validationSchema}
        onSubmit={onTodoSave}
      >
        <Form>
          <div>
            <label htmlFor="title">Title:</label>
            <Field type="text" id="title" name="title" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label htmlFor="description">Description:</label>
            <Field as="textarea" id="description" name="description" />
            <ErrorMessage name="description" component="div" />
          </div>

          <div>
            <label>
              Completed:
              <Field type="radio" name="isCompleted" value={true} /> Yes
              <Field type="radio" name="isCompleted" value={false} /> No
            </label>
            <ErrorMessage name="isCompleted" component="div" />
          </div>

          <button type="submit">Save Changes</button>
        </Form>
      </Formik>
    )
  );
};

export default Edit;
