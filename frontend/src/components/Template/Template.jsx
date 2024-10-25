import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Template = () => {
  const location = useLocation(); // Récupère la route actuelle

  return (
    <>
      {/* Si on est sur la page de connexion, afficher le texte, sinon afficher le Header */}
      {location.pathname === '/connexion' ? (
        <div className="text-center my-4">
          <h1>AUTO ECOLE DES BORDS DE MARNE</h1>
        </div>
      ) : (
        <Header />
      )}

      <main>
        <Outlet />
      </main>

      {/* Affiche le Footer uniquement si la route n'est pas '/connexion' */}
      {location.pathname !== '/connexion' && <Footer />}
    </>
  );
};

export default Template;

// import { Outlet } from "react-router-dom";
// import Footer from "./Footer";
// import Header from "./Header";

// const Template = () => {
//   return (
//     <>
//       <Header />
//       <main>
//         <Outlet />
//       </main>
//       <Footer />
//     </>
//   );
// };
// export default Template;
