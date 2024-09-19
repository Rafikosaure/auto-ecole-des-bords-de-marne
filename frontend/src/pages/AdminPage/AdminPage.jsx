// src/pages/AdminPage/AdminPage.jsx VERSION OK TOUT FONCTIONNE 
import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Pour les requêtes HTTP
import { useNavigate } from 'react-router-dom';  // Importer useNavigate
import AddStudentForm from "../../components/StudentsAdmin/AddStudentForm";
import UpdateStudentForm from "../../components/StudentsAdmin/UpdateStudent";
const AdminPage = () => {
  const [admins, setAdmins] = useState([]);  // État pour stocker les administrateurs
  const [editingAdmin, setEditingAdmin] = useState(null);  // État pour stocker l'administrateur en cours d'édition
  const navigate = useNavigate();  // Initialisation de useNavigate

  // Récupérer les administrateurs depuis le backend au chargement de la page
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/getall');  // Appelle l'API
        setAdmins(response.data);  // Mets à jour l'état avec les données récupérées
      } catch (error) {
        console.error('Erreur lors de la récupération des administrateurs:', error);
      }
    };
    fetchAdmins();
  }, []);

  // Fonction pour gérer la suppression
  const handleDelete = async (id) => {
    try {
      // Suppression de l'administrateur via l'API
      await axios.delete(`http://localhost:3001/api/admin/delete/${id}`);
      // Mise à jour de la liste localement après suppression
      setAdmins(admins.filter(admin => admin.id !== id));
      console.log('Admin supprimé avec succès:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
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
      setAdmins(admins.map(admin => (admin.id === editingAdmin.id ? editingAdmin : admin)));
      setEditingAdmin(null);  // Ferme le formulaire après la soumission
      console.log('Admin mis à jour avec succès:', editingAdmin.id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'admin:', error);
    }
  };

  // Fonction pour gérer les changements dans le formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingAdmin({ ...editingAdmin, [name]: value });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Liste des Administrateurs</h2>

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

      {/* Bouton "Rajouter un Administrateur" */}
      <button
        className="btn btn-success mb-4"
        onClick={() => navigate("/adminregister")} // Utilisation de navigate pour rediriger
      >
        Rajouter un Administrateur
      </button>

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
      <AddStudentForm />
      <UpdateStudentForm />
    </div>
  );
};

export default AdminPage;

