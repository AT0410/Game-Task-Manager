import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  FloatingLabel,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Auth from "../components/Auth";
import { useTheme } from "../contexts/ThemeContext";
import Loading from "../components/Loading";
import NavbarComp from "../components/Navbar";
import { FaTrash } from "react-icons/fa";
import { updateProfile, changePassword, deleteUser } from "../api";

function Profile() {
  const { user, token, logout } = useAuth();
  const { theme } = useTheme();

  const [profileData, setProfileData] = useState({ full_name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [passError, setPassError] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ full_name: user.full_name, email: user.email });
    }
  }, [user]);

  if (!user) {
    return (
      <Auth>
        <NavbarComp />
        <Loading />
      </Auth>
    );
  }

  // Theme classes
  const bgClass = theme === "dark" ? "bg-secondary text-light" : "bg-white";
  const formControlClass =
    theme === "dark" ? "bg-dark text-light border-secondary" : "";

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    await updateProfile(token, profileData);
    setLoadingProfile(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoadingPass(true);
    setPassError(null);
    try {
      await changePassword(token, passwordData);
      setPasswordData({ current: "", new: "" });
    } catch (err) {
      if (err.response?.status === 401) {
        setPassError("Current password is incorrect.");
      } else {
        setPassError("Password update failed. Please try again.");
      }
    } finally {
      setLoadingPass(false);
    }
  };

  const handleDelete = async (e) => {
    await deleteUser(token);
    logout();
  };

  return (
    <>
      <NavbarComp />
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className={`shadow ${bgClass}`}>
              <Card.Header className="d-flex align-items-center">
                <div>
                  <h5 className="mb-0">Manage Profile</h5>
                </div>
              </Card.Header>

              <Card.Body>
                {/* Profile Info Form */}
                <h6 className="mb-3">Edit Profile</h6>
                <Form onSubmit={handleProfileSave}>
                  <FloatingLabel
                    controlId="floatingFullName"
                    label="Full Name"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      required
                      className={formControlClass}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Email Address"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                      className={formControlClass}
                    />
                  </FloatingLabel>

                  <div className="d-flex justify-content-between">
                    <Button
                      variant={theme === "dark" ? "light" : "primary"}
                      type="submit"
                      className="w-100"
                      disabled={loadingProfile}
                    >
                      {loadingProfile ? "Saving…" : "Save Profile"}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                {passError && (
                  <Alert
                    variant="danger"
                    onClose={() => setPassError(null)}
                    dismissible
                  >
                    {passError}
                  </Alert>
                )}
                {/* Change Password Form */}
                <h6 className="mb-3">Change Password</h6>
                <Form onSubmit={handlePasswordUpdate}>
                  <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="current"
                      onChange={handlePasswordChange}
                      required
                      className={formControlClass}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="newPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="new"
                      onChange={handlePasswordChange}
                      required
                      className={formControlClass}
                    />
                  </Form.Group>

                  <Button
                    variant={theme === "dark" ? "light" : "primary"}
                    type="submit"
                    disabled={loadingPass}
                    className="w-100"
                  >
                    {loadingPass ? "Updating…" : "Update Password"}
                  </Button>
                </Form>
                <hr className="my-4" />

                {/* Delete Account Button */}
                <div className="text-center">
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => setShowDelete(true)}
                  >
                    <FaTrash className="me-2" />
                    Delete Account
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            Are you sure you want to delete your account? This action is
            <strong> irreversible</strong>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowDelete(false);
              handleDelete();
            }}
          >
            Yes, delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Profile;
