import React, { useState, useEffect } from 'react';
import '../InstructorsPage/InstructorPage.css';
import apiClient from '../../api/api-client';

const InstructorsPage = () => {
    const [instructors, setInstructors] = useState([]);
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

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await apiClient.get('/instructor/getall');
            setInstructors(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des instructeurs:", error);
            setErrorMessage('Erreur lors de la récupération des instructeurs');
        }
    };

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
            setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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
            setErrorMessage('Erreur lors de la suppression de l\'instructeur');
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

    return (
        <div className="container mt-5">
            <h1 className="text-center-title">Liste des Instructeurs</h1>
            <div className="add-instructor-container">
                <button
                    className="btn btn-success mb-3 btn-add-instructor"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Annuler' : 'Ajouter Instructeur'}
                </button>
            </div>

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
                    {instructors.map((instructor) => (
                        <React.Fragment key={instructor.id}>
                            {editingInstructor && editingInstructor.id === instructor.id && showForm && (
                                <tr>
                                    <td colSpan="7">
                                        <div className="card mb-5">
                                            <div className="card-header">
                                                Modifier Instructeur
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
                                <td>{instructor.lastName}</td>
                                <td>{instructor.firstName}</td>
                                <td>{instructor.email}</td>
                                <td>{instructor.phoneNumber}</td>
                                <td>{instructor.adress}</td>
                                <td>{instructor.speciality}</td>
                                <td>
                                    {/* Utilisation de la classe personnalisée btn-modifier */}
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

            {showForm && !editingInstructor && (
                <div className="card mb-5">
                    <div className="card-header">Ajouter Instructeur</div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Réutilisation du même formulaire ici */}
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
        </div>
    );
};

export default InstructorsPage;



// import React, { useState, useEffect } from 'react';
// import '../InstructorsPage/InstructorPage.css';
// import apiClient from '../../api/api-client';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
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

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         try {
//             const response = await apiClient.get('/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error);
//             setErrorMessage('Erreur lors de la récupération des instructeurs');
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
//         const { name, value, type, checked } = e.target;
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

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center-title">Liste des Instructeurs</h1>
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

//             {/* Liste des instructeurs affichée */}
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
//                     {instructors.map((instructor) => (
//                         <React.Fragment key={instructor.id}>
//                             {editingInstructor && editingInstructor.id === instructor.id && showForm && (
//                                 <tr>
//                                     <td colSpan="7">
//                                         <div className="card mb-5">
//                                             <div className="card-header">
//                                                 Modifier Instructeur
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
//                                                                             id="flexCheckAuto"
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Auto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor="flexCheckAuto">
//                                                                             Auto
//                                                                         </label>
//                                                                     </div>
//                                                                     <div className="form-check">
//                                                                         <input
//                                                                             className="form-check-input"
//                                                                             type="checkbox"
//                                                                             value="Moto"
//                                                                             id="flexCheckMoto"
//                                                                             name="speciality"
//                                                                             checked={formData.speciality.includes('Moto')}
//                                                                             onChange={handleChange}
//                                                                         />
//                                                                         <label className="form-check-label" htmlFor="flexCheckMoto">
//                                                                             Moto
//                                                                         </label>
//                                                                     </div>
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
//                                     <button
//                                         className="btn btn-primary"
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
//                     <div className="card-header">Ajouter Instructeur</div>
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


// // Importation des dépendances nécessaires
// import React, { useState, useEffect } from 'react';
// import '../InstructorsPage/InstructorPage.css'; // Importation du fichier CSS pour le style
// import apiClient from '../../api/api-client'; // Assurez-vous que ce chemin est correct


// const InstructorsPage = () => {
//     // État pour stocker la liste des instructeurs
//     const [instructors, setInstructors] = useState([]);

//     // État pour gérer les données du formulaire
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: [] // Initialiser comme tableau pour gérer plusieurs spécialités
//     });

//     // État pour gérer l'instructeur en cours d'édition
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     // État pour contrôler l'affichage du formulaire
//     const [showForm, setShowForm] = useState(false);

//     // État pour les messages de succès et d'erreur
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     // Hook useEffect pour récupérer la liste des instructeurs lors du premier rendu
//     useEffect(() => {
//         fetchInstructors(); // Appel de la fonction pour récupérer les instructeurs
//     }, []);

//     // Fonction pour récupérer la liste des instructeurs
//     const fetchInstructors = async () => {
//         try {
//             const response = await apiClient.get('/instructor/getall'); // Requête GET pour récupérer tous les instructeurs
//             setInstructors(response.data); // Mise à jour de l'état avec les données récupérées
//             console.log('Instructors fetched:', response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de la récupération des instructeurs'); // Message d'erreur
//         }
//     };

//     // Fonction pour gérer la soumission du formulaire
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Empêcher le comportement par défaut du formulaire

//         // Convertir le tableau de spécialités en une chaîne sans espaces
//         const formattedSpeciality = formData.speciality.join(','); // Joindre les spécialités en une chaîne sans espace

//         // Préparer les données à envoyer
//         const dataToSubmit = {
//             ...formData,
//             speciality: formattedSpeciality // Remplacer le tableau par la chaîne formatée
//         };

//         try {
//             // Vérifier si un instructeur est en cours d'édition
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit); // Requête PUT pour modifier l'instructeur
//                 setSuccessMessage('Un instructeur a bien été modifié'); // Message de succès
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit); // Requête POST pour ajouter un nouvel instructeur
//                 setSuccessMessage('Un instructeur a bien été ajouté'); // Message de succès
//             }

//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);

//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//             // Réinitialiser les champs du formulaire
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setShowForm(false); // Masquer le formulaire
//             setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer les changements dans le formulaire
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         if (name === 'speciality') {
//             // Gérer les changements pour les checkboxes de spécialité
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 if (!updatedSpeciality.includes(value)) { // Éviter les doublons
//                     updatedSpeciality.push(value);
//                 }
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({
//                 ...formData,
//                 speciality: updatedSpeciality
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value // Mettre à jour le champ correspondant dans formData
//             });
//         }
//     };

//     // Fonction pour gérer la suppression d'un instructeur
//     const handleDelete = async (id) => {
//         // Confirmation de la suppression
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;

//         try {
//             await apiClient.delete(`/instructor/delete/${id}`); // Requête DELETE pour supprimer l'instructeur
//             setSuccessMessage('Un instructeur a bien été supprimé'); // Message de succès
//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);
//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer l'édition d'un instructeur
//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor); // Définir l'instructeur à éditer
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(',').map(spec => spec.trim()) : [] // Convertir la chaîne de spécialités en tableau
//         });
//         setShowForm(true); // Afficher le formulaire
//     };

//     // useEffect pour déboguer les mises à jour de formData
//     useEffect(() => {
//         console.log('Form Data updated:', formData);
//     }, [formData]);

//     return (
//         <div className="container mt-5">
//             {/* Titre Centré */}
//             <h1 className="text-center-title">Liste des Instructeurs</h1>
            
//             {/* Bouton "Ajouter Instructeur" Centré */}
//             <div className="add-instructor-container">
//                 <button 
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)} // Alterner l'affichage du formulaire
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {/* Messages de Succès et d'Erreur */}
//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage} {/* Afficher le message de succès */}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage} {/* Afficher le message d'erreur */}
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
//                                 {/* Champs du formulaire pour les détails de l'instructeur */}
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
//                                     {/* Spécialités - Cases à cocher Bootstrap standard */}
//                                     <div className="form-group">
//                                         <label>Spécialités:</label>
//                                         <div>
//                                             {/* Checkbox Auto */}
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
                                            
//                                             {/* Checkbox Moto */}
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
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Boutons "Modifier" et "Annuler" Centrés et de Taille Fixe */}
//                             <div className="btn-group-center mt-3">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     {editingInstructor ? 'Modifier' : 'Ajouter'} {/* Texte du bouton selon l'état d'édition */}
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-danger btn-action ml-2"
//                                     onClick={() => {
//                                         setShowForm(false); // Masquer le formulaire
//                                         setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//                                         setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] }); // Réinitialiser les spécialités
//                                     }}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
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
//                     {instructors.map((instructor) => (
//                         <tr key={instructor.id}>
//                             <td>{instructor.lastName}</td>
//                             <td>{instructor.firstName}</td>
//                             <td>{instructor.email}</td>
//                             <td>{instructor.phoneNumber}</td>
//                             <td>{instructor.adress}</td>
//                             <td>{instructor.speciality}</td>
//                             <td>
//                                 <button
//                                     className="btn btn-warning mr-2"
//                                     onClick={() => handleEdit(instructor)} // Fonction d'édition
//                                 >
//                                     Modifier
//                                 </button>
//                                 <button
//                                     className="btn btn-danger"
//                                     onClick={() => handleDelete(instructor.id)} // Fonction de suppression
//                                 >
//                                     Supprimer
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

// };

// export default InstructorsPage; // Exportation du composant InstructorsPage

// // Importation des dépendances nécessaires
// import React, { useState, useEffect } from 'react';
// import '../InstructorsPage/InstructorPage.css'; // Importation du fichier CSS pour le style
// import apiClient from '../../api/api-client'; // Assurez-vous que ce chemin est correct

// const InstructorsPage = () => {
//     // État pour stocker la liste des instructeurs
//     const [instructors, setInstructors] = useState([]);

//     // État pour gérer les données du formulaire
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: [] // Initialiser comme tableau pour gérer plusieurs spécialités
//     });

//     // État pour gérer l'instructeur en cours d'édition
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     // État pour contrôler l'affichage du formulaire
//     const [showForm, setShowForm] = useState(false);

//     // État pour les messages de succès et d'erreur
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     // Hook useEffect pour récupérer la liste des instructeurs lors du premier rendu
//     useEffect(() => {
//         fetchInstructors(); // Appel de la fonction pour récupérer les instructeurs
//     }, []);

//     // Fonction pour récupérer la liste des instructeurs
//     const fetchInstructors = async () => {
//         try {
//             const response = await apiClient.get('/instructor/getall'); // Requête GET pour récupérer tous les instructeurs
//             setInstructors(response.data); // Mise à jour de l'état avec les données récupérées
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de la récupération des instructeurs'); // Message d'erreur
//         }
//     };

//     // Fonction pour gérer la soumission du formulaire
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Empêcher le comportement par défaut du formulaire

//         // Convertir le tableau de spécialités en une chaîne
//         const formattedSpeciality = formData.speciality.join(', '); // Joindre les spécialités en une chaîne

//         // Préparer les données à envoyer
//         const dataToSubmit = {
//             ...formData,
//             speciality: formattedSpeciality // Remplacer le tableau par la chaîne formatée
//         };

//         try {
//             // Vérifier si un instructeur est en cours d'édition
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, dataToSubmit); // Requête PUT pour modifier l'instructeur
//                 setSuccessMessage('Un instructeur a bien été modifié'); // Message de succès
//             } else {
//                 await apiClient.post('/instructor/add', dataToSubmit); // Requête POST pour ajouter un nouvel instructeur
//                 setSuccessMessage('Un instructeur a bien été ajouté'); // Message de succès
//             }

//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);

//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//             // Réinitialiser les champs du formulaire
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] });
//             setShowForm(false); // Masquer le formulaire
//             setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer les changements dans le formulaire
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         if (name === 'speciality') {
//             // Gérer les changements pour les checkboxes de spécialité
//             let updatedSpeciality = [...formData.speciality];
//             if (checked) {
//                 updatedSpeciality.push(value);
//             } else {
//                 updatedSpeciality = updatedSpeciality.filter(item => item !== value);
//             }
//             setFormData({
//                 ...formData,
//                 speciality: updatedSpeciality
//             });
//         } else {
//             setFormData({
//                 ...formData,
//                 [name]: value // Mettre à jour le champ correspondant dans formData
//             });
//         }
//     };

//     // Fonction pour gérer la suppression d'un instructeur
//     const handleDelete = async (id) => {
//         // Confirmation de la suppression
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;

//         try {
//             await apiClient.delete(`/instructor/delete/${id}`); // Requête DELETE pour supprimer l'instructeur
//             setSuccessMessage('Un instructeur a bien été supprimé'); // Message de succès
//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);
//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer l'édition d'un instructeur
//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor); // Définir l'instructeur à éditer
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality ? instructor.speciality.split(', ') : [] // Convertir la chaîne de spécialités en tableau
//         });
//         setShowForm(true); // Afficher le formulaire
//     };

//     return (
//         <div className="container mt-5">
//             {/* Titre Centré */}
//             <h1 className="text-center-title">Liste des Instructeurs</h1>
            
//             {/* Bouton "Ajouter Instructeur" Centré */}
//             <div className="add-instructor-container">
//                 <button 
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)} // Alterner l'affichage du formulaire
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {/* Messages de Succès et d'Erreur */}
//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage} {/* Afficher le message de succès */}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage} {/* Afficher le message d'erreur */}
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
//                                 {/* Champs du formulaire pour les détails de l'instructeur */}
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
//                                     {/* Spécialités - Cases à cocher stylisées comme des boutons */}
//                                     <div className="form-group">
//                                         <label>Spécialités:</label>
//                                         <div className="btn-group-toggle" data-toggle="buttons">
//                                             <label className={`btn btn-outline-primary ${formData.speciality.includes('Auto') ? 'active' : ''}`}>
//                                                 <input
//                                                     type="checkbox"
//                                                     name="speciality"
//                                                     value="Auto"
//                                                     checked={formData.speciality.includes('Auto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 Auto
//                                             </label>
//                                             <label className={`btn btn-outline-primary ${formData.speciality.includes('Moto') ? 'active' : ''}`}>
//                                                 <input
//                                                     type="checkbox"
//                                                     name="speciality"
//                                                     value="Moto"
//                                                     checked={formData.speciality.includes('Moto')}
//                                                     onChange={handleChange}
//                                                 />
//                                                 Moto
//                                             </label>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             {/* Boutons "Modifier" et "Annuler" Centrés et de Taille Fixe */}
//                             <div className="btn-group-center mt-3">
//                                 <button type="submit" className="btn btn-success btn-action">
//                                     {editingInstructor ? 'Modifier' : 'Ajouter'} {/* Texte du bouton selon l'état d'édition */}
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-danger btn-action ml-2"
//                                     onClick={() => {
//                                         setShowForm(false); // Masquer le formulaire
//                                         setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//                                         setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: [] }); // Réinitialiser les spécialités
//                                     }}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
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
//                     {instructors.map((instructor) => (
//                         <tr key={instructor.id}>
//                             <td>{instructor.lastName}</td>
//                             <td>{instructor.firstName}</td>
//                             <td>{instructor.email}</td>
//                             <td>{instructor.phoneNumber}</td>
//                             <td>{instructor.adress}</td>
//                             <td>{instructor.speciality}</td>
//                             <td>
//                                 <button
//                                     className="btn btn-warning mr-2"
//                                     onClick={() => handleEdit(instructor)} // Fonction d'édition
//                                 >
//                                     Modifier
//                                 </button>
//                                 <button
//                                     className="btn btn-danger"
//                                     onClick={() => handleDelete(instructor.id)} // Fonction de suppression
//                                 >
//                                     Supprimer
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );

