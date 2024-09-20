// src/pages/ConnexionPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConnexionPage = () => {
  // État pour stocker les informations du formulaire
  const [admin, setAdmin] = useState({
    username: '',  // Champ nom d'utilisateur
    password: ''   // Champ mot de passe
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // Initialiser useNavigate

  // Fonction pour gérer la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value
    });
  };

  // Fonction pour soumettre les informations de connexion
  const handleLoginAdmin = async () => {
    try {
      // Requête POST vers le backend pour connecter l'administrateur
      const response = await axios.post('http://localhost:3001/api/admin/login', admin);
      
      // Message de succès ou de retour de l'API
      setMessage(`Connexion réussie: ${response.data}`);
      
      // Réinitialise le formulaire après succès
      setAdmin({
        username: '',
        password: ''
      });

      // Rediriger vers la page d'administration après succès
      navigate('/admin');
    } catch (error) {
      // Affiche un message d'erreur en cas de problème
      setMessage(`Erreur: ${error.response?.data || "Une erreur s'est produite."}`);
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

        {/* Message de succès ou d'erreur */}
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
