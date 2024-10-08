import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Logo from "../../images/logo.webp";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Header.css"

const Header = () => {
  const location = useLocation();

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
                <LinkContainer to="/students">
                  <Nav.Link className="fs-3">Étudiants</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/instructors">
                  <Nav.Link className="fs-3">Formateurs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/connexion">
                  <Nav.Link className="fs-3">Déconnexion</Nav.Link>
                </LinkContainer>
              </>
            ) : location.pathname === "/instructors" ? (
              <>
                <LinkContainer to="/students">
                  <Nav.Link className="fs-3">Étudiants</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin">
                  <Nav.Link className="fs-3">Administrateurs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/connexion">
                  <Nav.Link className="fs-3">Déconnexion</Nav.Link>
                </LinkContainer>
              </>
            ) : location.pathname === "/students" ? (
              <>
                <LinkContainer to="/instructors">
                  <Nav.Link className="fs-3">Formateurs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin">
                  <Nav.Link className="fs-3">Administrateurs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/connexion">
                  <Nav.Link className="fs-3">Déconnexion</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <>
                <LinkContainer to="/students">
                  <Nav.Link className="fs-3">Étudiants</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/instructors">
                  <Nav.Link className="fs-3">Formateurs</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/admin">
                  <Nav.Link className="fs-3">Administrateurs</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
