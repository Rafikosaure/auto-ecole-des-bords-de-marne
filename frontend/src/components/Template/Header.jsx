import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from 'react-router-dom';
import Logo from "../../images/logo.webp";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Header.css"

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch(`${config.apiBaseUrl}/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (response.ok) {
      navigate('/connexion');
    }
  }

  return (
    <Navbar expand="lg" className="custom-header">
      <Container>
        <Navbar.Brand href="/students" className="d-flex align-items-center">
          <img src={Logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {location.pathname === "/admin" ? (
              <>
                <Nav.Link as={NavLink} to="/students">
                  <p className="fs-3">Étudiants</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/instructors">
                  <p className="fs-3">Moniteurs</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/connexion" onClick={handleLogout}>
                  <p className="fs-3">Déconnexion</p>
                </Nav.Link>
              </>
            ) : location.pathname === "/instructors" ? (
              <>
                <Nav.Link as={NavLink} to="/students">
                  <p className="fs-3">Étudiants</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin">
                  <p className="fs-3">Administrateurs</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/connexion" onClick={handleLogout}>
                  <p className="fs-3">Déconnexion</p>
                </Nav.Link>
              </>
            ) : location.pathname === "/students" ? (
              <>
                <Nav.Link as={NavLink} to="/instructors">
                  <p className="fs-3">Moniteurs</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin">
                  <p className="fs-3">Administrateurs</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/connexion" onClick={handleLogout}>
                  <p className="fs-3">Déconnexion</p>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/students">
                  <p className="fs-3">Étudiants</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/instructors">
                  <p className="fs-3">Moniteurs</p>
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin">
                  <p className="fs-3">Administrateurs</p>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
