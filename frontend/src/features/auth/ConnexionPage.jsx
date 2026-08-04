import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLogin } from './api';

const ConnexionPage = () => {
  const [admin, setAdmin] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const login = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdmin({
      ...admin,
      [name]: value
    });
  };

  const handleLoginAdmin = async () => {
    try {
      const trimmedAdmin = {
        username: admin.username.trim(),
        password: admin.password.trim()
      };

      const response = await login.mutateAsync(trimmedAdmin);
      setMessage(`Connexion réussie: ${response.data.message}`);

      setAdmin({
        username: '',
        password: ''
      });

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setMessage(`Erreur: ${error.response?.data?.message || "Une erreur s'est produite."}`);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/students');
    }
  }, [isAuthenticated, navigate]);

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
