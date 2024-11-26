

// //src/pages/InstructorsPage/InstructorPage.jsx  OK LE BON BUG CORRIGE
// avec daqns le filtre le nom et le prenom 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Pour gérer la navigation
import '../../pages/InstructorsPage/InstructorPage.css';
import apiClient from '../../api/api-client';
import SearchForm from '../../components/SearchForm/SearchForm';  // Ajustez le chemin d'importation si nécessaire

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
            const response = await apiClient.get('/instructor/getall');
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
        const dataToSubmit = { ...formData, speciality: formattedSpeciality };

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
            phoneNumber: instructor.phoneNumber,
            adress: instructor.adress,
            speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
        });
        setShowForm(true);
    };

    // Fonction pour gérer la recherche
    const handleSearch = (searchTerm, type) => {
        if (searchTerm === "") {
            setFilteredInstructors(instructors);
            setIsSearchActive(false);
            return;
        }

        if (type === 'Instructeur') {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = instructors.filter(instructor => 
                instructor.lastName.toLowerCase().includes(lowercasedTerm) ||
                instructor.firstName.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredInstructors(filtered);
            setIsSearchActive(true);
        } else {
            // Si la recherche concerne un étudiant ou une recherche générale, ne pas filtrer les instructeurs
            setFilteredInstructors(instructors);
            setIsSearchActive(false);
        }
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
            <h1 className="text-center-title">Liste des Moniteurs</h1>
            
            {/* Intégration du composant SearchForm */}
            <SearchForm 
                onSearch={handleSearch} 
                instructors={instructors} 
                students={[]} 
                isSearchActive={isSearchActive}
                reloadPage={reloadPage}
            />

            <div className="add-instructor-container">
                <button
                    className="btn btn-success mb-3 btn-add-instructor"
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        placeholder="Nom"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        placeholder="Prénom"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder="Téléphone"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="adress"
                                        placeholder="Adresse"
                                        value={formData.adress}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
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
                            <div className="btn-group-center mt-3">
                                <button type="submit" className="btn btn-success btn-action">
                                    Ajouter
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-action ml-2"
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
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="lastName"
                                                                    placeholder="Nom"
                                                                    value={formData.lastName}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="firstName"
                                                                    placeholder="Prénom"
                                                                    value={formData.firstName}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input
                                                                    type="email"
                                                                    className="form-control"
                                                                    name="email"
                                                                    placeholder="Email"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="phoneNumber"
                                                                    placeholder="Téléphone"
                                                                    value={formData.phoneNumber}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="adress"
                                                                    placeholder="Adresse"
                                                                    value={formData.adress}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div className="col-md-6 mb-3">
                                                                <div className="form-group">
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
                                                        <div className="btn-group-center mt-3">
                                                            <button type="submit" className="btn btn-success btn-action">
                                                                Modifier
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-action ml-2"
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
                                    <td>{instructor.phoneNumber}</td>
                                    <td>{instructor.adress}</td>
                                    <td>{instructor.speciality}</td>
                                    <td>
                                        <button
                                            className="btn btn-modifier"
                                            onClick={() => handleEdit(instructor)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-danger ml-2"
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




// //src/pages/InstructorsPage/InstructorPage.jsx  TEST ligne tableau clicable et redirection vers page instructorPageprofil.jsx
// page ajout instructeur s'affiche en bas et lorsque je choisis un moniteur pb quand meme nom de famille 
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';  // Pour gérer la navigation
// import '../../pages/InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';
// import SearchForm from '../../components/SearchForm/SearchForm';  // Ajustez le chemin d'importation si nécessaire

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [filteredInstructors, setFilteredInstructors] = useState([]);  // État pour les instructeurs filtrés
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: []
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false);  // État pour l'indicateur de chargement
//     const [isSearchActive, setIsSearchActive] = useState(false);  // État pour la recherche active
//     const navigate = useNavigate();  // Pour la redirection

//     useEffect(() => {
//         fetchInstructors();
//     }, []);  // Gérer la navigation en cas d'erreur d'authentification

//     // Fonction pour récupérer les instructeurs avec gestion d'erreur d'authentification
//     const fetchInstructors = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//             setFilteredInstructors(response.data);  // Initialiser les instructeurs filtrés avec toutes les données
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger vers la page de connexion si non authentifié ou accès refusé
//             } else {
//                 setErrorMessage('Erreur lors de la récupération des instructeurs');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedSpeciality = formData.speciality.join(',');
//         const dataToSubmit = { ...formData, speciality: formattedSpeciality };

//         try {
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setEditingInstructor(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger si non autorisé lors de l'ajout ou de la modification
//             } else {
//                 setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === 'speciality') {
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) {
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({ ...formData, speciality: updatedSpeciality });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
//         try {
//             await apiClient.delete(`/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger si l'utilisateur n'est pas autorisé à supprimer
//             } else {
//                 setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
//         });
//         setShowForm(true);
//     };

//     // Fonction pour gérer la recherche
//     const handleSearch = (searchTerm, type) => {
//         if (searchTerm === "") {
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//             return;
//         }

//         if (type === 'Instructeur') {
//             const lowercasedTerm = searchTerm.toLowerCase();
//             const filtered = instructors.filter(instructor => 
//                 instructor.lastName.toLowerCase().includes(lowercasedTerm) ||
//                 instructor.firstName.toLowerCase().includes(lowercasedTerm)
//             );
//             setFilteredInstructors(filtered);
//             setIsSearchActive(true);
//         } else {
//             // Si la recherche concerne un étudiant ou une recherche générale, ne pas filtrer les instructeurs
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//         }
//     };

//     // Fonction pour recharger la page
//     const reloadPage = () => {
//         window.location.reload();
//     };

//     // Fonction pour gérer le clic sur un instructeur et rediriger vers la page de profil
//     const handleInstructorClick = (id) => {
//         navigate(`/instructor/${id}`);  // Redirection vers la page du profil avec l'ID de l'instructeur
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Moniteurs</h1>
            
//             {/* Intégration du composant SearchForm */}
//             <SearchForm 
//                 onSearch={handleSearch} 
//                 instructors={instructors} 
//                 students={[]} 
//                 isSearchActive={isSearchActive}
//                 reloadPage={reloadPage}
//             />

//             <div className="add-instructor-container">
//                 <button
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage}
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
//             <div className='d-flex flex-column-reverse'>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Nom</th>
//                             <th>Prénom</th>
//                             <th>Email</th>
//                             <th>Téléphone</th>
//                             <th>Adresse</th>
//                             <th>Spécialités</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInstructors.map((instructor) => (
//                             <React.Fragment key={instructor.id}>
//                                 {editingInstructor && editingInstructor.id === instructor.id && showForm && (
//                                     <tr>
//                                         <td colSpan="7">
//                                             <div className="card mb-5">
//                                                 <div className="card-header">
//                                                     Modifier le Moniteur
//                                                 </div>
//                                                 <div className="card-body">
//                                                     <form onSubmit={handleSubmit}>
//                                                         <div className="row">
//                                                             {/* Formulaire d'édition */}
//                                                             <div className="col-md-6 mb-3">
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control"
//                                                                     name="lastName"
//                                                                     placeholder="Nom"
//                                                                     value={formData.lastName}
//                                                                     onChange={handleChange}
//                                                                     required
//                                                                 />
//                                                             </div>
//                                                             <div className="col-md-6 mb-3">
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control"
//                                                                     name="firstName"
//                                                                     placeholder="Prénom"
//                                                                     value={formData.firstName}
//                                                                     onChange={handleChange}
//                                                                     required
//                                                                 />
//                                                             </div>
//                                                             <div className="col-md-6 mb-3">
//                                                                 <input
//                                                                     type="email"
//                                                                     className="form-control"
//                                                                     name="email"
//                                                                     placeholder="Email"
//                                                                     value={formData.email}
//                                                                     onChange={handleChange}
//                                                                     required
//                                                                 />
//                                                             </div>
//                                                             <div className="col-md-6 mb-3">
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control"
//                                                                     name="phoneNumber"
//                                                                     placeholder="Téléphone"
//                                                                     value={formData.phoneNumber}
//                                                                     onChange={handleChange}
//                                                                 />
//                                                             </div>
//                                                             <div className="col-md-6 mb-3">
//                                                                 <input
//                                                                     type="text"
//                                                                     className="form-control"
//                                                                     name="adress"
//                                                                     placeholder="Adresse"
//                                                                     value={formData.adress}
//                                                                     onChange={handleChange}
//                                                                 />
//                                                             </div>
//                                                             <div className="col-md-6 mb-3">
//                                                                 <div className="form-group">
//                                                                     <label>Spécialités:</label>
//                                                                     <div>
//                                                                         <div className="form-check">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="checkbox"
//                                                                                 value="Auto"
//                                                                                 id={`flexCheckAuto-${instructor.id}`}
//                                                                                 name="speciality"
//                                                                                 checked={formData.speciality.includes('Auto')}
//                                                                                 onChange={handleChange}
//                                                                             />
//                                                                             <label className="form-check-label" htmlFor={`flexCheckAuto-${instructor.id}`}>
//                                                                                 Auto
//                                                                             </label>
//                                                                         </div>
//                                                                         <div className="form-check">
//                                                                             <input
//                                                                                 className="form-check-input"
//                                                                                 type="checkbox"
//                                                                                 value="Moto"
//                                                                                 id={`flexCheckMoto-${instructor.id}`}
//                                                                                 name="speciality"
//                                                                                 checked={formData.speciality.includes('Moto')}
//                                                                                 onChange={handleChange}
//                                                                             />
//                                                                             <label className="form-check-label" htmlFor={`flexCheckMoto-${instructor.id}`}>
//                                                                                 Moto
//                                                                             </label>
//                                                                         </div>
//                                                                         {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                         <div className="btn-group-center mt-3">
//                                                             <button type="submit" className="btn btn-success btn-action">
//                                                                 Modifier
//                                                             </button>
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-danger btn-action ml-2"
//                                                                 onClick={() => {
//                                                                     setShowForm(false);
//                                                                     setEditingInstructor(null);
//                                                                     setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//                                                                 }}
//                                                             >
//                                                                 Annuler
//                                                             </button>
//                                                         </div>
//                                                     </form>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                                 <tr>
//                                     {/* Instructeurs listés */}
//                                     <td onClick={() => handleInstructorClick(instructor.id)} style={{ cursor: 'pointer' }}>
//                                         {instructor.lastName}
//                                     </td>
//                                     <td>{instructor.firstName}</td>
//                                     <td>{instructor.email}</td>
//                                     <td>{instructor.phoneNumber}</td>
//                                     <td>{instructor.adress}</td>
//                                     <td>{instructor.speciality}</td>
//                                     <td>
//                                         <button
//                                             className="btn btn-modifier"
//                                             onClick={() => handleEdit(instructor)}
//                                         >
//                                             Modifier
//                                         </button>
//                                         <button
//                                             className="btn btn-danger ml-2"
//                                             onClick={() => handleDelete(instructor.id)}
//                                         >
//                                             Supprimer
//                                         </button>
//                                     </td>
//                                 </tr>
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {showForm && !editingInstructor && (
//                 <div className="card mb-5">
//                     <div className="card-header">Ajouter le moniteur</div>
                    
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
//                             {/* Réutilisation du même formulaire ici */}
//                             <div className="row">
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="lastName"
//                                         placeholder="Nom"
//                                         value={formData.lastName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="firstName"
//                                         placeholder="Prénom"
//                                         value={formData.firstName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         name="email"
//                                         placeholder="Email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="phoneNumber"
//                                         placeholder="Téléphone"
//                                         value={formData.phoneNumber}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="adress"
//                                         placeholder="Adresse"
//                                         value={formData.adress}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <div className="form-group">
//                                         <label>Spécialités:</label>
//                                         <div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Auto"
//                                                     id="flexCheckAuto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Auto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckAuto">
//                                                     Auto
//                                                 </label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Moto"
//                                                     id="flexCheckMoto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Moto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckMoto">
//                                                     Moto
//                                                 </label>
//                                             </div>
//                                             {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="btn-group-center mt-3">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     Ajouter
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-danger btn-action ml-2"
//                                     onClick={() => setShowForm(false)}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstructorsPage;




// //src/pages/InstructorsPage/InstructorPage.jsx  TEST ligne tableau clicable et redirection vers page instructorPageprofil.jsx
//le boutton modifier et ajouterne marche pas 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';  // Pour gérer la navigation
// import '../../pages/InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';
// import SearchForm from '../../components/SearchForm/SearchForm';  // Ajustez le chemin d'importation si nécessaire

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [filteredInstructors, setFilteredInstructors] = useState([]);  // État pour les instructeurs filtrés
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: []
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false);  // État pour l'indicateur de chargement
//     const [isSearchActive, setIsSearchActive] = useState(false);  // État pour la recherche active
//     const navigate = useNavigate();  // Pour la redirection

//     useEffect(() => {
//         fetchInstructors();
//     }, []);  // Gérer la navigation en cas d'erreur d'authentification

//     // Fonction pour récupérer les instructeurs avec gestion d'erreur d'authentification
//     const fetchInstructors = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//             setFilteredInstructors(response.data);  // Initialiser les instructeurs filtrés avec toutes les données
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger vers la page de connexion si non authentifié ou accès refusé
//             } else {
//                 setErrorMessage('Erreur lors de la récupération des instructeurs');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Fonction pour gérer le clic sur un instructeur et rediriger vers la page de profil
//     const handleInstructorClick = (id) => {
//         navigate(`/instructor/${id}`);  // Redirection vers la page du profil avec l'ID de l'instructeur
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedSpeciality = formData.speciality.join(',');
//         const dataToSubmit = { ...formData, speciality: formattedSpeciality };

//         try {
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setEditingInstructor(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger si non autorisé lors de l'ajout ou de la modification
//             } else {
//                 setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === 'speciality') {
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) {
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({ ...formData, speciality: updatedSpeciality });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
//         try {
//             await apiClient.delete(`/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  // Rediriger si l'utilisateur n'est pas autorisé à supprimer
//             } else {
//                 setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
//         });
//         setShowForm(true);
//     };

//     const handleSearch = (searchTerm, type) => {
//         if (searchTerm === "") {
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//             return;
//         }

//         if (type === 'Instructeur') {
//             const lowercasedTerm = searchTerm.toLowerCase();
//             const filtered = instructors.filter(instructor => 
//                 instructor.lastName.toLowerCase().includes(lowercasedTerm) ||
//                 instructor.firstName.toLowerCase().includes(lowercasedTerm)
//             );
//             setFilteredInstructors(filtered);
//             setIsSearchActive(true);
//         } else {
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//         }
//     };

//     const reloadPage = () => {
//         window.location.reload();
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Moniteurs</h1>
            
//             <SearchForm 
//                 onSearch={handleSearch} 
//                 instructors={instructors} 
//                 students={[]} 
//                 isSearchActive={isSearchActive}
//                 reloadPage={reloadPage}
//             />

//             <div className="add-instructor-container">
//                 <button
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage}
//                 </div>
//             )}

//             <div className='d-flex flex-column-reverse'>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Nom</th>
//                             <th>Prénom</th>
//                             <th>Email</th>
//                             <th>Téléphone</th>
//                             <th>Adresse</th>
//                             <th>Spécialités</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInstructors.map((instructor) => (
//                             <tr key={instructor.id} onClick={() => handleInstructorClick(instructor.id)} style={{ cursor: 'pointer' }}>
//                                 <td>{instructor.lastName}</td>
//                                 <td>{instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     <button
//                                         className="btn btn-modifier"
//                                         onClick={(e) => {
//                                             e.stopPropagation();  // Empêche la navigation lors de la modification
//                                             handleEdit(instructor);
//                                         }}
//                                     >
//                                         Modifier
//                                     </button>
//                                     <button
//                                         className="btn btn-danger ml-2"
//                                         onClick={(e) => {
//                                             e.stopPropagation();  // Empêche la navigation lors de la suppression
//                                             handleDelete(instructor.id);
//                                         }}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>

//                 {showForm && !editingInstructor && (
//                     <div className="card mb-5">
//                         <div className="card-header">Ajouter le moniteur</div>
//                         <div className="card-body">
//                             <form onSubmit={handleSubmit}>
//                                 <div className="row">
//                                     <div className="col-md-6 mb-3">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             placeholder="Nom"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="firstName"
//                                             placeholder="Prénom"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email"
//                                             placeholder="Email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phoneNumber"
//                                             placeholder="Téléphone"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="adress"
//                                             placeholder="Adresse"
//                                             value={formData.adress}
//                                             onChange={handleChange}
//                                         />
//                                     </div>
//                                     <div className="col-md-6 mb-3">
//                                         <div className="form-group">
//                                             <label>Spécialités:</label>
//                                             <div>
//                                                 <div className="form-check">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="checkbox"
//                                                         value="Auto"
//                                                         id="flexCheckAuto"
//                                                         name="speciality"
//                                                         checked={formData.speciality.includes('Auto')}
//                                                         onChange={handleChange}
//                                                     />
//                                                     <label className="form-check-label" htmlFor="flexCheckAuto">
//                                                         Auto
//                                                     </label>
//                                                 </div>
//                                                 <div className="form-check">
//                                                     <input
//                                                         className="form-check-input"
//                                                         type="checkbox"
//                                                         value="Moto"
//                                                         id="flexCheckMoto"
//                                                         name="speciality"
//                                                         checked={formData.speciality.includes('Moto')}
//                                                         onChange={handleChange}
//                                                     />
//                                                     <label className="form-check-label" htmlFor="flexCheckMoto">
//                                                         Moto
//                                                     </label>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="btn-group-center mt-3">
//                                     <button type="submit" className="btn btn-success btn-action">
//                                         Ajouter
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="btn btn-danger btn-action ml-2"
//                                         onClick={() => setShowForm(false)}
//                                     >
//                                         Annuler
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;




// //src/pages/InstructorsPage/InstructorPage.jsx FONCTIONNE OK 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';  //Pour gérer la navigation en cas d'erreur d'authentification
// import '../../pages/InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';
// import SearchForm from '../../components/SearchForm/SearchForm';// Ajustez le chemin d'importation si nécessaire

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [filteredInstructors, setFilteredInstructors] = useState([]); //État pour les instructeurs filtrés
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: []
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false); //État pour l'indicateur de chargement
//     const [isSearchActive, setIsSearchActive] = useState(false); //État pour la recherche active
//     const navigate = useNavigate();  //Pour la redirection

//     useEffect(() => {
//         fetchInstructors();
//     }, []); //Gérer la navigation en cas d'erreur d'authentification

//     //Fonction pour récupérer les instructeurs avec gestion d'erreur d'authentification
//     const fetchInstructors = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//             setFilteredInstructors(response.data); //Initialiser les instructeurs filtrés avec toutes les données
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  //Rediriger vers la page de connexion si non authentifié ou accès refusé
//             } else {
//                 setErrorMessage('Erreur lors de la récupération des instructeurs');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedSpeciality = formData.speciality.join(',');
//         const dataToSubmit = { ...formData, speciality: formattedSpeciality };

//         try {
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setEditingInstructor(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  //Rediriger si non autorisé lors de l'ajout ou de la modification
//             } else {
//                 setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === 'speciality') {
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) {
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({ ...formData, speciality: updatedSpeciality });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
//         try {
//             await apiClient.delete(`/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error);
//             if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                 navigate('/connexion');  //Rediriger si l'utilisateur n'est pas autorisé à supprimer
//             } else {
//                 setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             }
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
//         });
//         setShowForm(true);
//     };

//     //Fonction pour gérer la recherche
//     const handleSearch = (searchTerm, type) => {
//         if (searchTerm === "") {
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//             return;
//         }

//         if (type === 'Instructeur') {
//             const lowercasedTerm = searchTerm.toLowerCase();
//             const filtered = instructors.filter(instructor => 
//                 instructor.lastName.toLowerCase().includes(lowercasedTerm) ||
//                 instructor.firstName.toLowerCase().includes(lowercasedTerm)
//             );
//             setFilteredInstructors(filtered);
//             setIsSearchActive(true);
//         } else {
//             //Si la recherche concerne un étudiant ou une recherche générale, ne pas filtrer les instructeurs
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//         }
//     };

//     //Fonction pour recharger la page
//     const reloadPage = () => {
//         window.location.reload();
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Moniteurs</h1>
            
//             {/* Intégration du composant SearchForm */}
//             <SearchForm 
//                 onSearch={handleSearch} 
//                 instructors={instructors} 
//                 students={[]} //Pas de données d'étudiants dans InstructorsPage
//                 isSearchActive={isSearchActive}
//                 reloadPage={reloadPage}
//             />

//             <div className="add-instructor-container">
//                 <button
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage}
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
//             <div className='d-flex flex-column-reverse'>
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Email</th>
//                         <th>Téléphone</th>
//                         <th>Adresse</th>
//                         <th>Spécialités</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredInstructors.map((instructor) => (
//                         <React.Fragment key={instructor.id}>
//                             {editingInstructor && editingInstructor.id === instructor.id && showForm && (
//                                 <tr>
//                                     <td colSpan="7">
//                                         <div className="card mb-5">
//                                             <div className="card-header">
//                                                 Modifier le Moniteur
//                                             </div>
//                                             <div className="card-body">
//                                                 <form onSubmit={handleSubmit}>
//                                                     <div className="row">
//                                                         {/* Formulaire d'édition */}
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="lastName"
//                                                                 placeholder="Nom"
//                                                                 value={formData.lastName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="firstName"
//                                                                 placeholder="Prénom"
//                                                                 value={formData.firstName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
                            
//                             </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="email"
//                                                                  className="form-control"
//                                                                 name="email"
//                                                                 placeholder="Email"
//                                                                 value={formData.email}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="phoneNumber"
//                                                                 placeholder="Téléphone"
//                                                                 value={formData.phoneNumber}
//                                                                 onChange={handleChange}
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="adress"
//                                                                 placeholder="Adresse"
//                                                                 value={formData.adress}
//                                                                 onChange={handleChange}
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <div className="form-group">
//                                                                 <label>Spécialités:</label>
//                                                                 <div>
//                                                                     <div className="form-check">
//                                                                         <input
//                                                                             className="form-check-input"
//                                                                             type="checkbox"
//                                                                             value="Auto"
//                                                                             id={`flexCheckAuto-${instructor.id}`}
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Auto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor={`flexCheckAuto-${instructor.id}`}>
//                                                                             Auto
//                                                                         </label>
//                                                                     </div>
//                                                                     <div className="form-check">
//                                                                         <input
//                                                                             className="form-check-input"
//                                                                             type="checkbox"
//                                                                             value="Moto"
//                                                                             id={`flexCheckMoto-${instructor.id}`}
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Moto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor={`flexCheckMoto-${instructor.id}`}>
//                                                                             Moto
//                                                                         </label>
//                                                                     </div>
//                                                                     {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="btn-group-center mt-3">
//                                                         <button type="submit" className="btn btn-success btn-action">
//                                                             Modifier
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-danger btn-action ml-2"
//                                                             onClick={() => {
//                                                                 setShowForm(false);
//                                                                 setEditingInstructor(null);
//                                                                 setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//                                                             }}
//                                                         >
//                                                             Annuler
//                                                         </button>
//                                                     </div>
//                                                 </form>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                             <tr>
//                                 {/* Instructeurs listés */}
//                                 <td>{instructor.lastName}</td>
//                                 <td>{instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     <button
//                                         className="btn btn-modifier"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     <button
//                                         className="btn btn-danger ml-2"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         </React.Fragment>
//                     ))}
//                 </tbody>
//             </table>
//             {showForm && !editingInstructor && (
//                 <div className="card mb-5">
//                     <div className="card-header">Ajouter le moniteur</div>
                    
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
//                             {/* Réutilisation du même formulaire ici */}
//                             <div className="row">
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="lastName"
//                                         placeholder="Nom"
//                                         value={formData.lastName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="firstName"
//                                         placeholder="Prénom"
//                                         value={formData.firstName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         name="email"
//                                         placeholder="Email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="phoneNumber"
//                                         placeholder="Téléphone"
//                                         value={formData.phoneNumber}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="adress"
//                                         placeholder="Adresse"
//                                         value={formData.adress}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <div className="form-group">
//                                         <label>Spécialités:</label>
//                                         <div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Auto"
//                                                     id="flexCheckAuto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Auto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckAuto">
//                                                     Auto
//                                                 </label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Moto"
//                                                     id="flexCheckMoto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Moto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckMoto">
//                                                     Moto
//                                                 </label>
//                                             </div>
//                                             {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="btn-group-center mt-3">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     Ajouter
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-danger btn-action ml-2"
//                                     onClick={() => setShowForm(false)}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//         </div>
//     );

// };

// export default InstructorsPage;



// //src/pages/InstructorsPage/InstructorsPage.jsx PAGOK FENETRE s AJOUTER s ouvre en haut dela page
// import React, { useState, useEffect } from 'react';
// import '../../pages/InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';
// import SearchForm from '../../components/SearchForm/SearchForm'; Ajustez le chemin d'importation si nécessaire

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [filteredInstructors, setFilteredInstructors] = useState([]); État pour les instructeurs filtrés
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: []
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false); État pour l'indicateur de chargement
//     const [isSearchActive, setIsSearchActive] = useState(false); État pour la recherche active

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//             setFilteredInstructors(response.data); Initialiser les instructeurs filtrés avec toutes les données
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             setErrorMessage('Erreur lors de la récupération des instructeurs');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedSpeciality = formData.speciality.join(',');
//         const dataToSubmit = { ...formData, speciality: formattedSpeciality };

//         try {
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setEditingInstructor(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
//             setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === 'speciality') {
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) {
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({ ...formData, speciality: updatedSpeciality });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
//         try {
//             await apiClient.delete(`/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error);
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : []
//         });
//         setShowForm(true);
//     };

//     Fonction pour gérer la recherche
//     const handleSearch = (searchTerm, type) => {
//         if (searchTerm === "") {
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//             return;
//         }

//         if (type === 'Instructeur') {
//             const lowercasedTerm = searchTerm.toLowerCase();
//             const filtered = instructors.filter(instructor => 
//                 instructor.lastName.toLowerCase().includes(lowercasedTerm) ||
//                 instructor.firstName.toLowerCase().includes(lowercasedTerm)
//             );
//             setFilteredInstructors(filtered);
//             setIsSearchActive(true);
//         } else {
//             Si la recherche concerne un étudiant ou une recherche générale, ne pas filtrer les instructeurs
//             setFilteredInstructors(instructors);
//             setIsSearchActive(false);
//         }
//     };

//     Fonction pour recharger la page
//     const reloadPage = () => {
//         window.location.reload();
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Moniteurs</h1>
            
//             {/* Intégration du composant SearchForm */}
//             <SearchForm 
//                 onSearch={handleSearch} 
//                 instructors={instructors} 
//                 students={[]} Pas de données d'étudiants dans InstructorsPage
//                 isSearchActive={isSearchActive}
//                 reloadPage={reloadPage}
//             />

//             <div className="add-instructor-container">
//                 <button
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage}
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
//             <div className='d-flex flex-column-reverse'>
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Email</th>
//                         <th>Téléphone</th>
//                         <th>Adresse</th>
//                         <th>Spécialités</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {filteredInstructors.map((instructor) => (
//                         <React.Fragment key={instructor.id}>
//                             {editingInstructor && editingInstructor.id === instructor.id && showForm && (
//                                 <tr>
//                                     <td colSpan="7">
//                                         <div className="card mb-5">
//                                             <div className="card-header">
//                                                 Modifier le Moniteur
//                                             </div>
//                                             <div className="card-body">
//                                                 <form onSubmit={handleSubmit}>
//                                                     <div className="row">
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="lastName"
//                                                                 placeholder="Nom"
//                                                                 value={formData.lastName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="firstName"
//                                                                 placeholder="Prénom"
//                                                                 value={formData.firstName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="email"
//                                                                 className="form-control"
//                                                                 name="email"
//                                                                 placeholder="Email"
//                                                                 value={formData.email}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="phoneNumber"
//                                                                 placeholder="Téléphone"
//                                                                 value={formData.phoneNumber}
//                                                                 onChange={handleChange}
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 name="adress"
//                                                                 placeholder="Adresse"
//                                                                 value={formData.adress}
//                                                                 onChange={handleChange}
//                                                             />
//                                                         </div>
//                                                         <div className="col-md-6 mb-3">
//                                                             <div className="form-group">
//                                                                 <label>Spécialités:</label>
//                                                                 <div>
//                                                                     <div className="form-check">
//                                                                         <input
//                                                                             className="form-check-input"
//                                                                             type="checkbox"
//                                                                             value="Auto"
//                                                                             id={`flexCheckAuto-${instructor.id}`}
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Auto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor={`flexCheckAuto-${instructor.id}`}>
//                                                                             Auto
//                                                                         </label>
//                                                                     </div>
//                                                                     <div className="form-check">
//                                                                         <input
//                                                                             className="form-check-input"
//                                                                             type="checkbox"
//                                                                             value="Moto"
//                                                                             id={`flexCheckMoto-${instructor.id}`}
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Moto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor={`flexCheckMoto-${instructor.id}`}>
//                                                                             Moto
//                                                                         </label>
//                                                                     </div>
//                                                                     {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <div className="btn-group-center mt-3">
//                                                         <button type="submit" className="btn btn-success btn-action">
//                                                             Modifier
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             className="btn btn-danger btn-action ml-2"
//                                                             onClick={() => {
//                                                                 setShowForm(false);
//                                                                 setEditingInstructor(null);
//                                                                 setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//                                                             }}
//                                                         >
//                                                             Annuler
//                                                         </button>
//                                                     </div>
//                                                 </form>
//                                             </div>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                             <tr>
//                                 <td>{instructor.lastName}</td>
//                                 <td>{instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     {/* Utilisation de la classe personnalisée btn-modifier */}
//                                     <button
//                                         className="btn btn-modifier"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     <button
//                                         className="btn btn-danger ml-2"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         </React.Fragment>
//                     ))}
//                 </tbody>
//             </table>

//             {showForm && !editingInstructor && (
//                 <div className="card mb-5">
//                     <div className="card-header">Ajouter le moniteur</div>
                    
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
//                             {/* Réutilisation du même formulaire ici */}
//                             <div className="row">
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="lastName"
//                                         placeholder="Nom"
//                                         value={formData.lastName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="firstName"
//                                         placeholder="Prénom"
//                                         value={formData.firstName}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="email"
//                                         className="form-control"
//                                         name="email"
//                                         placeholder="Email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="phoneNumber"
//                                         placeholder="Téléphone"
//                                         value={formData.phoneNumber}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="adress"
//                                         placeholder="Adresse"
//                                         value={formData.adress}
//                                         onChange={handleChange}
//                                     />
//                                 </div>
//                                 <div className="col-md-6 mb-3">
//                                     <div className="form-group">
//                                         <label>Spécialités:</label>
//                                         <div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Auto"
//                                                     id="flexCheckAuto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Auto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckAuto">
//                                                     Auto
//                                                 </label>
//                                             </div>
//                                             <div className="form-check">
//                                                 <input
//                                                     className="form-check-input"
//                                                     type="checkbox"
//                                                     value="Moto"
//                                                     id="flexCheckMoto"
//                                                     name="speciality"
//                                                     checked={formData.speciality.includes('Moto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 <label className="form-check-label" htmlFor="flexCheckMoto">
//                                                     Moto
//                                                 </label>
//                                             </div>
//                                             {/* Ajoutez d'autres spécialités ici si nécessaire */}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="btn-group-center mt-3">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     Ajouter
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-danger btn-action ml-2"
//                                     onClick={() => setShowForm(false)}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//         </div>
//     );

// };

// export default InstructorsPage;


// src/pages/InstructorsPage/InstructorsPage.jsx
// import React, { useState, useEffect } from 'react';
// import '../../pages/InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';
// import SearchForm from '../../components/SearchForm/SearchForm';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [filteredInstructors, setFilteredInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: []
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [isSearchActive, setIsSearchActive] = useState(false);

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         setLoading(true);
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//             setFilteredInstructors(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             const errorMsg = error.response ? error.response.data.message : 'Erreur lors de la récupération des instructeurs';
//             setErrorMessage(errorMsg);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formattedSpeciality = formData.speciality.join(',');
//         const dataToSubmit = { ...formData, speciality: formattedSpeciality };

//         try {
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setEditingInstructor(null);
//             setShowForm(false);
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
//             const errorMsg = error.response ? error.response.data.message : 'Erreur lors de l\'ajout ou de la modification de l\'instructeur';
//             setErrorMessage(errorMsg);
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value, checked } = e.target;
//         if (name === 'speciality') {
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) {
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({ ...formData, speciality: updatedSpeciality });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;
//         try {
//             await apiClient.delete(`/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => setSuccessMessage(''), 3000);
//             fetchInstructors();
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error);
//             const errorMsg = error.response ? error.response.data.message : 'Erreur lors de la suppression de l\'instructeur';
//             setErrorMessage(errorMsg);
//             setTimeout(() => setErrorMessage(''), 3000);
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality.split(',')
//         });
//         setShowForm(true);
//     };

