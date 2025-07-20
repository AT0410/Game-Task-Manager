import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import NavbarComp from "../components/Navbar";

function Login() {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(loginData.email, loginData.password);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleSubmit(e);
    setLoading(false);
  };

  const bgClass = theme === "dark" ? "bg-dark" : "bg-light";
  const textClass = theme === "dark" ? "text-light" : "text-dark";

  return (
    <>
      <Container
        fluid
        className={`${bgClass} ${textClass} vh-100 d-flex justify-content-center align-items-center`}
      >
        <Row className="w-100 justify-content-center">
          <Col xs={10} sm={8} md={6} lg={4}>
            <Card
              className={`shadow-lg border-0 ${
                theme === "dark" ? "bg-secondary text-light" : "bg-white"
              }`}
            >
              <Card.Body className="p-4">
                <h3 className="text-center mb-4">Welcome Back</h3>

                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      onChange={handleChange}
                      required
                      className={
                        theme === "dark"
                          ? "bg-dark text-light border-secondary"
                          : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      required
                      className={
                        theme === "dark"
                          ? "bg-dark text-light border-secondary"
                          : ""
                      }
                    />
                  </Form.Group>

                  <Button
                    variant={theme === "dark" ? "light" : "primary"}
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <a className={textClass} href="/forgot-password">
                    Forgot password?
                  </a>
                </div>
                <div className="text-center mt-2">
                  <span>Don't have an account? </span>
                  <a className={textClass} href="/register">
                    Register now
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
