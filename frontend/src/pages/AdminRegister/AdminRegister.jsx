
// // // src/pages/AdminRegister.js VERSION OK 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate

const AdminRegister = () => {
  // État pour stocker les informations du formulaire
  const [newAdmin, setNewAdmin] = useState({
    username: '',  // Champ username
    password: ''   // Champ password
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialiser useNavigate

  // Fonction pour gérer la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
  };

  // Fonction pour soumettre les modifications ou ajouter un nouvel administrateur
  const handleRegisterAdmin = async () => {
    try {
      // Requête POST vers le backend pour enregistrer un nouvel admin
      const response = await axios.post('http://localhost:3001/api/admin/signup', newAdmin);
      
      // Message de succès ou de retour de l'API
      setMessage(`Succès: ${response.data}`);
      
      // Réinitialise le formulaire après succès
      setNewAdmin({
        username: '',
        password: ''
      });

      // Rediriger vers la page /admin après succès
      navigate('/admin');
    } catch (error) {
      // Affiche un message d'erreur en cas de problème
      setMessage(`Erreur: ${error.response?.data || "Une erreur s'est produite."}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Ajouter un Administrateur</h2>

        <div className="form-group mb-3">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={newAdmin.username}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={newAdmin.password}
            onChange={handleInputChange}
          />
        </div>

        {/* Message de succès ou d'erreur */}
        {message && <div className="alert alert-info">{message}</div>}

        <button 
          className="btn btn-success w-100"
          onClick={handleRegisterAdmin}
        >
          Ajouter un Administrateur
        </button>
      </div>
    </div>
  );
};

export default AdminRegister;