// };

// export default InstructorsPage; // Exportation du composant InstructorsPage

// // //Importation des dépendances nécessaires

// import React, { useState, useEffect } from 'react';
// import '../InstructorsPage/InstructorPage.css'; // Importation du fichier CSS pour le style
// import apiClient from '../../api/api-client'; // Importation de l'instance apiClient pour les requêtes API

// const InstructorsPage = () => {
//     // État pour stocker la liste des instructeurs
//     const [instructors, setInstructors] = useState([]);

//     // État pour gérer les données du formulaire
//     const [formData, setFormData] = useState({
//         lastName: '',
//         firstName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });

//     // État pour gérer l'instructeur en cours d'édition
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     // État pour contrôler l'affichage du formulaire
//     const [showForm, setShowForm] = useState(false);

//     // État pour les messages de succès et d'erreur
//     const [successMessage, setSuccessMessage] = useState('');
//     const [errorMessage, setErrorMessage] = useState('');

//     // Hook useEffect pour récupérer la liste des instructeurs lors du premier rendu
//     useEffect(() => {
//         fetchInstructors(); // Appel de la fonction pour récupérer les instructeurs
//     }, []);

//     // Fonction pour récupérer la liste des instructeurs
//     const fetchInstructors = async () => {
//         try {
//             const response = await apiClient.get('/instructor/getall'); // Requête GET pour récupérer tous les instructeurs
//             setInstructors(response.data); // Mise à jour de l'état avec les données récupérées
//         } catch (error) {
//             console.error("Erreur lors de la récupération des instructeurs:", error); // Gestion des erreurs
//         }
//     };

