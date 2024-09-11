// src/pages/AdminRegister.js
import React, { useState } from 'react';

const AdminRegister = () => {
  // État pour stocker les informations du formulaire
  const [newAdmin, setNewAdmin] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    address: ''
  });

  // Fonction pour gérer la modification des champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value
    });
  };

  // Fonction pour soumettre les modifications ou ajouter un nouvel administrateur
  const handleRegisterAdmin = () => {
    console.log('Nouvel administrateur à ajouter:', newAdmin);
    // Implémente ici la logique pour ajouter un nouvel administrateur
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-5" style={{ width: '500px' }}>
        <h2 className="text-center mb-4">Rajouter un Administrateur</h2>
        
        <div className="form-group mb-3">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={newAdmin.lastName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Prénom</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={newAdmin.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={newAdmin.email}
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

        <div className="form-group mb-3">
          <label>Adresse</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={newAdmin.address}
            onChange={handleInputChange}
          />
        </div>

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
