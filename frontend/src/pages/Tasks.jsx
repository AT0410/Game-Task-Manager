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
  Modal,
  Collapse,
} from "react-bootstrap";
import NavbarComp from "../components/Navbar";
import {
  FaTrash,
  FaPlus,
  FaCheck,
  FaUndo,
  FaChevronUp,
  FaEdit,
  FaChevronDown,
} from "react-icons/fa";
import Auth from "../components/Auth";
import { useAuth } from "../contexts/AuthContext";
import { getTasks, addTask, deleteTask, updateTask } from "../api";
import {
  NiceDate,
  getIsoString,
  getLocalDate,
  getLocalTime,
} from "../components/Date";

function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks(token);
        setTasks(data);
        console.log(data);
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

  const handleUpdate = async (id, updates) => {
    try {
      await updateTask(token, { id, ...updates });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    } catch (err) {
      console.log("Failed to update tasks:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(token, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.log("Fail to delete task:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Edit modal
  const openEdit = (task) => {
    const date = getLocalDate(task.due_date);
    const time = getLocalTime(task.due_date);
    setEditTask({
      ...task,
      date: date,
      time: time,
    });
    setShowEdit(true);
  };

  const saveEdit = async () => {
    const { id, date, time, ...task } = editTask;
    const due_date = getIsoString(date, time);
    handleUpdate(id, { ...task, due_date });
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...task, id, due_date } : t))
    );
    setShowEdit(false);
  };

  const ongoingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const renderTaskItem = (task) => (
    <React.Fragment key={task.id}>
      <ListGroup.Item
        key={task.id}
        className="d-flex justify-content-between align-items-center"
      >
        <div
          style={{ flex: 1, cursor: "pointer" }}
          onClick={() => toggleExpand(task.id)}
        >
          <strong>{task.title}</strong>
          <small className="text-muted ms-2">
            Due: {NiceDate(task.due_date)}
          </small>
        </div>
        <div>
          <Button
            variant="link"
            size="sm"
            onClick={() => toggleExpand(task.id)}
          >
            {expandedId === task.id ? <FaChevronUp /> : <FaChevronDown />}
          </Button>
          <Button
            size="sm"
            variant={task.completed ? "secondary" : "success"}
            className="me-2"
            onClick={() =>
              handleUpdate(task.id, { completed: !task.completed })
            }
          >
            {task.completed ? <FaUndo /> : <FaCheck />}
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleDelete(task.id)}
          >
            <FaTrash />
          </Button>
        </div>
      </ListGroup.Item>
      <Collapse in={expandedId === task.id}>
        <div className="bg-light p-3">
          <p>
            <strong>Description:</strong> {task.description || "No description"}
          </p>
          <Button size="sm" onClick={() => openEdit(task)}>
            Edit Details
          </Button>
        </div>
      </Collapse>
    </React.Fragment>
  );

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
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                Ongoing Tasks{" "}
                <Badge bg="secondary">{ongoingTasks.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {ongoingTasks.map(renderTaskItem)}
              </ListGroup>
            </Card>
          </Col>

          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                Completed Tasks{" "}
                <Badge bg="success">{completedTasks.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {completedTasks.map(renderTaskItem)}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        {/* Edit Modal */}
        <Modal show={showEdit} onHide={() => setShowEdit(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {" "}
            {editTask && (
              <Form>
                <Row className="g-2">
                  <Col>
                    <Form.Group>
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        value={editTask.title}
                        onChange={(e) =>
                          setEditTask((et) => ({
                            ...et,
                            title: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Due Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={editTask.date}
                        onChange={(e) =>
                          setEditTask((et) => ({
                            ...et,
                            date: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Due Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={editTask.time}
                        onChange={(e) =>
                          setEditTask((et) => ({
                            ...et,
                            time: e.target.value,
                          }))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editTask.description || ""}
                    onChange={(e) =>
                      setEditTask((et) => ({
                        ...et,
                        description: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveEdit}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Auth>
  );
}

export default Tasks;
