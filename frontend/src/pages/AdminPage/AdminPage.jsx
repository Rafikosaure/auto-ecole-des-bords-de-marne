// src/pages/AdminPage.js VERSION TEST 
// src/pages/AdminPage.js
import React, { useState } from 'react';
import { admins } from '../../services/adminData';  // Importation des données

const AdminPage = () => {
  // État pour stocker les informations du formulaire
  const [editableAdmin, setEditableAdmin] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    address: ''
  });

  // Fonction pour gérer la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableAdmin({
      ...editableAdmin,
      [name]: value
    });
  };

  // Fonction pour soumettre les modifications ou ajouter un nouvel administrateur
  const handleSaveAdmin = () => {
    console.log('Sauvegarder les modifications:', editableAdmin);
    // Ici tu pourrais ajouter la logique pour sauvegarder les données
  };

  // Fonction pour gérer la modification
  const handleEdit = (id) => {
    console.log('Modifier admin avec l\'id:', id);
    // Implémente la logique pour modifier l'administrateur
  };

  // Fonction pour gérer la suppression
  const handleDelete = (id) => {
    console.log('Supprimer admin avec l\'id:', id);
    // Implémente la logique pour supprimer l'administrateur
  };

  return (
    <div className="container mt-5">
      {/* Premier conteneur : Liste des Administrateurs */}
      <h2 className="mb-4">Liste des Administrateurs</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Mot de passe</th>
            <th>Adresse</th>
            <th>Actions</th> {/* Colonne pour les boutons */}
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

      {/* Deuxième conteneur : Rajouter un Administrateur */}
      <div className="container mt-5">
        <h2 className="mb-4">Rajouter un administrateur</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Mot de passe</th>
              <th>Adresse</th>
              <th>Actions</th> {/* Colonne pour le bouton "Sauvegarder" */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={editableAdmin.lastName}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={editableAdmin.firstName}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={editableAdmin.email}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={editableAdmin.password}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={editableAdmin.address}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={handleSaveAdmin}
                >
                  Sauvegarder
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;




// // src/pages/AdminPage.js VERSION OK

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

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Liste des Administrateurs</h2>
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


