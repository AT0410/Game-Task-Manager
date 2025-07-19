import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa";

const NavbarComp = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const bgClass = theme === "light" ? "bg-light" : "bg-dark bg-opacity-25";
  const variant = theme === "light" ? "light" : "dark";

  return (
    <Navbar expand="lg" className={bgClass} variant={variant}>
      <Container>
        <Navbar.Brand href="/">Task Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/tasks">Tasks</Nav.Link>
          </Nav>

          <Nav className="ms-auto align-items-center">
            {/* Theme toggle outside of dropdown */}
            <Button
              variant="link"
              onClick={toggleTheme}
              className="me-3 p-0"
              title="Toggle light/dark"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </Button>

            {user ? (
              <NavDropdown
                title={user.full_name || user.email}
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item href="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;
