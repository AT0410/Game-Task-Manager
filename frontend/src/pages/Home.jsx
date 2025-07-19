import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Badge,
} from "react-bootstrap";
import NavbarComp from "../components/Navbar";
import Auth from "../components/Auth";
import { useAuth } from "../contexts/AuthContext";
import { getTasks } from "../api";
import { NiceDate } from "../components/Date";
import Loading from "../components/Loading";

function Home() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [dueThisWeek, setDueThisWeek] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await getTasks(token);
        setTasks(data);
        const now = new Date();
        const weekAhead = new Date(now);
        weekAhead.setDate(now.getDate() + 7);
        const upcoming = data.filter((t) => {
          const d = new Date(t.due_date);
          return d >= now && d <= weekAhead && !t.completed;
        });

        setDueThisWeek(upcoming);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    }
    if (token) {
      fetchTasks();
    }
  }, [token]);

  if (tasks === null || user === null) {
    return (
      <Auth>
        <NavbarComp />
        <Loading />
      </Auth>
    );
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const ongoing = total - completed;

  return (
    <Auth>
      <NavbarComp />
      <Container className="my-5">
        {/* Greeting */}
        <Row className="mb-4">
          <Col>
            <h2>Welcome back, {user.full_name || "there"}!</h2>
            <p className="text-muted">Here's a quick look at your tasks.</p>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="mb-4">
          {[
            { label: "Total Tasks", value: total, variant: "primary" },
            { label: "Ongoing", value: ongoing, variant: "warning" },
            { label: "Completed", value: completed, variant: "success" },
          ].map(({ label, value, variant }) => (
            <Col key={label} md={4} className="mb-3">
              <Card border={variant}>
                <Card.Body className="text-center">
                  <Card.Title>{label}</Card.Title>
                  <h3>
                    <span className={`text-${variant}`}>{value}</span>
                  </h3>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Tasks Due This Week */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                Tasks Due in the Next 7 Days{" "}
                <Badge bg="danger">{dueThisWeek.length}</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {dueThisWeek.length > 0 ? (
                  dueThisWeek.map((t) => (
                    <ListGroup.Item
                      key={t.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>{t.title}</span>
                      <small className="text-muted">
                        {NiceDate(t.due_date)}
                      </small>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No tasks due this week</ListGroup.Item>
                )}
              </ListGroup>
              <Card.Footer className="text-end">
                <Button variant="outline-primary" href="/tasks">
                  View All Tasks
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        {/* Placeholder for Other Home Page Sections */}
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>Quick Actions</Card.Header>
              <Card.Body>
                <Button variant="primary" href="/tasks/new">
                  + Add New Task
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>Recent Activity</Card.Header>
              <Card.Body>
                <p className="text-muted">No recent activity to show.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Auth>
  );
}

export default Home;
