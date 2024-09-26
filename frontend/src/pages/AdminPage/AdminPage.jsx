

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Fichier CSS personnalisé pour les media queries

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
//     <div className="container mt-5"> 
//       <h2 className="text-center mb-4">Liste des Administrateurs</h2>

//       <button
//         className="btn btn-success mb-4 w-100"  // Bouton responsive
//         onClick={() => setShowAddForm(!showAddForm)}  
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {showAddForm && (
//         <div className="mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <div className="row">
//             <div className="col-sm-12 col-md-6 mb-3">
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
//             <div className="col-sm-12 col-md-6 mb-3">
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
//           </div>

//           {message && <div className="alert alert-info">{message}</div>}

//           <button 
//             className="btn btn-primary"
//             onClick={handleRegisterAdmin}
//           >
//             Ajouter un Administrateur
//           </button>
//         </div>
//       )}

//       {editingAdmin && (
//         <div className="mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit}>
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">
//                 Nom d'utilisateur
//               </label>
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
//               <label htmlFor="password" className="form-label">
//                 Mot de passe
//               </label>
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
//             <button type="submit" className="btn btn-primary w-100">
//               Enregistrer les modifications
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary w-100 mt-2"
//               onClick={() => setEditingAdmin(null)}
//             >
//               Annuler
//             </button>
//           </form>
//         </div>
//       )}

//       <table className="table table-striped table-responsive-md">
//         <thead>
//           <tr>
//             <th>Nom</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td>{admin.username}</td>
//               <td>
//                 <div className="d-flex justify-content-between">
//                   <button
//                     className="btn btn-warning btn-sm"
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



// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous que le fichier CSS est bien importé

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);  // État pour stocker les administrateurs
//   const [editingAdmin, setEditingAdmin] = useState(null);  // État pour stocker l'administrateur en cours d'édition
//   const [showAddForm, setShowAddForm] = useState(false);  // État pour afficher ou non le formulaire d'ajout d'administrateur
//   const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });  // État pour les informations du nouvel administrateur
//   const [message, setMessage] = useState('');  // État pour afficher un message de succès ou d'erreur

//   // Fonction pour récupérer les administrateurs depuis le backend
//   const fetchAdmins = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/admin/getall');
//       setAdmins(response.data);  // Mets à jour l'état avec les données récupérées
//     } catch (error) {
//       console.error('Erreur lors de la récupération des administrateurs:', error);
//     }
//   };

//   // Utilisation du useEffect pour charger les administrateurs lors du montage du composant
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // Fonction pour gérer la suppression
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

//   // Fonction pour afficher le formulaire d'édition
//   const handleEditClick = (admin) => {
//     setEditingAdmin({ ...admin });  // Définit l'administrateur en cours d'édition
//   };

//   // Fonction pour gérer la soumission du formulaire d'édition
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
//       await fetchAdmins();
//       setEditingAdmin(null);  // Ferme le formulaire après la soumission
//       setMessage("Administrateur mis à jour avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'admin:', error);
//       setMessage("Erreur lors de la mise à jour de l'administrateur.");
//     }
//   };

//   // Fonction pour gérer les changements dans le formulaire d'édition
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingAdmin({ ...editingAdmin, [name]: value });
//   };

//   // Fonction pour gérer l'ajout d'un nouvel administrateur
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

//   // Fonction pour gérer les changements dans le formulaire d'ajout
//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin({ ...newAdmin, [name]: value });
//   };

//   return (
//     <div className="container border mt-5"> {/* Ajout de la classe border */}
//       <h2 className="text-center mb-4">Liste des Administrateurs</h2>

//       {/* Bouton "Rajouter un Administrateur" */}
//       <button
//         className="btn btn-success mb-4"
//         onClick={() => setShowAddForm(!showAddForm)}  // Toggle l'affichage du formulaire d'ajout
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {/* Formulaire d'ajout d'administrateur */}
//       {showAddForm && (
//         <div className="mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <div className="form-group mb-3">
//             <label>Nom d'utilisateur</label>
//             <input
//               type="text"
//               className="form-control"
//               name="username"
//               value={newAdmin.username}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           <div className="form-group mb-3">
//             <label>Mot de passe</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={newAdmin.password}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           {/* Message de succès ou d'erreur */}
//           {message && <div className="alert alert-info">{message}</div>}

//           <button 
//             className="btn btn-primary"
//             onClick={handleRegisterAdmin}
//           >
//             Ajouter un Administrateur
//           </button>
//         </div>
//       )}

//       {/* Formulaire d'édition */}
//       {editingAdmin && (
//         <div className="mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit}>
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">
//                 Nom d'utilisateur
//               </label>
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
//               <label htmlFor="password" className="form-label">
//                 Mot de passe
//               </label>
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
//             <button type="submit" className="btn btn-primary">
//               Enregistrer les modifications
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary ms-2"
//               onClick={() => setEditingAdmin(null)}
//             >
//               Annuler
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Liste des administrateurs */}
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Nom</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td>{admin.username}</td>
//               <td>
//                 <div className="d-flex justify-content-between w-100">
//                   <button
//                     className="btn btn-warning btn-sm"
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


// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous que le fichier CSS est bien importé

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);  // État pour stocker les administrateurs
//   const [editingAdmin, setEditingAdmin] = useState(null);  // État pour stocker l'administrateur en cours d'édition
//   const [showAddForm, setShowAddForm] = useState(false);  // État pour afficher ou non le formulaire d'ajout d'administrateur
//   const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });  // État pour les informations du nouvel administrateur
//   const [message, setMessage] = useState('');  // État pour afficher un message de succès ou d'erreur

//   // Fonction pour récupérer les administrateurs depuis le backend
//   const fetchAdmins = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/admin/getall');
//       setAdmins(response.data);  // Mets à jour l'état avec les données récupérées
//     } catch (error) {
//       console.error('Erreur lors de la récupération des administrateurs:', error);
//     }
//   };

//   // Utilisation du useEffect pour charger les administrateurs lors du montage du composant
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // Fonction pour gérer la suppression
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

//   // Fonction pour afficher le formulaire d'édition
//   const handleEditClick = (admin) => {
//     setEditingAdmin({ ...admin });  // Définit l'administrateur en cours d'édition
//   };

//   // Fonction pour gérer la soumission du formulaire d'édition
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
//       await fetchAdmins();
//       setEditingAdmin(null);  // Ferme le formulaire après la soumission
//       setMessage("Administrateur mis à jour avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'admin:', error);
//       setMessage("Erreur lors de la mise à jour de l'administrateur.");
//     }
//   };

//   // Fonction pour gérer les changements dans le formulaire d'édition
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingAdmin({ ...editingAdmin, [name]: value });
//   };

//   // Fonction pour gérer l'ajout d'un nouvel administrateur
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

//   // Fonction pour gérer les changements dans le formulaire d'ajout
//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin({ ...newAdmin, [name]: value });
//   };

//   return (
//     <div className="container border mt-5"> {/* Ajout de la classe border */}
//       <h2 className="text-center mb-4">Liste des Administrateurs</h2>

//       {/* Bouton "Rajouter un Administrateur" */}
//       <button
//         className="btn btn-success mb-4"
//         onClick={() => setShowAddForm(!showAddForm)}  // Toggle l'affichage du formulaire d'ajout
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {/* Formulaire d'ajout d'administrateur */}
//       {showAddForm && (
//         <div className="mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <div className="form-group mb-3">
//             <label>Nom d'utilisateur</label>
//             <input
//               type="text"
//               className="form-control"
//               name="username"
//               value={newAdmin.username}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           <div className="form-group mb-3">
//             <label>Mot de passe</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={newAdmin.password}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           {/* Message de succès ou d'erreur */}
//           {message && <div className="alert alert-info">{message}</div>}

//           <button 
//             className="btn btn-primary"
//             onClick={handleRegisterAdmin}
//           >
//             Ajouter un Administrateur
//           </button>
//         </div>
//       )}

//       {/* Formulaire d'édition */}
//       {editingAdmin && (
//         <div className="mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit}>
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">
//                 Nom d'utilisateur
//               </label>
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
//               <label htmlFor="password" className="form-label">
//                 Mot de passe
//               </label>
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
//             <button type="submit" className="btn btn-primary">
//               Enregistrer les modifications
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary ms-2"
//               onClick={() => setEditingAdmin(null)}
//             >
//               Annuler
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Liste des administrateurs */}
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Nom</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td>{admin.username}</td>
//               <td>
//                 <div className="action-buttons">
//                   <button
//                     className="btn btn-warning btn-sm rotate-button me-2"
//                     onClick={() => handleEditClick(admin)}
//                   >
//                     Modifier
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm rotate-button"
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


// // src/pages/AdminPage/AdminPage.jsx

// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous que le fichier CSS est bien importé

