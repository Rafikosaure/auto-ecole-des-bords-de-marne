import { useState, useEffect } from 'react';
import './AdminPage.css';
import apiClient from '../../api/api-client';

const AdminPage = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');

  const fetchAdmins = async () => {
    try {
      const response = await apiClient.get('/admin/getall');
      setAdmins(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
      setMessage('Erreur lors de la récupération des administrateurs.');
    }
  };

  useEffect(() => {
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
      setNewAdmin({ username: '', password: '', email: '' });
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
      <h2 className="mb-4 text-center titles-style" style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Liste des Administrateurs</h2>

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
              type="submit"
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
            <th className="text-center">Nom</th>
            <th className="text-center">Email</th>
            <th className="actions-header text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id}>
              <td className="admin-name text-center">{admin.username}</td>
              <td className="admin-email text-center">{admin.email}</td>
              <td className="text-center actions">
                <div className="action-buttons">
                  <button type="button" className="btn btn-warning admin-action-button me-2" onClick={() => handleEditClick(admin)}>
                    Modifier
                  </button>
                  {index !== 0 &&
                    <button type="button" className="btn btn-danger admin-action-button" onClick={() => handleDelete(admin.id)}>
                      Supprimer
                    </button>
                  }
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