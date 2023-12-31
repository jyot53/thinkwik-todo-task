import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getHeaders } from "../utils/platform";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Define validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    username: "",
    email: "",
    password: "",
  };

  const handleRegister = async (formData: any) => {
    const id = toast.loading("Please wait while we registering you...");
    try {
      const headers = getHeaders();  
      const response = await axios.post("/users/register", formData,{
        headers
      });
      const data = response.data;
      if (data?.success) {
        toast.update(id, {
          render: data?.message || "User registered successfully, kindly login",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        navigate("/login");
      } else {
        toast.update(id, {
          render: data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
        console.error("Error registering user", data?.message);
      }
    } catch (error: any) {
      toast.update(id, {
        render: error?.response?.data?.message || "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      console.error("Registration failed:", error);
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
      <h2>Register Here!!!</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        <Form>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" className="error-message"  />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error-message"  />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="error-message"  />
          </div>

          <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} type="submit">Register</button>
        </Form>
      </Formik>
      <button style={{
            margin:'1rem',
            padding:'0.5rem'
          }} onClick={() => navigate('/login')}>Already have an account?</button>
    </div>
  );
};

export default Register;