// const AdminPage = () => {
//   const [admins, setAdmins] = useState([]);  // État pour stocker les administrateurs
//   const [editingAdmin, setEditingAdmin] = useState(null);  // État pour stocker l'administrateur en cours d'édition
//   const [showAddForm, setShowAddForm] = useState(false);  // État pour afficher ou non le formulaire d'ajout d'administrateur
//   const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });  // État pour les informations du nouvel administrateur
//   const [message, setMessage] = useState('');  // État pour afficher un message de succès ou d'erreur

//   // Fonction pour récupérer les administrateurs depuis le backend
//   const fetchAdmins = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/admin/getall');
//       setAdmins(response.data);  // Mets à jour l'état avec les données récupérées
//     } catch (error) {
//       console.error('Erreur lors de la récupération des administrateurs:', error);
//     }
//   };

//   // Utilisation du useEffect pour charger les administrateurs lors du montage du composant
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   // Fonction pour gérer la suppression
//   const handleDelete = async (id) => {
//     try {
//       // Suppression de l'administrateur via l'API
//       await axios.delete(`http://localhost:3001/api/admin/delete/${id}`);
//       // Rafraîchir la liste des administrateurs après suppression
//       await fetchAdmins();
//       setMessage("Administrateur supprimé avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la suppression de l\'admin:', error);
//       setMessage("Erreur lors de la suppression de l'administrateur.");
//     }
//   };

//   // Fonction pour afficher le formulaire d'édition
//   const handleEditClick = (admin) => {
//     setEditingAdmin({ ...admin });  // Définit l'administrateur en cours d'édition
//   };

//   // Fonction pour gérer la soumission du formulaire d'édition
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Envoyer les données du formulaire au backend pour mise à jour
//       await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
//       // Rafraîchir la liste des administrateurs après mise à jour
//       await fetchAdmins();
//       setEditingAdmin(null);  // Ferme le formulaire après la soumission
//       setMessage("Administrateur mis à jour avec succès");
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour de l\'admin:', error);
//       setMessage("Erreur lors de la mise à jour de l'administrateur.");
//     }
//   };

//   // Fonction pour gérer les changements dans le formulaire d'édition
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditingAdmin({ ...editingAdmin, [name]: value });
//   };

//   // Fonction pour gérer l'ajout d'un nouvel administrateur
//   const handleRegisterAdmin = async () => {
//     try {
//       // Requête POST vers le backend pour enregistrer un nouvel admin
//       await axios.post('http://localhost:3001/api/admin/signup', newAdmin);
//       // Rafraîchir la liste des administrateurs après ajout
//       await fetchAdmins();
//       // Réinitialise le formulaire après succès
//       setNewAdmin({ username: '', password: '' });
//       setShowAddForm(false);  // Masquer le formulaire d'ajout
//       setMessage("Administrateur ajouté avec succès");
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
//       setMessage("Erreur lors de l'ajout de l'administrateur.");
//     }
//   };

//   // Fonction pour gérer les changements dans le formulaire d'ajout
//   const handleNewAdminChange = (e) => {
//     const { name, value } = e.target;
//     setNewAdmin({ ...newAdmin, [name]: value });
//   };

//   return (
//     <div className="container border mt-5"> {/* Ajout de la classe border */}
//       <h2 className="text-center mb-4">Liste des Administrateurs</h2>

//       {/* Bouton "Rajouter un Administrateur" */}
//       <button
//         className="btn btn-success mb-4"
//         onClick={() => setShowAddForm(!showAddForm)}  // Toggle l'affichage du formulaire d'ajout
//       >
//         {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//       </button>

//       {/* Formulaire d'ajout d'administrateur */}
//       {showAddForm && (
//         <div className="mb-4">
//           <h3>Ajouter un Administrateur</h3>
//           <div className="form-group mb-3">
//             <label>Nom d'utilisateur</label>
//             <input
//               type="text"
//               className="form-control"
//               name="username"
//               value={newAdmin.username}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           <div className="form-group mb-3">
//             <label>Mot de passe</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={newAdmin.password}
//               onChange={handleNewAdminChange}
//               required
//             />
//           </div>

//           {/* Message de succès ou d'erreur */}
//           {message && <div className="alert alert-info">{message}</div>}

//           <button 
//             className="btn btn-primary"
//             onClick={handleRegisterAdmin}
//           >
//             Ajouter un Administrateur
//           </button>
//         </div>
//       )}

