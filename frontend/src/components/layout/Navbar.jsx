import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaBell } from 'react-icons/fa';

const AppNavbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">EduShare</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/events">Events</Nav.Link>
                <Nav.Link as={Link} to={`/user/${currentUser.id}`}>My Profile</Nav.Link>

                {/* 🔥 Learning Plan Dropdown */}
                <NavDropdown title="Learning Plans" id="learningPlans-dropdown">
                  <NavDropdown.Item as={Link} to="/allLearningPlan">
                    All Learning Plans
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/addLearningPlan">
                    Add Learning Plan
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/myLearningPlan">
                    My Learning Plans
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>

          <Nav>
            {currentUser ? (
              <>
                <Navbar.Text className="me-3 d-flex align-items-center">
                  Welcome, {currentUser.fullName}
                  <Link to="/notifications" className="ms-3 text-white">
                    <FaBell />
                  </Link>
                </Navbar.Text>

                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
