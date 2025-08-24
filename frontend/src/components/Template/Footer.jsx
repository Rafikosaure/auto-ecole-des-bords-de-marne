import { Container } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "./Footer.css"

const Footer = () => {
  return (
    <footer className="page-footer bg-light py-3 mt-auto">
      <Container className="text-center">
        {/* <Link to="/mentions-legales" className="footer-link">
          Mentions légales
        </Link> */}
        <span>© 2024 Auto-école des bords de Marne</span>
      </Container>
    </footer>
  );
};

export default Footer;
