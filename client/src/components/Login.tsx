import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getHeaders } from "../utils/platform";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  const handleLogin = async (formData: any) => {
    console.log("Form submitted with formData:", formData);
    console.log(formData);
    const id = toast.loading("Please wait...");
    try {
      const headers = getHeaders();
      const response = await axios.post("/users/login", formData,{
        headers
      });
      const data = response.data;
      if (data?.success) {
        const { data: info } = data;
        toast.update(id, {
          render: data?.message || "User logged in successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
        login({ username: info.username, email: info.email });
        navigate("/");
      } else {
        toast.update(id, {
          render: data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error("Error login user", data?.message);
      }
    } catch (error: any) {
      toast.update(id, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    // Redirect to home page if the user is already logged in
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>

          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
