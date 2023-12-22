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
    const id = toast.loading("Please wait while logging you in...");
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
          autoClose: 2000,
        });
        login({ username: info.username, email: info.email });
        navigate("/");
      } else {
        toast.update(id, {
          render: data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.error("Error login user", data?.message);
      }
    } catch (error: any) {
      toast.update(id, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
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
    <div style={{
        padding:'2rem',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        gap:'2rem'
    }}>
      <h2>Login Here!!!</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form>
          <div style={{
            margin:'1rem',
            padding:'0.5rem'
          }}>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error-message"  />
          </div>

          <div style={{
            margin:'1rem',
            padding:'0.5rem'
          }}>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="error-message"  />
          </div>
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            gap:"2rem"
          }}>
            <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} type="submit">Login</button>
            <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} onClick={() => navigate('/register')}>Don't have an account?</button>
          </div>

        </Form>
      </Formik>
    </div>
  );
};

export default Login;
