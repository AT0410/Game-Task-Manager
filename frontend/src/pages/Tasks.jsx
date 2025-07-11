import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import NavbarComp from "../components/Navbar";
import { FaTrash, FaPlus, FaCheck, FaUndo } from "react-icons/fa";
import Auth from "../components/Auth";
import { useAuth } from "../contexts/AuthContext";
import { getTasks } from "../api";

function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    }
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    setTasks([...tasks, { id: nextId, text: newTask.trim(), finished: false }]);
    setNewTask("");
  };

  const markFinished = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const markOngoing = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: false } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const ongoing = tasks.filter((t) => !t.completed);
  const finished = tasks.filter((t) => t.completed);

  return (
    <Auth>
      <NavbarComp />
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h2>My Tasks</h2>
          </Col>
        </Row>

        {/* Add Task Form */}
        <Row className="mb-4">
          <Col md={8} lg={6}>
            <Form onSubmit={handleAdd}>
              <InputGroup>
                <Form.Control
                  placeholder="New task..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <Button variant="primary" type="submit">
                  <FaPlus /> Add
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>

        <Row>
          {/* Ongoing Tasks */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                Ongoing Tasks <Badge bg="secondary">{ongoing.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {ongoing.map((task) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {task.title}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => markFinished(task.id)}
                    >
                      <FaCheck />
                    </Button>
                  </ListGroup.Item>
                ))}
                {ongoing.length === 0 && (
                  <ListGroup.Item>No ongoing tasks</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>

          {/* Finished Tasks */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                Finished Tasks <Badge bg="success">{finished.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {finished.map((task) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span style={{ textDecoration: "line-through" }}>
                      {task.title}
                    </span>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => markOngoing(task.id)}
                      >
                        <FaUndo />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
                {finished.length === 0 && (
                  <ListGroup.Item>No finished tasks</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
    </Auth>
  );
}

export default Tasks;
