// // AdminPage.js version ajout de verification JWT

// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Intercepteur pour gérer les erreurs d'authentification
  apiClient.interceptors.response.use(
    response => response,
    error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Rediriger vers la page de connexion si le token est manquant ou invalide
        navigate('/connexion'); // Utilisez navigate('/login') pour React Router v6
      }
      return Promise.reject(error);
    }
  );

  const fetchAdmins = async () => {
    try {
      const response = await apiClient.get('/admin/getall');
      setAdmins(response.data);
      console.log('Administrateurs récupérés:', response.data); // Log pour vérifier
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
      setMessage('Erreur lors de la récupération des administrateurs.');
    }
  };

  useEffect(() => {
    // Vérifier l'authentification en essayant de récupérer les admins
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/delete/${id}`);
      await fetchAdmins();
      setMessage("Administrateur supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
      setMessage("Erreur lors de la suppression de l'administrateur.");
    }
  };

  const handleEditClick = (admin) => {
    setEditingAdmin({ ...admin });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/admin/update/${editingAdmin.id}`, editingAdmin);
      await fetchAdmins();
      setEditingAdmin(null);
      setMessage("Administrateur mis à jour avec succès");
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'admin:', error);
      setMessage("Erreur lors de la mise à jour de l'administrateur.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAdmin({ ...editingAdmin, [name]: value });
  };

  const handleRegisterAdmin = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/signup', newAdmin);
      await fetchAdmins();
      setNewAdmin({ username: '', password: '' });
      setShowAddForm(false);
      setMessage("Administrateur ajouté avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
      setMessage("Erreur lors de l'ajout de l'administrateur.");
    }
  };

  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  return (
    <div className="container mt-5 admins-container">
      <h2 className="mb-4 text-center">Liste des Administrateurs</h2>

      <button
        className="btn btn-success mb-4 admin-button btn-add-admin"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
      </button>

      {showAddForm && (
        <div className="add-admin-container mb-4">
          <h3>Ajouter un Administrateur</h3>
          <form onSubmit={handleRegisterAdmin} className="add-admin-form">
            <div className="form-group mb-3">
              <label>Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={newAdmin.username}
                onChange={handleNewAdminChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Adresse e-mail</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={newAdmin.email}
                onChange={handleNewAdminChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={newAdmin.password}
                onChange={handleNewAdminChange}
                required
              />
            </div>

            {message && <div className="alert alert-info">{message}</div>}

            <button
              type="submit" // Utilise le type "submit" pour gérer la soumission du formulaire
              className="btn btn-primary admin-button btn-full-width"
            >
              Ajouter un Administrateur
            </button>
          </form>
        </div>
      )}

      {editingAdmin && (
        <div className="edit-admin-container mb-4">
          <h3>Modifier Administrateur</h3>
          <form onSubmit={handleEditSubmit} className="edit-admin-form">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={editingAdmin.username}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={editingAdmin.email}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary admin-action-button">Enregistrer les modifications</button>
              <button
                type="button"
                className="btn btn-secondary admin-action-button btn-cancel"
                onClick={() => setEditingAdmin(null)}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th className="text-center">Nom</th> {/* Centré */}
            <th className="actions-header text-center">Actions</th> {/* Aligné au centre */}
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td className="admin-name text-center">{admin.username}</td> {/* Centré */}
              <td className="text-center actions"> {/* Centré */}
                <div className="action-buttons">
                  <button
                    type="button" // Ajout type "button" pour éviter les soumissions du formulaire
                    className="btn btn-warning admin-action-button me-2"
                    onClick={() => handleEditClick(admin)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button" // Ajout type "button" pour éviter les soumissions du formulaire
                    className="btn btn-danger admin-action-button"
                    onClick={() => handleDelete(admin.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;




// // AdminPage.js version bouton "Modifier" et "Supprimer" modifié identique
// src/pages/AdminPage.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous d'importer le CSS

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
//   const [message, setMessage] = useState('');

//   const fetchAdmins = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/admin/getall');
//       setAdmins(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des administrateurs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/api/admin/delete/${id}`);
//       await fetchAdmins();
//       setMessage("Administrateur supprimé avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'admin:', error);
//       setMessage("Erreur lors de la suppression de l'administrateur.");
//     }
//   };

//   const handleEditClick = (admin) => {
//     setEditingAdmin({ ...admin });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
//       await fetchAdmins();
//       setEditingAdmin(null);
//       setMessage("Administrateur mis à jour avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'admin:', error);
//       setMessage("Erreur lors de la mise à jour de l'administrateur.");
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingAdmin({ ...editingAdmin, [name]: value });
//   };

//   const handleRegisterAdmin = async () => {
//     try {
//       await axios.post('http://localhost:3001/api/admin/signup', newAdmin);
//       await fetchAdmins();
//       setNewAdmin({ username: '', password: '' });
//       setShowAddForm(false);
//       setMessage("Administrateur ajouté avec succès");
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
//       setMessage("Erreur lors de l'ajout de l'administrateur.");
//     }
//   };

//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin({ ...newAdmin, [name]: value });
//   };

//   return (
//     <div className="container mt-5 admins-container">
//       <h2 className="mb-4 text-center">Liste des Administrateurs</h2>

//       <button
//         className="btn btn-success mb-4 admin-button btn-add-admin"
//         onClick={() => setShowAddForm(!showAddForm)}
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {showAddForm && (
//         <div className="add-admin-container mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <form className="add-admin-form">
//             <div className="form-group mb-3">
//               <label>Nom d'utilisateur</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="username"
//                 value={newAdmin.username}
//                 onChange={handleNewAdminChange}
//                 required
//               />
//             </div>

//             <div className="form-group mb-3">
//               <label>Mot de passe</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 name="password"
//                 value={newAdmin.password}
//                 onChange={handleNewAdminChange}
//                 required
//               />
//             </div>

//             {message && <div className="alert alert-info">{message}</div>}

//             <button
//               type="button" // Changez le type en "button" pour éviter le rechargement de la page
//               className="btn btn-primary admin-button btn-full-width"
//               onClick={handleRegisterAdmin}
//             >
//               Ajouter un Administrateur
//             </button>
//           </form>
//         </div>
//       )}

//       {editingAdmin && (
//         <div className="edit-admin-container mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit} className="edit-admin-form">
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 value={editingAdmin.username}
//                 onChange={handleEditChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">Mot de passe</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 value={editingAdmin.password || ""}
//                 onChange={handleEditChange}
//                 required
//               />
//             </div>
//             <div className="form-buttons">
//               <button type="submit" className="btn btn-primary admin-action-button">Enregistrer les modifications</button>
//               <button
//                 type="button"
//                 className="btn btn-secondary admin-action-button btn-cancel"
//                 onClick={() => setEditingAdmin(null)}
//               >
//                 Annuler
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th className="text-center">Nom</th> {/* Centré */}
//             <th className="actions-header text-center">Actions</th> {/* Aligné au centre */}
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td className="admin-name text-center">{admin.username}</td> {/* Centré */}
//               <td className="text-center actions"> {/* Centré */}
//                 <div className="action-buttons">
//                   <button
//                     className="btn btn-warning admin-action-button me-2"
//                     onClick={() => handleEditClick(admin)}
//                   >
//                     Modifier
//                   </button>
//                   <button
//                     className="btn btn-danger admin-action-button"
//                     onClick={() => handleDelete(admin.id)}
//                   >
//                     Supprimer
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPage;

// // AdminPage.js version ok
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous d'importer le CSS

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);
//   const [editingAdmin, setEditingAdmin] = useState(null);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
//   const [message, setMessage] = useState('');

//   const fetchAdmins = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/admin/getall');
//       setAdmins(response.data);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des administrateurs:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3001/api/admin/delete/${id}`);
//       await fetchAdmins();
//       setMessage("Administrateur supprimé avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'admin:', error);
//       setMessage("Erreur lors de la suppression de l'administrateur.");
//     }
//   };

//   const handleEditClick = (admin) => {
//     setEditingAdmin({ ...admin });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
//       await fetchAdmins();
//       setEditingAdmin(null);
//       setMessage("Administrateur mis à jour avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'admin:', error);
//       setMessage("Erreur lors de la mise à jour de l'administrateur.");
//     }
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingAdmin({ ...editingAdmin, [name]: value });
//   };

//   const handleRegisterAdmin = async () => {
//     try {
//       await axios.post('http://localhost:3001/api/admin/signup', newAdmin);
//       await fetchAdmins();
//       setNewAdmin({ username: '', password: '' });
//       setShowAddForm(false);
//       setMessage("Administrateur ajouté avec succès");
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
//       setMessage("Erreur lors de l'ajout de l'administrateur.");
//     }
//   };

//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin({ ...newAdmin, [name]: value });
//   };

//   return (
//     <div className="container mt-5 admins-container">
//       <h2 className="mb-4 text-center">Liste des Administrateurs</h2>

//       <button
//         className="btn btn-success mb-4 admin-button btn-add-admin"
//         onClick={() => setShowAddForm(!showAddForm)}
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {showAddForm && (
//         <div className="add-admin-container mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <form className="add-admin-form">
//             <div className="form-group mb-3">
//               <label>Nom d'utilisateur</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 name="username"
//                 value={newAdmin.username}
//                 onChange={handleNewAdminChange}
//                 required
//               />
//             </div>

//             <div className="form-group mb-3">
//               <label>Mot de passe</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 name="password"
//                 value={newAdmin.password}
//                 onChange={handleNewAdminChange}
//                 required
//               />
//             </div>

//             {message && <div className="alert alert-info">{message}</div>}

//             <button
//               type="button" // Changez le type en "button" pour éviter le rechargement de la page
//               className="btn btn-primary admin-button btn-full-width"
//               onClick={handleRegisterAdmin}
//             >
//               Ajouter un Administrateur
//             </button>
//           </form>
//         </div>
//       )}

//       {editingAdmin && (
//         <div className="edit-admin-container mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit} className="edit-admin-form">
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="username"
//                 name="username"
//                 value={editingAdmin.username}
//                 onChange={handleEditChange}
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label htmlFor="password" className="form-label">Mot de passe</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 name="password"
//                 value={editingAdmin.password || ""}
//                 onChange={handleEditChange}
//                 required
//               />
//             </div>
//             <div className="form-buttons">
//               <button type="submit" className="btn btn-primary admin-button">Enregistrer les modifications</button>
//               <button
//                 type="button"
//                 className="btn btn-secondary admin-button btn-cancel"
//                 onClick={() => setEditingAdmin(null)}
//               >
//                 Annuler
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th className="text-center">Nom</th> {/* Centré */}
//             <th className="actions-header text-center">Actions</th> {/* Aligné au centre */}
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td className="admin-name text-center">{admin.username}</td> {/* Centré */}
//               <td className="text-center actions"> {/* Centré */}
//                 <div className="action-buttons">
//                   <button
//                     className="btn btn-warning btn-sm me-2"
//                     onClick={() => handleEditClick(admin)}
//                   >
//                     Modifier
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(admin.id)}
//                   >
//                     Supprimer
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminPage;

