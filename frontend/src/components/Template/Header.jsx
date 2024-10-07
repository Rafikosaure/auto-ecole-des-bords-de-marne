


// // auto-ecole-des-bords-de-marne/frontend/src/components/Template/Header.jsx VERSION TEST 

import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Logo from "../../images/logo.webp";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


const Header = () => {
  const location = useLocation(); // Récupère la route actuelle

  return (
    <Navbar  expand="lg" className="custom-header">
      <Container>
        <Navbar.Brand href="/students">
          <img src={Logo} alt="Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Liens pour la page admin */}
            {location.pathname === '/admin' ? (
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
            ) : location.pathname === '/instructors' ? (
              <>
                {/* Liens pour la page des formateurs */}
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
            ) : location.pathname === '/students' ? (
              <>
                {/* Liens pour la page des étudiants */}
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
                {/* Autres liens pour les autres routes */}
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


// import { Navbar, Nav, Container } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
// import { useLocation } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

// const Header = () => {
//   const location = useLocation(); // Récupère la route actuelle

//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         <Navbar.Brand href="/">logo</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             {/* Vérifie si la route est '/admin' */}
//             {location.pathname === '/admin' ? (
//               <>
//                 <LinkContainer to="/instructors">
//                   <Nav.Link className="fs-3">Formateurs</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/students">
//                   <Nav.Link className="fs-3">Étudiants</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/deconnexion">
//                   <Nav.Link className="fs-3">Déconnexion</Nav.Link>
//                 </LinkContainer>
//               </>
//             ) : location.pathname === '/instructors' ? (
//               <>
//                 {/* Liens pour la page des formateurs */}
//                 <LinkContainer to="/students">
//                   <Nav.Link className="fs-3">Étudiants</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/admin">
//                   <Nav.Link className="fs-3">Administrateurs</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/deconnexion">
//                   <Nav.Link className="fs-3">Déconnexion</Nav.Link>
//                 </LinkContainer>
//               </>
//             ) : (
//               <>
//                 {/* Autres liens si la route n'est pas '/admin' ou '/instructors' */}
//                 <LinkContainer to="/students">
//                   <Nav.Link className="fs-3">Étudiants</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/instructors">
//                   <Nav.Link className="fs-3">Formateurs</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/admin">
//                   <Nav.Link className="fs-3">Administrateurs</Nav.Link>
//                 </LinkContainer>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;


// import { Navbar, Nav, Container } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
// import { useLocation } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

// const Header = () => {
//   const location = useLocation(); // Récupère la route actuelle

//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         <Navbar.Brand href="/">logo</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             {/* Vérifie si la route est '/admin' */}
//             {location.pathname === '/admin' ? (
//               <>
//                 <LinkContainer to="/instructors">
//                   <Nav.Link className="fs-3">Formateurs</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/students">
//                   <Nav.Link className="fs-3">Étudiants</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/deconnexion">
//                   <Nav.Link className="fs-3">Déconnexion</Nav.Link>
//                 </LinkContainer>
//               </>
//             ) : (
//               <>
//                 {/* Autres liens si la route n'est pas '/admin' */}
//                 <LinkContainer to="/students">
//                   <Nav.Link className="fs-3">Étudiants</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/instructors">
//                   <Nav.Link className="fs-3">Formateurs</Nav.Link>
//                 </LinkContainer>
//                 <LinkContainer to="/admin">
//                   <Nav.Link className="fs-3">Administrateurs</Nav.Link>
//                 </LinkContainer>
//               </>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;


// auto-ecole-des-bords-de-marne/frontend/src/components/Template/Header.jsx VERSION OK 
// import { Navbar, Nav, Container } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min'; 


// const Header = () => {
//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         <Navbar.Brand href="/">logo</Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="ms-auto">
//             <LinkContainer to="/students">
//               <Nav.Link className="fs-3">Étudiants</Nav.Link>
//             </LinkContainer>
//             <LinkContainer to="/instructors">
//               <Nav.Link className="fs-3">Formateurs</Nav.Link>
//             </LinkContainer>
//             <LinkContainer to="/admin">
//               <Nav.Link className="fs-3">Administrateurs</Nav.Link>
//             </LinkContainer>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default Header;
