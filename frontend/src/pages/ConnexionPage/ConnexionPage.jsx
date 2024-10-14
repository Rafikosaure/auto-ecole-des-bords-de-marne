import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';

const ConnexionPage = () => {
  const [admin, setAdmin] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value
    });
  };

  const handleLoginAdmin = async () => {
    try {
      // Conserve les espaces, mais utilise trim pour retirer les espaces en début et fin
      const trimmedAdmin = {
        username: admin.username.trim(), // Supprime uniquement les espaces en début et fin
        password: admin.password.trim()   // Supprime uniquement les espaces en début et fin
      };

      console.log("Objet de la requête :", trimmedAdmin)
      const response = await apiClient.post('/admin/login', {
        username: trimmedAdmin.username,
        password: trimmedAdmin.password,
        headers: {
          'Content-Type': 'application/json' // Ajout de l'en-tête pour le type de contenu
        }
      });
      console.log('notre réponse :', response);
      setMessage(`Connexion réussie: ${response.data}`);
      
      setAdmin({
        username: '',
        password: ''
      });

      navigate('/students');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error); // Affiche l'erreur complète dans la console
      setMessage(`Erreur: ${error.response?.data.message || "Une erreur s'est produite."}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Connexion Administrateur</h2>

        <div className="form-group mb-3">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={admin.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={admin.password}
            onChange={handleInputChange}
          />
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <button 
          className="btn btn-primary w-100"
          onClick={handleLoginAdmin}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
};

export default ConnexionPage;



// // //src/pages/ConnexionPage.jsx connexion  TEST Ajout de l'en-tête Content-Type à la requête POST. 
// // la connexion ne se fait pas 
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   const [admin, setAdmin] = useState({
//     username: '',
//     password: ''
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   const handleLoginAdmin = async () => {
//     try {
//       // Conserve les espaces, mais utilise trim pour retirer les espaces en début et fin
//       const trimmedAdmin = {
//         username: admin.username.trim(), // Supprime uniquement les espaces en début et fin
//         password: admin.password.trim()   // Supprime uniquement les espaces en début et fin
//       };

//       const response = await axios.post('http://localhost:3001/api/admin/login', trimmedAdmin, {
//         headers: {
//           'Content-Type': 'application/json' // Ajout de l'en-tête pour le type de contenu
//         }
//       });

//       setMessage(`Connexion réussie: ${response.data}`);
      
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       navigate('/admin');
//     } catch (error) {
//       console.error('Erreur lors de la connexion :', error); // Affiche l'erreur complète dans la console
//       setMessage(`Erreur: ${error.response?.data.message || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;


// //src/pages/ConnexionPage.jsx connexion OK   suppression des espaces 
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   const [admin, setAdmin] = useState({
//     username: '',
//     password: ''
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   const handleLoginAdmin = async () => {
//     try {
//       // Conserve les espaces, mais utilise trim pour retirer les espaces en début et fin
//       const trimmedAdmin = {
//         username: admin.username.trim(), // Supprime uniquement les espaces en début et fin
//         password: admin.password.trim()   // Supprime uniquement les espaces en début et fin
//       };

//       const response = await axios.post('http://localhost:3001/api/admin/login', trimmedAdmin);
//       setMessage(`Connexion réussie: ${response.data}`);
      
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       navigate('/admin');
//     } catch (error) {
//       setMessage(`Erreur: ${error.response?.data.message || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;


// // src/pages/ConnexionPage.jsx connexion message erreur fonctionne sauf pourt les espaces 

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   // État pour stocker les informations du formulaire
//   const [admin, setAdmin] = useState({
//     username: '',  // Champ nom d'utilisateur
//     password: ''   // Champ mot de passe
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // Initialiser useNavigate

//   // Fonction pour gérer la modification des champs du formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   // Fonction pour soumettre les informations de connexion
//   const handleLoginAdmin = async () => {
//     try {
//       // Requête POST vers le backend pour connecter l'administrateur
//       const response = await axios.post('http://localhost:3001/api/admin/login', admin);
      
//       // Message de succès ou de retour de l'API
//       setMessage(`Connexion réussie: ${response.data}`);
      
//       // Réinitialise le formulaire après succès
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       // Rediriger vers la page d'administration après succès
//       navigate('/admin');
//     } catch (error) {
//       // Affiche un message d'erreur en cas de problème
//       setMessage(`Erreur: ${error.response?.data.message || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/* Message de succès ou d'erreur */}
//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;


// // src/pages/ConnexionPage.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   // État pour stocker les informations du formulaire
//   const [admin, setAdmin] = useState({
//     username: '',  // Champ nom d'utilisateur
//     password: ''   // Champ mot de passe
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // Initialiser useNavigate

//   // Fonction pour gérer la modification des champs du formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   // Fonction pour vérifier si l'administrateur existe
//   const checkAdminExists = async (username) => {
//     try {
//       const response = await axios.get(`http://localhost:3001/api/admin/check-username/${username}`);
//       return response.data.exists; // Assurez-vous que votre API renvoie un champ 'exists' pour vérifier si l'administrateur existe
//     } catch (error) {
//       console.error('Erreur lors de la vérification de l\'administrateur:', error);
//       return false; // Retourne false en cas d'erreur
//     }
//   };

//   // Fonction pour soumettre les informations de connexion
//   const handleLoginAdmin = async () => {
//     const adminExists = await checkAdminExists(admin.username);
//     if (!adminExists) {
//       setMessage("Nom d'utilisateur ou mot de passe incorrect.");
//       return;
//     }

//     try {
//       // Requête POST vers le backend pour connecter l'administrateur
//       const response = await axios.post('http://localhost:3001/api/admin/login', admin);
      
//       // Message de succès ou de retour de l'API
//       setMessage(`Connexion réussie: ${response.data}`);
      
//       // Réinitialise le formulaire après succès
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       // Rediriger vers la page d'administration après succès
//       navigate('/admin');
//     } catch (error) {
//       // Affiche un message d'erreur en cas de problème
//       setMessage(`Erreur: ${error.response?.data || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/* Message de succès ou d'erreur */}
//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;


// // src/pages/ConnexionPage.jsx

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   // État pour stocker les informations du formulaire
//   const [admin, setAdmin] = useState({
//     username: '',  // Champ nom d'utilisateur
//     password: ''   // Champ mot de passe
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // Initialiser useNavigate

//   // Fonction pour gérer la modification des champs du formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   // Fonction pour soumettre les informations de connexion
//   const handleLoginAdmin = async () => {
//     try {
//       // Requête POST vers le backend pour connecter l'administrateur
//       const response = await axios.post('http://localhost:3001/api/admin/login', admin);
      
//       // Message de succès ou de retour de l'API
//       setMessage(`Connexion réussie: ${response.data}`);
      
//       // Réinitialise le formulaire après succès
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       // Rediriger vers la page d'administration après succès
//       navigate('/admin');
//     } catch (error) {
//       // Affiche un message d'erreur en cas de problème
//       setMessage(`Erreur: ${error.response?.data || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/* Message de succès ou d'erreur */}
//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const ConnexionPage = () => {
//   // État pour stocker les informations du formulaire
//   const [admin, setAdmin] = useState({
//     username: '',  // Champ nom d'utilisateur
//     password: ''   // Champ mot de passe
//   });

//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // Initialiser useNavigate

//   // Fonction pour gérer la modification des champs du formulaire
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdmin({
//       ...admin,
//       [name]: value
//     });
//   };

//   // Fonction pour soumettre les informations de connexion
//   const handleLoginAdmin = async () => {
//     try {
//       // Requête POST vers le backend pour connecter l'administrateur
//       const response = await axios.post('http://localhost:3001/api/admin/login', admin);
      
//       // Message de succès ou de retour de l'API
//       setMessage(`Connexion réussie: ${response.data}`);
      
//       // Réinitialise le formulaire après succès
//       setAdmin({
//         username: '',
//         password: ''
//       });

//       // Rediriger vers la page d'administration après succès
//       navigate('/admin');
//     } catch (error) {
//       // Affiche un message d'erreur en cas de problème
//       setMessage(`Erreur: ${error.response?.data.message || "Une erreur s'est produite."}`);
//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//       <div className="card p-5" style={{ width: '400px' }}>
//         <h2 className="text-center mb-4">Connexion Administrateur</h2>

//         <div className="form-group mb-3">
//           <label>Nom d'utilisateur</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={admin.username}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Mot de passe</label>
//           <input
//             type="password"
//             className="form-control"
//             name="password"
//             value={admin.password}
//             onChange={handleInputChange}
//           />
//         </div>

//         {/* Message de succès ou d'erreur */}
//         {message && <div className="alert alert-info">{message}</div>}

//         <button 
//           className="btn btn-primary w-100"
//           onClick={handleLoginAdmin}
//         >
//           Se connecter
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ConnexionPage;