//     // Fonction pour gérer la soumission du formulaire
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Empêcher le comportement par défaut du formulaire
//         try {
//             // Vérifier si un instructeur est en cours d'édition
//             if (editingInstructor) {
//                 await apiClient.put(`/instructor/update/${editingInstructor.id}`, formData); // Requête PUT pour modifier l'instructeur
//                 setSuccessMessage('Un instructeur a bien été modifié'); // Message de succès
//             } else {
//                 await apiClient.post('/instructor/add', formData); // Requête POST pour ajouter un nouvel instructeur
//                 setSuccessMessage('Un instructeur a bien été ajouté'); // Message de succès
//             }

//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);

//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//             // Réinitialiser les champs du formulaire
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
//             setShowForm(false); // Masquer le formulaire
//             setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//         } catch (error) {
//             console.error("Erreur lors de l'ajout/modification de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de l\'ajout ou de la modification de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer les changements dans le formulaire
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value // Mettre à jour le champ correspondant dans formData
//         });
//     };

//     // Fonction pour gérer la suppression d'un instructeur
//     const handleDelete = async (id) => {
//         // Confirmation de la suppression
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet instructeur ?")) return;

//         try {
//             await apiClient.delete(`/instructor/delete/${id}`); // Requête DELETE pour supprimer l'instructeur
//             setSuccessMessage('Un instructeur a bien été supprimé'); // Message de succès
//             // Réinitialiser le message de succès après 3 secondes
//             setTimeout(() => {
//                 setSuccessMessage('');
//             }, 3000);
//             fetchInstructors(); // Rafraîchir la liste des instructeurs
//         } catch (error) {
//             console.error("Erreur lors de la suppression de l'instructeur:", error); // Gestion des erreurs
//             setErrorMessage('Erreur lors de la suppression de l\'instructeur'); // Message d'erreur
//             // Réinitialiser le message d'erreur après 3 secondes
//             setTimeout(() => {
//                 setErrorMessage('');
//             }, 3000);
//         }
//     };

