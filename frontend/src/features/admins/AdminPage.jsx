import { useState } from 'react';
import { useAdmins, useAddAdmin, useUpdateAdmin, useDeleteAdmin } from './api';
import { newAdminSchema } from './schema';

const MIN_PASSWORD_LENGTH = 8;

const AdminPage = () => {
  const { data: admins = [] } = useAdmins();
  // Le compte administrateur "principal" (id le plus bas) est protégé contre
  // la suppression côté backend ; on aligne l'affichage sur ce même critère
  // plutôt que sur l'ordre d'affichage (qui est trié par nom d'utilisateur).
  const firstAdminId = admins.length > 0 ? Math.min(...admins.map((a) => a.id)) : null;
  const addAdmin = useAddAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });
  const [message, setMessage] = useState('');

  const handleDelete = async (id) => {
    try {
      await deleteAdmin.mutateAsync(id);
      setMessage('Administrateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'admin:', error);
      setMessage(error.response?.data?.message || "Erreur lors de la suppression de l'administrateur.");
    }
  };

  const handleEditClick = (admin) => {
    setEditingAdmin({ ...admin });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Le mot de passe est optionnel en modification (vide = inchangé),
    // mais s'il est renseigné, il doit respecter la même politique de robustesse.
    if (editingAdmin.password && editingAdmin.password.length < MIN_PASSWORD_LENGTH) {
      setMessage(`Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`);
      return;
    }
    try {
      await updateAdmin.mutateAsync({ id: editingAdmin.id, ...editingAdmin });
      setEditingAdmin(null);
      setMessage('Administrateur mis à jour avec succès');
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
    const validation = newAdminSchema.safeParse(newAdmin);
    if (!validation.success) {
      setMessage(validation.error.issues[0].message);
      return;
    }
    try {
      await addAdmin.mutateAsync(newAdmin);
      setNewAdmin({ username: '', password: '', email: '' });
      setShowAddForm(false);
      setMessage('Administrateur ajouté avec succès');
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
    <div className="container mt-5 shadow rounded bg-white p-3">
      <h2 className="mb-4 mt-4 text-center fw-bold text-uppercase fs-2">Liste des Administrateurs</h2>

      <button
        className="btn btn-success mb-4 d-block mx-auto"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Annuler' : 'Rajouter un Administrateur'}
      </button>

      {showAddForm && (
        <div className="d-flex flex-column align-items-center w-100 p-3 shadow rounded bg-light text-center mb-4">
          <h3>Ajouter un Administrateur</h3>
          <form onSubmit={handleRegisterAdmin} className="d-flex flex-column align-items-center w-100">
            <div className="mb-3 w-100 d-flex flex-column align-items-center">
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

            <div className="mb-3 w-100 d-flex flex-column align-items-center">
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

            <div className="mb-3 w-100 d-flex flex-column align-items-center">
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

            <button type="submit" className="btn btn-primary w-100">
              Ajouter un Administrateur
            </button>
          </form>
        </div>
      )}

      {editingAdmin && (
        <div className="d-flex flex-column align-items-center w-100 p-3 shadow rounded bg-white mb-4">
          <h3>Modifier Administrateur</h3>
          <form onSubmit={handleEditSubmit} className="d-flex flex-column align-items-center w-100">
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
                placeholder="Laisser vide pour ne pas changer le mot de passe"
                onChange={handleEditChange}
              />
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-100 gap-2 mt-2">
              <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
              <button
                type="button"
                className="btn btn-secondary"
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
            <th className="text-center">Nom d'utilisateur</th>
            <th className="text-center">Email</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td className="text-center">{admin.username}</td>
              <td className="text-center">{admin.email}</td>
              <td className="text-center">
                <div className="d-flex justify-content-center gap-2">
                  <button type="button" className="btn btn-warning me-2" onClick={() => handleEditClick(admin)}>
                    Modifier
                  </button>
                  {admin.id !== firstAdminId &&
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(admin.id)}>
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
