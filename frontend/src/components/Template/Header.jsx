import { useState } from "react";
import { NavLink, Link } from 'react-router';
import Logo from "../../images/logo.webp";
import { useNavigate } from "react-router";
import config from "../../config";
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
    <nav className="navbar bg-white shadow-sm border-bottom">
      <div className="container">
        <Link to="/students" className="d-flex align-items-center" onClick={closeNav}>
          <img src={Logo} alt="Logo" style={{ width: 'clamp(100px, 25vw, 300px)', height: 'auto' }} />
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          aria-controls="basic-navbar-nav"
          aria-expanded={navExpanded}
          aria-label="Ouvrir le menu"
          onClick={() => setNavExpanded((expanded) => !expanded)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`navbar-collapse${navExpanded ? ' show' : ''}`} id="basic-navbar-nav">
          <div className="nav ms-auto gap-1">
            <NavLink to="/students" className="nav-link nav-item-link" onClick={closeNav}>
              Étudiants
            </NavLink>
            <NavLink to="/instructors" className="nav-link nav-item-link" onClick={closeNav}>
              Moniteurs
            </NavLink>
            <NavLink to="/admin" className="nav-link nav-item-link" onClick={closeNav}>
              Administrateurs
            </NavLink>
            <NavLink to="/connexion" className="nav-link nav-item-link" onClick={handleLogout}>
              Déconnexion
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