//     // Fonction pour gérer l'édition d'un instructeur
//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor); // Définir l'instructeur à éditer
//         setFormData({
//             lastName: instructor.lastName,
//             firstName: instructor.firstName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality
//         });
//         setShowForm(true); // Afficher le formulaire
//     };

//     return (
//         <div className="container mt-5">
//             {/* Titre Centré */}
//             <h1 className="text-center-title">Liste des Instructeurs</h1>
            
//             {/* Bouton "Ajouter Instructeur" Centré */}
//             <div className="add-instructor-container">
//                 <button 
//                     className="btn btn-success mb-3 btn-add-instructor"
//                     onClick={() => setShowForm(!showForm)} // Alterner l'affichage du formulaire
//                 >
//                     {showForm ? 'Annuler' : 'Ajouter Instructeur'}
//                 </button>
//             </div>

//             {/* Messages de Succès et d'Erreur */}
//             {successMessage && (
//                 <div className={`alert alert-success`}>
//                     {successMessage} {/* Afficher le message de succès */}
//                 </div>
//             )}

//             {errorMessage && (
//                 <div className="alert alert-danger">
//                     {errorMessage} {/* Afficher le message d'erreur */}
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
//                                 {/* Champs du formulaire pour les détails de l'instructeur */}
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
//                                     {editingInstructor ? 'Modifier' : 'Ajouter'} {/* Texte du bouton selon l'état d'édition */}
//                                 </button>
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-danger btn-action"
//                                     onClick={() => {
//                                         setShowForm(false); // Masquer le formulaire
//                                         setEditingInstructor(null); // Réinitialiser l'instructeur en cours d'édition
//                                     }}
//                                 >
//                                     Annuler
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* Liste des instructeurs affichée */}
//             <table className="table table-bordered">
//                 <thead>
//                     <tr>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Email</th>
//                         <th>Téléphone</th>
//                         <th>Adresse</th>
//                         <th>Spécialité</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {instructors.map((instructor) => (
//                         <tr key={instructor.id}>
//                             <td>{instructor.lastName}</td>
//                             <td>{instructor.firstName}</td>
//                             <td>{instructor.email}</td>
//                             <td>{instructor.phoneNumber}</td>
//                             <td>{instructor.adress}</td>
//                             <td>{instructor.speciality}</td>
//                             <td>
//                                 <button className="btn btn-warning" onClick={() => handleEdit(instructor)}>Modifier</button> {/* Bouton Modifier */}
//                                 <button className="btn btn-danger" onClick={() => handleDelete(instructor.id)}>Supprimer</button> {/* Bouton Supprimer */}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// // Exportation du composant
// export default InstructorsPage;

