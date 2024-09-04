// import { useState } from "react";
import { Link} from "react-router-dom";


const Header = () => {
  return (
    <header>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/students">liste des étudiants</Link>
            </li>
            <li>
              <Link to="/teachers">liste des Formateurs</Link>
            </li>
            <li>
              <Link to="/admin">Gestion du site</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;
