import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  FloatingLabel,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const Register = () => {
  const { register } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    register(formData.fullname, formData.email, formData.password);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleSubmit(e);
    setLoading(false);
  };

  const bgClass =
    theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  const cardBg = theme === "dark" ? "bg-secondary text-light" : "bg-white";

  return (
    <>
      <Container
        fluid
        className={`${bgClass} vh-100 d-flex justify-content-center align-items-center`}
      >
        <Row className="w-100 justify-content-center">
          <Col xs={10} sm={8} md={6} lg={4}>
            <Card className={`shadow-lg border-0 ${cardBg}`}>
              <Card.Body className="p-4">
                <h3 className="text-center mb-4">Create an Account</h3>

                <Form onSubmit={onSubmit}>
                  <FloatingLabel
                    controlId="floatingFullName"
                    label="Full Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="fullname"
                      placeholder="Full Name"
                      onChange={handleChange}
                      required
                      className={
                        theme === "dark"
                          ? "bg-dark text-light border-secondary"
                          : ""
                      }
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email address"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      onChange={handleChange}
                      required
                      className={
                        theme === "dark"
                          ? "bg-dark text-light border-secondary"
                          : ""
                      }
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-4"
                  >
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
                  </FloatingLabel>

                  <Button
                    variant={theme === "dark" ? "light" : "primary"}
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? "Registering…" : "Register"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <span>Already have an account? </span>
                  <a
                    href="/login"
                    className={theme === "dark" ? "text-light" : ""}
                  >
                    Sign in
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Register;
