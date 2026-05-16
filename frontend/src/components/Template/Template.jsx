import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Template = () => {
  const location = useLocation(); // Récupère la route actuelle

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Si on est sur la page de connexion, afficher le texte, sinon afficher le Header */}
      {location.pathname === '/connexion' ? (
        <div className="text-center my-4">
          <h1>AUTO ECOLE DES BORDS DE MARNE</h1>
        </div>
      ) : (
        <Header />
      )}

      <main className="flex-grow-1">
        <Outlet />
      </main>

      {/* Affiche le Footer uniquement si la route n'est pas '/connexion' */}
      {location.pathname !== '/connexion' && <Footer />}
    </div>
  );
};

export default Template;
