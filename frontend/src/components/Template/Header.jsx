import { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, Link } from 'react-router-dom';
import Logo from "../../images/logo.webp";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const [navExpanded, setNavExpanded] = useState(false);

  const closeNav = () => setNavExpanded(false);

  const handleLogout = async () => {
    closeNav();
    const response = await fetch(`${config.apiBaseUrl}/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (response.ok) {
      navigate('/connexion');
    }
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm border-bottom" expanded={navExpanded} onToggle={setNavExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/students" className="d-flex align-items-center" onClick={closeNav}>
          <img src={Logo} alt="Logo" style={{ width: 'clamp(100px, 25vw, 300px)', height: 'auto' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-1">
            <Nav.Link as={NavLink} to="/students" className="nav-item-link" onClick={closeNav}>
              Étudiants
            </Nav.Link>
            <Nav.Link as={NavLink} to="/instructors" className="nav-item-link" onClick={closeNav}>
              Moniteurs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/admin" className="nav-item-link" onClick={closeNav}>
              Administrateurs
            </Nav.Link>
            <Nav.Link as={NavLink} to="/connexion" className="nav-item-link" onClick={handleLogout}>
              Déconnexion
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
