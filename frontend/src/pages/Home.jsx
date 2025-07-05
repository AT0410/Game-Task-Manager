import React, { useState } from "react";
import NavbarComp from "../components/Navbar";
import { Navbar, Nav, Container, Button, Row, Col, Card, Carousel } from 'react-bootstrap';

function Home({ items, heading, onSelectItem }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#home">MyApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Carousel */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/1200x400"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Welcome to MyApp</h3>
            <p>Building awesome experiences with React Bootstrap.</p>
            <Button variant="primary" href="#features">
              Learn More
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/1200x400"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Seamless Integration</h3>
            <p>Combine React with Bootstrap components effortlessly.</p>
            <Button variant="light" href="#about">
              Get Started
            </Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* Features Section */}
      <Container id="features" className="my-5">
        <h2 className="text-center mb-4">Features</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Responsive Design</Card.Title>
                <Card.Text>
                  Create layouts that adapt to any screen size using Bootstrap's
                  grid system.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Pre-built Components</Card.Title>
                <Card.Text>
                  Use buttons, forms, modals, and more out of the box with React
                  Bootstrap.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Customizable Themes</Card.Title>
                <Card.Text>
                  Easily override Bootstrap variables to match your brand's
                  style.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer Section */}
      <footer className="bg-dark text-light py-4">
        <Container className="text-center">
          <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
          <Nav className="justify-content-center">
            <Nav.Link href="#privacy" className="text-light">
              Privacy Policy
            </Nav.Link>
            <Nav.Link href="#terms" className="text-light">
              Terms of Service
            </Nav.Link>
          </Nav>
        </Container>
      </footer>
    </>
  );
}

export default Home;
