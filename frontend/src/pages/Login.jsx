import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Login() {
  // const [loginData, setLoginData] = useState({
  //   username: "",
  //   password: "",
  // });

  // const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);

  // const { login } = useContext(AuthContext);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setLoginData({
  //     ...loginData,
  //     [name]: value,
  //   });
  // };

  // const navigate = useNavigate();

  // const validateForm = () => {
  //   if (!loginData.username || !loginData.password) {
  //     setError("Fill in all required fields");
  //     return false;
  //   }
  //   setError("");
  //   return true;
  // };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!validateForm()) return;
  //   setLoading(true);

  //   const formData = new URLSearchParams();
  //   formData.append("username", loginData.username);
  //   formData.append("password", loginData.password);

  //   try {
  //     const response = await api.post("/token", formDetails, {
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     });

  //     localStorage.setItem("access_token", response.data.access_token);
  //     navigate("/home");
  //   } catch (error) {
  //     if (error.response) {
  //       const detail = error.response.data.detail || "Authentication failed!";
  //       setError(detail);
  //     } else {
  //       setError(error.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <h1>Login</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default Login;
