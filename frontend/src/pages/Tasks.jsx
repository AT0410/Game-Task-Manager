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
import { getTasks, addTask, deleteTaskAPI } from "../api";
import { NiceDate, getIsoString } from "../components/Date";

function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

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

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newTime) return;
    const newTask = {
      title: newTitle.trim(),
      due_date: getIsoString(newDate, newTime),
      completed: false,
    };
    try {
      const task_id = await addTask(token, newTask);
      newTask.id = task_id;

      setTasks([...tasks, newTask]);
      setNewTitle("");
      setNewDate("");
      setNewTime("");
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const markCompleted = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const markOngoing = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: false } : t)));
  };

  const  deleteTask = async (id) => {
    try {
      await deleteTaskAPI(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.log("Fail to delete task:", err);
    }
  };

  const ongoingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

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
                  placeholder="New title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Form.Control
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <Form.Control
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
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
                Ongoing Tasks{" "}
                <Badge bg="secondary">{ongoingTasks.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {ongoingTasks.map((task) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{task.title}</strong>
                      <small className="text-muted ms-2">
                        Due: {NiceDate(task.due_date)}
                      </small>
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => markCompleted(task.id)}
                    >
                      <FaCheck />
                    </Button>
                  </ListGroup.Item>
                ))}
                {ongoingTasks.length === 0 && (
                  <ListGroup.Item>No ongoing tasks</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>

          {/* Completed Tasks */}
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                Completed Tasks{" "}
                <Badge bg="success">{completedTasks.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {completedTasks.map((task) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <span style={{ textDecoration: "line-through" }}>
                        {task.title}
                      </span>
                      <small className="text-muted ms-2">
                        Due: {NiceDate(task.due_date)}
                      </small>
                    </div>
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
                {completedTasks.length === 0 && (
                  <ListGroup.Item>No completed tasks</ListGroup.Item>
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