//       {/* Formulaire d'édition */}
//       {editingAdmin && (
//         <div className="mb-4">
//           <h3>Modifier Administrateur</h3>
//           <form onSubmit={handleEditSubmit}>
//             <div className="mb-3">
//               <label htmlFor="username" className="form-label">
//                 Nom d'utilisateur
//               </label>
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
//               <label htmlFor="password" className="form-label">
//                 Mot de passe
//               </label>
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
//             <button type="submit" className="btn btn-primary">
//               Enregistrer les modifications
//             </button>
//             <button
//               type="button"
//               className="btn btn-secondary ms-2"
//               onClick={() => setEditingAdmin(null)}
//             >
//               Annuler
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Liste des administrateurs */}
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Nom</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin.id}>
//               <td>{admin.username}</td>
//               <td>
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



// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './AdminPage.css'; // Assurez-vous d'importer votre fichier CSS

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
//     <div className="container mt-5">
//       <div className="text-center border border-dark rounded p-4"> {/* Bordure noire ajoutée */}
//         <h2 className="mb-4">Liste des Administrateurs</h2>

//         <button
//           className="btn btn-success mb-4"
//           onClick={() => setShowAddForm(!showAddForm)}
//         >
//           {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//         </button>

//         {showAddForm && (
//           <div className="mb-4">
//             <h3>Ajouter un Administrateur</h3>
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
//               className="btn btn-primary"
//               onClick={handleRegisterAdmin}
//             >
//               Ajouter un Administrateur
//             </button>
//           </div>
//         )}

//         {editingAdmin && (
//           <div className="mb-4">
//             <h3>Modifier Administrateur</h3>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="username" className="form-label">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="username"
//                   name="username"
//                   value={editingAdmin.username}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label">
//                   Mot de passe
//                 </label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="password"
//                   name="password"
//                   value={editingAdmin.password || ""}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Enregistrer les modifications
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => setEditingAdmin(null)}
//               >
//                 Annuler
//               </button>
//             </form>
//           </div>
//         )}

//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Nom</th>
//               <th>Mot de passe</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map((admin) => (
//               <tr key={admin.id}>
//                 <td>{admin.username}</td>
//                 <td>
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
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;


// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

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
//     <div className="container mt-5">
//       <div className="text-center border border-primary rounded p-4"> {/* Bordure ajoutée */}
//         <h2 className="mb-4">Liste des Administrateurs</h2>

//         <button
//           className="btn btn-success mb-4"
//           onClick={() => setShowAddForm(!showAddForm)}
//         >
//           {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//         </button>

//         {showAddForm && (
//           <div className="mb-4">
//             <h3>Ajouter un Administrateur</h3>
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
//               className="btn btn-primary"
//               onClick={handleRegisterAdmin}
//             >
//               Ajouter un Administrateur
//             </button>
//           </div>
//         )}

//         {editingAdmin && (
//           <div className="mb-4">
//             <h3>Modifier Administrateur</h3>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="username" className="form-label">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="username"
//                   name="username"
//                   value={editingAdmin.username}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label">
//                   Mot de passe
//                 </label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="password"
//                   name="password"
//                   value={editingAdmin.password || ""}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Enregistrer les modifications
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => setEditingAdmin(null)}
//               >
//                 Annuler
//               </button>
//             </form>
//           </div>
//         )}

//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Nom</th>
//               <th>Mot de passe</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map((admin) => (
//               <tr key={admin.id}>
//                 <td>{admin.username}</td>
//                 <td>
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
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;


// // src/pages/AdminPage/AdminPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

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
//     <div className="container mt-5">
//       <div className="text-center"> {/* Centrer le contenu */}
//         <h2 className="mb-4">Liste des Administrateurs</h2>

//         <button
//           className="btn btn-success mb-4"
//           onClick={() => setShowAddForm(!showAddForm)}
//         >
//           {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
//         </button>

//         {showAddForm && (
//           <div className="mb-4">
//             <h3>Ajouter un Administrateur</h3>
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
//               className="btn btn-primary"
//               onClick={handleRegisterAdmin}
//             >
//               Ajouter un Administrateur
//             </button>
//           </div>
//         )}

//         {editingAdmin && (
//           <div className="mb-4">
//             <h3>Modifier Administrateur</h3>
//             <form onSubmit={handleEditSubmit}>
//               <div className="mb-3">
//                 <label htmlFor="username" className="form-label">
//                   Nom d'utilisateur
//                 </label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="username"
//                   name="username"
//                   value={editingAdmin.username}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label htmlFor="password" className="form-label">
//                   Mot de passe
//                 </label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   id="password"
//                   name="password"
//                   value={editingAdmin.password || ""}
//                   onChange={handleEditChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="btn btn-primary">
//                 Enregistrer les modifications
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => setEditingAdmin(null)}
//               >
//                 Annuler
//               </button>
//             </form>
//           </div>
//         )}

