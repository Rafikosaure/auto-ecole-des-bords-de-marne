import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import SearchForm from '../../components/SearchForm/SearchForm';
import { formatPhoneDisplay, normalizePhone } from '../../utils/phoneUtils';

const InstructorsPage = () => {
    const [instructors, setInstructors] = useState([]);
    const [filteredInstructors, setFilteredInstructors] = useState([]);  // État pour les instructeurs filtrés
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        adress: '',
        speciality: []
    });
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);  // État pour l'indicateur de chargement
    const [isSearchActive, setIsSearchActive] = useState(false);  // État pour la recherche active
    const navigate = useNavigate();  // Pour la redirection



    // Fonction pour récupérer les instructeurs avec gestion d'erreur d'authentification
    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/instructor/get-all');
            setInstructors(response.data);
            setFilteredInstructors(response.data);  // Initialiser les instructeurs filtrés avec toutes les données
        } catch (error) {
            console.error("Erreur lors de la récupération des instructeurs:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/connexion');  // Rediriger vers la page de connexion si non authentifié ou accès refusé
            } else {
                setErrorMessage('Erreur lors de la récupération des instructeurs');
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInstructors();
    }, []);  // Gérer la navigation en cas d'erreur d'authentification


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedSpeciality = formData.speciality.join(',');
        const dataToSubmit = { ...formData, speciality: formattedSpeciality, phoneNumber: normalizePhone(formData.phoneNumber) };

        try {
            if (editingInstructor) {
                await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
                setSuccessMessage('Un instructeur a bien été modifié');
            } else {
                await apiClient.post('/instructor/add', dataToSubmit);
                setSuccessMessage('Un instructeur a bien été ajouté');
            }
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchInstructors();
            setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
            setEditingInstructor(null);
            setShowForm(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/connexion');  // Rediriger si non autorisé lors de l'ajout ou de la modification
            } else {
                setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
            }
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'speciality') {
            let updatedSpeciality = [...formData.speciality];
            if (checked) {
                if (!updatedSpeciality.includes(value)) {
                    updatedSpeciality.push(value);
                }
            } else {
                updatedSpeciality = updatedSpeciality.filter(item => item !== value);
            }
            setFormData({ ...formData, speciality: updatedSpeciality });
        } else if (name === 'phoneNumber') {
            setFormData({ ...formData, phoneNumber: formatPhoneDisplay(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
        try {
            await apiClient.delete(`/instructor/delete/${id}`);
            setSuccessMessage('Un instructeur a bien été supprimé');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchInstructors();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'instructeur:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/connexion');  // Rediriger si l'utilisateur n'est pas autorisé à supprimer
            } else {
                setErrorMessage('Erreur lors de la suppression de l\'instructeur');
            }
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleEdit = (instructor) => {
        setEditingInstructor(instructor);
        setFormData({
            lastName: instructor.lastName,
            firstName: instructor.firstName,
            email: instructor.email,
            phoneNumber: formatPhoneDisplay(instructor.phoneNumber),
            adress: instructor.adress,
            speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
        });
        setShowForm(true);
    };

    // Fonction pour gérer la recherche
    const handleSearch = (searchTerm) => {
        if (!searchTerm) {
            setFilteredInstructors(instructors);
            setIsSearchActive(false);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = instructors.filter(instructor =>
            instructor.lastName.toLowerCase().startsWith(lowercasedTerm) ||
            instructor.firstName.toLowerCase().startsWith(lowercasedTerm)
        );
        setFilteredInstructors(filtered.length > 0 ? filtered : instructors);
        setIsSearchActive(filtered.length > 0);
    };

    // Fonction pour recharger la page
    const reloadPage = () => {
        window.location.reload();
    };

    // Fonction pour gérer le clic sur un instructeur et rediriger vers la page de profil
    const handleInstructorClick = (id) => {
        navigate(`/instructor/${id}`);  // Redirection vers la page du profil avec l'ID de l'instructeur
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-3">Liste des Moniteurs</h1>
            
            {/* Intégration du composant SearchForm */}
            <SearchForm
                onSearch={handleSearch}
            />

            <div className="text-center mt-4 mb-3">
                <button
                    className="btn btn-success"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Annuler' : 'Ajouter Instructeur'}
                </button>
            </div>

            {/* Formulaire d'ajout d'instructeur affiché juste après le bouton "Ajouter Instructeur" */}
            {showForm && !editingInstructor && (
                <div className="card mb-5">
                    <div className="card-header">Ajouter le moniteur</div>
                    
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Nom de famille</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        placeholder="Ex : Dupont"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        placeholder="Ex : Jean"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Adresse e-mail</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="jean.dupont@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Numéro de téléphone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder="Ex : 06 12 34 56 78"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Adresse</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="adress"
                                        placeholder="Ex : 1 rue de la Paix, Paris"
                                        value={formData.adress}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="mb-3">
                                        <label>Spécialités:</label>
                                        <div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="Auto"
                                                    id="flexCheckAuto"
                                                    name="speciality"
                                                    checked={formData.speciality.includes('Auto')}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="flexCheckAuto">
                                                    Auto
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="Moto"
                                                    id="flexCheckMoto"
                                                    name="speciality"
                                                    checked={formData.speciality.includes('Moto')}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="flexCheckMoto">
                                                    Moto
                                                </label>
                                            </div>
                                            {/* Ajoutez d'autres spécialités ici si nécessaire */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center gap-2 mt-3">
                                <button type="submit" className="btn btn-success">
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger ms-2"
                                    onClick={() => setShowForm(false)}
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

            {successMessage && (
                <div className={`alert alert-success`}>
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            {/* Liste des instructeurs affichée */}
            <div className='d-flex flex-column-reverse'>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Adresse</th>
                            <th>Spécialités</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInstructors.map((instructor) => (
                            <React.Fragment key={instructor.id}>
                                {editingInstructor && editingInstructor.id === instructor.id && showForm && (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="card mb-5">
                                                <div className="card-header">
                                                    Modifier le Moniteur
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="row">
                                                            {/* Formulaire d'édition */}
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Nom de famille</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="lastName"
                                                                    placeholder="Ex : Dupont"
                                                                    value={formData.lastName}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Prénom</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="firstName"
                                                                    placeholder="Ex : Jean"
                                                                    value={formData.firstName}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Adresse e-mail</label>
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    name="email"
                                                                    placeholder="jean.dupont@email.com"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Numéro de téléphone</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="phoneNumber"
                                                                    placeholder="Ex : 06 12 34 56 78"
                                                                    value={formData.phoneNumber}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <label className="form-label">Adresse</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="adress"
                                                                    placeholder="Ex : 1 rue de la Paix, Paris"
                                                                    value={formData.adress}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <div className="mb-3">
                                                                    <label>Spécialités:</label>
                                                                    <div>
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                value="Auto"
                                                                                id={`flexCheckAuto-${instructor.id}`}
                                                                                name="speciality"
                                                                                checked={formData.speciality.includes('Auto')}
                                                                                onChange={handleChange}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`flexCheckAuto-${instructor.id}`}>
                                                                                Auto
                                                                            </label>
                                                                        </div>
                                                                        <div className="form-check">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                value="Moto"
                                                                                id={`flexCheckMoto-${instructor.id}`}
                                                                                name="speciality"
                                                                                checked={formData.speciality.includes('Moto')}
                                                                                onChange={handleChange}
                                                                            />
                                                                            <label className="form-check-label" htmlFor={`flexCheckMoto-${instructor.id}`}>
                                                                                Moto
                                                                            </label>
                                                                        </div>
                                                                        {/* Ajoutez d'autres spécialités ici si nécessaire */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center gap-2 mt-3">
                                                            <button type="submit" className="btn btn-success">
                                                                Modifier
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger ms-2"
                                                                onClick={() => {
                                                                    setShowForm(false);
                                                                    setEditingInstructor(null);
                                                                    setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
                                                                }}
                                                            >
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    {/* Instructeurs listés */}
                                    <td onClick={() => handleInstructorClick(instructor.id)} style={{ cursor: 'pointer' }}>
                                        {instructor.lastName}
                                    </td>
                                    <td>{instructor.firstName}</td>
                                    <td>{instructor.email}</td>
                                    <td>{formatPhoneDisplay(instructor.phoneNumber)}</td>
                                    <td>{instructor.adress}</td>
                                    <td>{instructor.speciality}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEdit(instructor)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleDelete(instructor.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InstructorsPage;