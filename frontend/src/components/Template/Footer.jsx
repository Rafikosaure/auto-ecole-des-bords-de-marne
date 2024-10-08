import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-light py-3 mt-auto">
      <Container className="text-center">
        <Link to="/mentions-legales" className="footer-link">
          Mentions légales
        </Link>
      </Container>
    </footer>
  );
};

export default Footer;