//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>Nom</th>
//               <th>Mot de passe</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map((admin) => (
//               <tr key={admin.id}>
//                 <td>{admin.username}</td>
//                 <td>
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
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;


// src/pages/AdminPage/AdminPage.jsx CODE OK 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);  // État pour stocker les administrateurs
  const [editingAdmin, setEditingAdmin] = useState(null);  // État pour stocker l'administrateur en cours d'édition
  const [showAddForm, setShowAddForm] = useState(false);  // État pour afficher ou non le formulaire d'ajout d'administrateur
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });  // État pour les informations du nouvel administrateur
  const [message, setMessage] = useState('');  // État pour afficher un message de succès ou d'erreur

  // Fonction pour récupérer les administrateurs depuis le backend
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/getall');
      setAdmins(response.data);  // Mets à jour l'état avec les données récupérées
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
    }
  };

  // Utilisation du useEffect pour charger les administrateurs lors du montage du composant
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fonction pour gérer la suppression
  const handleDelete = async (id) => {
    try {
      // Suppression de l'administrateur via l'API
      await axios.delete(`http://localhost:3001/api/admin/delete/${id}`);
      // Rafraîchir la liste des administrateurs après suppression
      await fetchAdmins();
      setMessage("Administrateur supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
      setMessage("Erreur lors de la suppression de l'administrateur.");
    }
  };

  // Fonction pour afficher le formulaire d'édition
  const handleEditClick = (admin) => {
    setEditingAdmin({ ...admin });  // Définit l'administrateur en cours d'édition
  };

  // Fonction pour gérer la soumission du formulaire d'édition
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer les données du formulaire au backend pour mise à jour
      await axios.put(`http://localhost:3001/api/admin/update/${editingAdmin.id}`, editingAdmin);
      // Rafraîchir la liste des administrateurs après mise à jour
      await fetchAdmins();
      setEditingAdmin(null);  // Ferme le formulaire après la soumission
      setMessage("Administrateur mis à jour avec succès");
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'admin:', error);
      setMessage("Erreur lors de la mise à jour de l'administrateur.");
    }
  };

  // Fonction pour gérer les changements dans le formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAdmin({ ...editingAdmin, [name]: value });
  };

  // Fonction pour gérer l'ajout d'un nouvel administrateur
  const handleRegisterAdmin = async () => {
    try {
      // Requête POST vers le backend pour enregistrer un nouvel admin
      await axios.post('http://localhost:3001/api/admin/signup', newAdmin);
      // Rafraîchir la liste des administrateurs après ajout
      await fetchAdmins();
      // Réinitialise le formulaire après succès
      setNewAdmin({ username: '', password: '' });
      setShowAddForm(false);  // Masquer le formulaire d'ajout
      setMessage("Administrateur ajouté avec succès");
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'administrateur:', error);
      setMessage("Erreur lors de l'ajout de l'administrateur.");
    }
  };

  // Fonction pour gérer les changements dans le formulaire d'ajout
  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Administrateurs</h2>

      {/* Bouton "Rajouter un Administrateur" */}
      <button
        className="btn btn-success mb-4"
        onClick={() => setShowAddForm(!showAddForm)}  // Toggle l'affichage du formulaire d'ajout
      >
        {showAddForm ? "Annuler" : "Rajouter un Administrateur"}
      </button>

      {/* Formulaire d'ajout d'administrateur */}
      {showAddForm && (
        <div className="mb-4">
          <h3>Ajouter un Administrateur</h3>
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

          {/* Message de succès ou d'erreur */}
          {message && <div className="alert alert-info">{message}</div>}

          <button 
            className="btn btn-primary"
            onClick={handleRegisterAdmin}
          >
            Ajouter un Administrateur
          </button>
        </div>
      )}

      {/* Formulaire d'édition */}
      {editingAdmin && (
        <div className="mb-4">
          <h3>Modifier Administrateur</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
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
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={editingAdmin.password || ""}
                onChange={handleEditChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditingAdmin(null)}
            >
              Annuler
            </button>
          </form>
        </div>
      )}

      {/* Liste des administrateurs */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Mot de passe</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.username}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(admin)}
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
