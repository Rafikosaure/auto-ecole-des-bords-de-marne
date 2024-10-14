


//src/instructorsPage/InstructorPage.jsx VERSION OK 

import React, { useState, useEffect } from 'react';
import '../InstructorsPage/InstructorPage.css'; // Assurez-vous que le chemin est correct
import apiClient from '../../api/api-client';

const InstructorsPage = () => {
    const [instructors, setInstructors] = useState([]);
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        adress: '',
        speciality: ''
    });
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await apiClient.get('http://localhost:3001/api/instructor/getall');
            setInstructors(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des instructeurs:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInstructor) {
                await apiClient.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
                setSuccessMessage('Un instructeur a bien été modifié');
            } else {
                await apiClient.post('http://localhost:3001/api/instructor/add', formData);
                setSuccessMessage('Un instructeur a bien été ajouté');
            }

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            fetchInstructors();
            setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
            setShowForm(false);
            setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
        } catch (error) {
            console.error("Erreur lors de l'ajout/modification de l'instructeur:", error);
            setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;

        try {
            await apiClient.delete(`http://localhost:3001/api/instructor/delete/${id}`);
            setSuccessMessage('Un instructeur a bien été supprimé');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            fetchInstructors();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'instructeur:", error);
            setErrorMessage('Erreur lors de la suppression de l\'instructeur');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
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
            speciality: instructor.speciality
        });
        setShowForm(true);
    };

    return (
        <div className="container mt-5">
            {/* Titre Centré */}
            <h1 className="text-center-title">Liste des Instructeurs</h1>
            
            {/* Bouton "Ajouter Instructeur" Centré */}
            <div className="add-instructor-container">
                <button 
                    className="btn btn-success mb-3 btn-add-instructor"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Annuler' : 'Ajouter Instructeur'}
                </button>
            </div>

            {/* Messages de Succès et d'Erreur */}
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

            {/* Formulaire d'Ajout/Modification */}
            {showForm && (
                <div className="card mb-5">
                    <div className="card-header">
                        {editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}
                    </div>
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
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="speciality"
                                            value="auto"
                                            checked={formData.speciality === 'auto'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Auto</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="speciality"
                                            value="moto"
                                            checked={formData.speciality === 'moto'}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label">Moto</label>
                                    </div>
                                </div>
                            </div>
                            {/* Boutons "Modifier" et "Annuler" Centrés et de Taille Fixe */}
                            <div className="btn-group-center">
                                <button type="submit" className="btn btn-success btn-action">
                                    {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
                                </button>
                                {editingInstructor && (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-action"
                                        onClick={() => {
                                            setEditingInstructor(null);
                                            setShowForm(false);
                                        }}
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Liste des Instructeurs */}
            <div className="instructors-container">
                <div className="card mb-5">
                    <div className="card-header text-center-title">Liste des Instructeurs</div>
                    <div className="card-body">
                        <div className="table-responsive">
                            {/* Table pour les écrans moyens et larges */}
                            <table className="table table-bordered d-none d-md-table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nom Complet</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Téléphone</th>
                                        <th scope="col">Adresse</th>
                                        <th scope="col">Spécialité</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instructors.map((instructor, index) => (
                                        <tr key={instructor.id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{instructor.lastName} {instructor.firstName}</td>
                                            <td>{instructor.email}</td>
                                            <td>{instructor.phoneNumber}</td>
                                            <td>{instructor.adress}</td>
                                            <td>{instructor.speciality}</td>
                                            <td>
                                                {/* Boutons "Modifier" et "Supprimer" Centrés et de Taille Fixe */}
                                                <div className="btn-group-center">
                                                    <button 
                                                        className="btn btn-warning btn-action"
                                                        onClick={() => handleEdit(instructor)}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-action"
                                                        onClick={() => handleDelete(instructor.id)}
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Vue Mobile : Cartes */}
                            <div className="d-md-none">
                                {instructors.map((instructor, index) => (
                                    <div className="card mb-2" key={instructor.id}>
                                        <div className="card-body">
                                            <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
                                            <p className="card-text">Email: {instructor.email}</p>
                                            <p className="card-text">Téléphone: {instructor.phoneNumber}</p>
                                            <p className="card-text">Adresse: {instructor.adress}</p>
                                            <p className="card-text">Spécialité: {instructor.speciality}</p>
                                            {/* Boutons "Modifier" et "Supprimer" Centrés et de Taille Fixe */}
                                            <div className="d-flex-center-mobile">
                                                <button 
                                                    className="btn btn-warning btn-action"
                                                    onClick={() => handleEdit(instructor)}
                                                >
                                                    Modifier
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-action"
                                                    onClick={() => handleDelete(instructor.id)}
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorsPage;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../InstructorsPage/InstructorPage.css';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }

//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);

//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
//             setShowForm(false);
//         } catch (error) {
//             setErrorMessage('Erreur lors de l\'ajout de l\'instructeur');
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);
//             fetchInstructors();
//         } catch (error) {
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
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
//             speciality: instructor.speciality
//         });
//         setShowForm(true);
//     };

//     return (
//         <div className="container mt-5">
//             {/* Titre Centré */}
//             <h1 className="text-center-title">Liste des Instructeurs</h1>
            
//             {/* Bouton "Ajouter Instructeur" Centré */}
//             <div className="add-instructor-container">
//                 <button 
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {/* Messages de Succès et d'Erreur */}
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

//             {/* Formulaire d'Ajout/Modification */}
//             {showForm && (
//                 <div className="card mb-5">
//                     <div className="card-header">
//                         {editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}
//                     </div>
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
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
//                                     <div className="form-check">
//                                         <input
//                                             type="radio"
//                                             className="form-check-input"
//                                             name="speciality"
//                                             value="auto"
//                                             checked={formData.speciality === 'auto'}
//                                             onChange={handleChange}
//                                         />
//                                         <label className="form-check-label">Auto</label>
//                                     </div>
//                                     <div className="form-check">
//                                         <input
//                                             type="radio"
//                                             className="form-check-input"
//                                             name="speciality"
//                                             value="moto"
//                                             checked={formData.speciality === 'moto'}
//                                             onChange={handleChange}
//                                         />
//                                         <label className="form-check-label">Moto</label>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Boutons "Modifier" et "Annuler" Centrés et de Taille Fixe */}
//                             <div className="btn-group-center">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                                 </button>
//                                 {editingInstructor && (
//                                     <button 
//                                         type="button" 
//                                         className="btn btn-primary btn-action"
//                                         onClick={() => {
//                                             setEditingInstructor(null);
//                                             setShowForm(false);
//                                         }}
//                                     >
//                                         Annuler
//                                     </button>
//                                 )}
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Liste des Instructeurs */}
//             <div className="instructors-container">
//                 <div className="card mb-5">
//                     <div className="card-header text-center-title">Liste des Instructeurs</div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             {/* Table pour les écrans moyens et larges */}
//                             <table className="table table-bordered d-none d-md-table">
//                                 <thead>
//                                     <tr>
//                                         <th scope="col">#</th>
//                                         <th scope="col">Nom Complet</th>
//                                         <th scope="col">Email</th>
//                                         <th scope="col">Téléphone</th>
//                                         <th scope="col">Adresse</th>
//                                         <th scope="col">Spécialité</th>
//                                         <th scope="col">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {instructors.map((instructor, index) => (
//                                         <tr key={instructor.id}>
//                                             <th scope="row">{index + 1}</th>
//                                             <td>{instructor.lastName} {instructor.firstName}</td>
//                                             <td>{instructor.email}</td>
//                                             <td>{instructor.phoneNumber}</td>
//                                             <td>{instructor.adress}</td>
//                                             <td>{instructor.speciality}</td>
//                                             <td>
//                                                 {/* Boutons "Modifier" et "Supprimer" Centrés et de Taille Fixe */}
//                                                 <div className="btn-group-center">
//                                                     <button 
//                                                         className="btn btn-warning btn-action"
//                                                         onClick={() => handleEdit(instructor)}
//                                                     >
//                                                         Modifier
//                                                     </button>
//                                                     <button 
//                                                         className="btn btn-danger btn-action"
//                                                         onClick={() => handleDelete(instructor.id)}
//                                                     >
//                                                         Supprimer
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
                            
//                             {/* Vue Mobile : Cartes */}
//                             <div className="d-md-none">
//                                 {instructors.map((instructor, index) => (
//                                     <div className="card mb-2" key={instructor.id}>
//                                         <div className="card-body">
//                                             <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
//                                             <p className="card-text">Email: {instructor.email}</p>
//                                             <p className="card-text">Téléphone: {instructor.phoneNumber}</p>
//                                             <p className="card-text">Adresse: {instructor.adress}</p>
//                                             <p className="card-text">Spécialité: {instructor.speciality}</p>
//                                             {/* Boutons "Modifier" et "Supprimer" Centrés et de Taille Fixe */}
//                                             <div className="d-flex-center-mobile">
//                                                 <button 
//                                                     className="btn btn-warning btn-action"
//                                                     onClick={() => handleEdit(instructor)}
//                                                 >
//                                                     Modifier
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-danger btn-action"
//                                                     onClick={() => handleDelete(instructor.id)}
//                                                 >
//                                                     Supprimer
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
                            
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../InstructorsPage/InstructorPage.css';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 setSuccessMessage('Un instructeur a bien été modifié');
//             } else {
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 setSuccessMessage('Un instructeur a bien été ajouté');
//             }

//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);

//             fetchInstructors();
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
//             setShowForm(false);
//         } catch (error) {
//             setErrorMessage('Erreur lors de l\'ajout de l\'instructeur');
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//             setSuccessMessage('Un instructeur a bien été supprimé');
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);
//             fetchInstructors();
//         } catch (error) {
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur');
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
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
//             speciality: instructor.speciality
//         });
//         setShowForm(true);
//     };

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Liste des Instructeurs</h1>
            
//             {/* Nouveau conteneur pour centrer le bouton "Ajouter Instructeur" */}
//             <div className="add-instructor-container">
//                 <button 
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)}
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

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

//             {showForm && (
//                 <div className="card mb-5">
//                     <div className="card-header">
//                         {editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}
//                     </div>
//                     <div className="card-body">
//                         <form onSubmit={handleSubmit}>
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
//                                     <div className="form-check">
//                                         <input
//                                             type="radio"
//                                             className="form-check-input"
//                                             name="speciality"
//                                             value="auto"
//                                             checked={formData.speciality === 'auto'}
//                                             onChange={handleChange}
//                                         />
//                                         <label className="form-check-label">Auto</label>
//                                     </div>
//                                     <div className="form-check">
//                                         <input
//                                             type="radio"
//                                             className="form-check-input"
//                                             name="speciality"
//                                             value="moto"
//                                             checked={formData.speciality === 'moto'}
//                                             onChange={handleChange}
//                                         />
//                                         <label className="form-check-label">Moto</label>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Centrer les boutons "Modifier" et "Annuler" */}
//                             <div className="d-flex justify-content-center">
//                                 <button type="submit" className="btn btn-success btn-standard me-2">
//                                     {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                                 </button>
//                                 {editingInstructor && (
//                                     <button 
//                                         type="button" 
//                                         className="btn btn-primary btn-standard me-2"
//                                         onClick={() => {
//                                             setEditingInstructor(null);
//                                             setShowForm(false);
//                                         }}
//                                     >
//                                         Annuler
//                                     </button>
//                                 )}
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <div className="instructors-container">
//                 <div className="card mb-5">
//                     <div className="card-header">Liste des Instructeurs</div>
//                     <div className="card-body">
//                         <div className="table-responsive">
//                             <table className="table table-bordered d-none d-md-table">
//                                 <thead>
//                                     <tr>
//                                         <th scope="col"></th>
//                                         <th scope="col">Nom Complet</th>
//                                         <th scope="col">Email</th>
//                                         <th scope="col">Téléphone</th>
//                                         <th scope="col">Adresse</th>
//                                         <th scope="col">Spécialité</th>
//                                         <th scope="col">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {instructors.map((instructor, index) => (
//                                         <tr key={instructor.id}>
//                                             <th scope="row">{index + 1}</th>
//                                             <td>{instructor.lastName} {instructor.firstName}</td>
//                                             <td>{instructor.email}</td>
//                                             <td>{instructor.phoneNumber}</td>
//                                             <td>{instructor.adress}</td>
//                                             <td>{instructor.speciality}</td>
//                                             <td>
//                                                 <div className="d-flex justify-content-end btn-group">
//                                                     <button 
//                                                         className="btn btn-warning btn-standard me-2 btn-modifier"
//                                                         onClick={() => handleEdit(instructor)}
//                                                     >
//                                                         Modifier
//                                                     </button>
//                                                     <button 
//                                                         className="btn btn-danger btn-standard"
//                                                         onClick={() => handleDelete(instructor.id)}
//                                                     >
//                                                         Supprimer
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <div className="d-md-none">
//                                 {instructors.map((instructor, index) => (
//                                     <div className="card mb-2" key={instructor.id}>
//                                         <div className="card-body">
//                                             <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
//                                             <p className="card-text">Email: {instructor.email}</p>
//                                             <p className="card-text">Téléphone: {instructor.phoneNumber}</p>
//                                             <p className="card-text">Adresse: {instructor.adress}</p>
//                                             <p className="card-text">Spécialité: {instructor.speciality}</p>
//                                             <div className="d-flex justify-content-center">
//                                                 <button 
//                                                     className="btn btn-warning me-2 btn-standard"
//                                                     onClick={() => handleEdit(instructor)}
//                                                 >
//                                                     Modifier
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-danger btn-standard"
//                                                     onClick={() => handleDelete(instructor.id)}
//                                                 >
//                                                     Supprimer
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;

