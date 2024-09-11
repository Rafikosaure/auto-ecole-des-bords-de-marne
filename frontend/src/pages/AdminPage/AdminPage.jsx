// src/pages/AdminPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Importation de useNavigate pour la redirection
import { admins } from '../../services/adminData';  // Importation des données

const AdminPage = () => {
  const navigate = useNavigate(); // Initialisation de useNavigate

  // Fonction pour gérer la modification
  const handleEdit = (id) => {
    console.log('Modifier admin avec l\'id:', id);
  };

  // Fonction pour gérer la suppression
  const handleDelete = (id) => {
    console.log('Supprimer admin avec l\'id:', id);
  };

  // Fonction pour rediriger vers la page d'ajout d'un nouvel administrateur
  const handleAddAdmin = () => {
    navigate('/adminregister');  // Redirige vers la page adminregister
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Administrateurs</h2>

      {/* Bouton "Rajouter un Administrateur" */}
      <button 
        className="btn btn-success mb-4"
        onClick={handleAddAdmin}
      >
        Rajouter un Administrateur
      </button>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Mot de passe</th>
            <th>Adresse</th>
            <th>Actions</th> {/* Nouvelle colonne pour les boutons */}
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.lastName}</td>
              <td>{admin.firstName}</td>
              <td>{admin.email}</td>
              <td>{admin.password}</td>
              <td>{admin.address}</td>
              <td>
                <button 
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleEdit(admin.id)}
                >
                  Modifier
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(admin.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;


// // src/pages/AdminPage.js
// import React from 'react';
// import { admins } from '../../services/adminData';  // Importation des données

// const AdminPage = () => {
//   // Fonction pour gérer la modification
//   const handleEdit = (id) => {
//     console.log('Modifier admin avec l\'id:', id);
//     // Implémente la logique pour modifier l'administrateur (par exemple, ouvrir un formulaire de modification)
//   };

//   // Fonction pour gérer la suppression
//   const handleDelete = (id) => {
//     console.log('Supprimer admin avec l\'id:', id);
//     // Implémente la logique pour supprimer l'administrateur (par exemple, envoyer une requête de suppression)
//   };

//   // Fonction pour rediriger ou afficher le formulaire d'ajout d'un nouvel administrateur
//   const handleAddAdmin = () => {
//     console.log('Ajouter un nouvel administrateur');
//     // Implémente la logique pour ajouter un administrateur (par exemple, redirection vers une page de formulaire)
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Liste des Administrateurs</h2>
      
//       {/* Bouton "Rajouter un Administrateur" */}
//       <button 
//         className="btn btn-success mb-4"
//         onClick={handleAddAdmin}
//       >
//         Rajouter un Administrateur
//       </button>
      
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Nom</th>
//             <th>Prénom</th>
//             <th>Email</th>
//             <th>Mot de passe</th>
//             <th>Adresse</th>
//             <th>Actions</th> {/* Nouvelle colonne pour les boutons */}
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map(admin => (
//             <tr key={admin.id}>
//               <td>{admin.lastName}</td>
//               <td>{admin.firstName}</td>
//               <td>{admin.email}</td>
//               <td>{admin.password}</td>
//               <td>{admin.address}</td>
//               <td>
//                 <button 
//                   className="btn btn-primary btn-sm me-2"
//                   onClick={() => handleEdit(admin.id)}
//                 >
//                   Modifier
//                 </button>
//                 <button 
//                   className="btn btn-danger btn-sm"
//                   onClick={() => handleDelete(admin.id)}
//                 >
//                   Supprimer
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPage;

