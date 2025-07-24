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
  Dropdown,
} from "react-bootstrap";
import NavbarComp from "../components/Navbar";
import {
  FaTrash,
  FaPlus,
  FaCheck,
  FaUndo,
  FaEdit,
  FaChevronDown,
  FaSort,
  FaChevronUp,
  FaCaretUp,
  FaCaretDown,
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
  const [sortConfig, setSortConfig] = useState({
    Due: { field: "due_date", direction: "asc" },
    Overdue: { field: "due_date", direction: "asc" },
    Completed: { field: "due_date", direction: "asc" },
  });

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

  // Sorting
  const handleSortChange = (column, field) => {
    setSortConfig((prev) => {
      const currentConfig = prev[column];
      // Toggle direction if same field is clicked again
      if (currentConfig.field === field) {
        return {
          ...prev,
          [column]: {
            field,
            direction: currentConfig.direction === "asc" ? "desc" : "asc",
          },
        };
      }
      return {
        ...prev,
        [column]: { field, direction: "asc" },
      };
    });
  };
  const sortTasks = (tasks, column) => {
    const { field, direction } = sortConfig[column];
    return [...tasks].sort((a, b) => {
      let valueA, valueB;

      if (field === "due_date") {
        valueA = new Date(a.due_date).getTime();
        valueB = new Date(b.due_date).getTime();
      } else if (field === "title") {
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
      } else {
        return 0;
      }

      if (valueA < valueB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const dueTasks = tasks.filter((t) => {
    const d = new Date(t.due_date);
    const now = new Date();
    return d >= now && !t.completed;
  });
  const completedTasks = tasks.filter((t) => t.completed);
  const overdueTasks = tasks.filter((t) => {
    const d = new Date(t.due_date);
    const now = new Date();
    return d < now && !t.completed;
  });

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
        <Card className="border-top-0 rounded-0 rounded-bottom">
          <Card.Body className="p-3">
            <Card.Subtitle className="mb-2 text-muted">
              Description
            </Card.Subtitle>
            <Card.Text className="mb-3">
              {task.description || "No description"}
            </Card.Text>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => openEdit(task)}
            >
              <FaEdit className="me-1" /> Edit Details
            </Button>
          </Card.Body>
        </Card>
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
          {" "}
          {[
            { label: "Due", value: dueTasks, colour: "secondary" },
            { label: "Overdue", value: overdueTasks, colour: "danger" },
            { label: "Completed", value: completedTasks, colour: "success" },
          ].map(({ label, value, colour }) => {
            const sortedTasks = sortTasks(value, label);
            const currentSort = sortConfig[label];

            return (
              <Col md={4} className="mb-4" key={label}>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>
                      {label + " "}
                      <Badge bg={colour}>{value.length}</Badge>
                    </span>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id={`sort-dropdown-${label}`}
                      >
                        <FaSort className="me-1" />
                        Sort
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleSortChange(label, "due_date")}
                          active={currentSort.field === "due_date"}
                        >
                          <div className="d-flex align-items-center">
                            <span class="align-middle">
                              {currentSort.field === "due_date" ? (
                                currentSort.direction === "asc" ? (
                                  <FaCaretUp className="me-1" />
                                ) : (
                                  <FaCaretDown className="me-1" />
                                )
                              ) : (
                                <span
                                  style={{
                                    width: "16px",
                                    display: "inline-block",
                                  }}
                                ></span>
                              )}
                              <span>Due Date</span>
                            </span>
                          </div>
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => handleSortChange(label, "title")}
                          active={currentSort.field === "title"}
                        >
                          <div className="d-flex align-items-center">
                            {currentSort.field === "title" ? (
                              currentSort.direction === "asc" ? (
                                <FaChevronUp className="me-1" />
                              ) : (
                                <FaCaretDown className="me-1" />
                              )
                            ) : (
                              <span
                                style={{
                                  width: "16px",
                                  display: "inline-block",
                                }}
                              ></span>
                            )}
                            <span>Alphabetical</span>
                          </div>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {sortedTasks.map(renderTaskItem)}
                  </ListGroup>
                </Card>
              </Col>
            );
          })}
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