//     const handleSearch = (searchTerm) => {
//         const filtered = instructors.filter(instructor =>
//             instructor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             instructor.lastName.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setFilteredInstructors(filtered);
//         setIsSearchActive(true);
//     };

//     const reloadPage = () => {
//         setIsSearchActive(false);
//         setFilteredInstructors(instructors);
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Moniteurs</h1>
            
//             <SearchForm 
//                 onSearch={handleSearch} 
//                 instructors={instructors} 
//                 students={[]} 
//                 isSearchActive={isSearchActive}
//                 reloadPage={reloadPage}
//             />

//             <div className="add-instructor-container">
//                 <button
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {loading && <div className="alert alert-info">Chargement des instructeurs...</div>}

//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage}
//                 </div>
//             )}

//             <div className='d-flex flex-column-reverse'>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th>Nom</th>
//                             <th>Prénom</th>
//                             <th>Email</th>
//                             <th>Téléphone</th>
//                             <th>Adresse</th>
//                             <th>Spécialités</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredInstructors.map((instructor) => (
//                             <React.Fragment key={instructor.id}>
//                                 {editingInstructor && editingInstructor.id === instructor.id && showForm && (
//                                     <tr>
//                                         <td colSpan="7">
//                                             <div className="card mb-5">
//                                                 <div className="card-header">
//                                                     Modifier le Moniteur
//                                                 </div>
//                                                 <div className="card-body">
//                                                     <form onSubmit={handleSubmit}>
//                                                         <div className="form-group">
//                                                             <label htmlFor="lastName">Nom</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 id="lastName"
//                                                                 name="lastName"
//                                                                 value={formData.lastName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <label htmlFor="firstName">Prénom</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 id="firstName"
//                                                                 name="firstName"
//                                                                 value={formData.firstName}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <label htmlFor="email">Email</label>
//                                                             <input
//                                                                 type="email"
//                                                                 className="form-control"
//                                                                 id="email"
//                                                                 name="email"
//                                                                 value={formData.email}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <label htmlFor="phoneNumber">Téléphone</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 id="phoneNumber"
//                                                                 name="phoneNumber"
//                                                                 value={formData.phoneNumber}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <label htmlFor="adress">Adresse</label>
//                                                             <input
//                                                                 type="text"
//                                                                 className="form-control"
//                                                                 id="adress"
//                                                                 name="adress"
//                                                                 value={formData.adress}
//                                                                 onChange={handleChange}
//                                                                 required
//                                                             />
//                                                         </div>
//                                                         <div className="form-group">
//                                                             <label>Spécialités</label>
//                                                             {/* Ajoutez ici votre logique pour sélectionner les spécialités */}
//                                                         </div>
//                                                         <div className="btn-group-center mt-3">
//                                                             <button type="submit" className="btn btn-success btn-action">
//                                                                 Modifier
//                                                             </button>
//                                                             <button
//                                                                 type="button"
//                                                                 className="btn btn-danger btn-action ml-2"
//                                                                 onClick={() => {
//                                                                     setShowForm(false);
//                                                                     setEditingInstructor(null);
//                                                                     setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//                                                                 }}
//                                                             >
//                                                                 Annuler
//                                                             </button>
//                                                         </div>
//                                                     </form>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                                 <tr>
//                                     <td>{instructor.lastName}</td>
//                                     <td>{instructor.firstName}</td>
//                                     <td>{instructor.email}</td>
//                                     <td>{instructor.phoneNumber}</td>
//                                     <td>{instructor.adress}</td>
//                                     <td>{instructor.speciality}</td>
//                                     <td>
//                                         <button
//                                             className="btn btn-primary btn-action"
//                                             onClick={() => handleEdit(instructor)}
//                                         >
//                                             Modifier
//                                         </button>
//                                         <button
//                                             className="btn btn-danger btn-action"
//                                             onClick={() => handleDelete(instructor.id)}
//                                         >
//                                             Supprimer
//                                         </button>
//                                     </td>
//                                 </tr>
//                             </React.Fragment>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {showForm && (
//                 <div className="card mt-5">
//                     <div className="card-header">Ajouter un Instructeur</div>
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
//                             <div className="form-group">
//                                 <label htmlFor="lastName">Nom</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="lastName"
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="firstName">Prénom</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="firstName"
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="email">Email</label>
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     id="email"
//                                     name="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="phoneNumber">Téléphone</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="phoneNumber"
//                                     name="phoneNumber"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="adress">Adresse</label>
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     id="adress"
//                                     name="adress"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Spécialités</label>
//                                 {/* Ajoutez ici votre logique pour sélectionner les spécialités */}
//                             </div>
//                             <button type="submit" className="btn btn-success">
//                                 Ajouter
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstructorsPage;