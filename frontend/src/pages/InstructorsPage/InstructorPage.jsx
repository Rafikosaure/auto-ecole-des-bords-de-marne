


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../InstructorsPage/InstructorPage.css';

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

    // Fetch all instructors when the component is mounted
    useEffect(() => {
        fetchInstructors();
    }, []);

    // Fetch all instructors from the API
    const fetchInstructors = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/instructor/getall');
            setInstructors(response.data);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };

    // Handle form submission for adding a new instructor
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInstructor) {
                // Update existing instructor
                await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
                alert('Instructeur modifié avec succès');
                setEditingInstructor(null);
            } else {
                // Add new instructor
                await axios.post('http://localhost:3001/api/instructor/add', formData);
                alert('Instructeur ajouté avec succès');
            }
            fetchInstructors(); // Refresh the list of instructors
            setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Handle form changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle deleting an instructor
    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
            try {
                await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
                alert('Instructeur supprimé avec succès');
                fetchInstructors(); // Refresh the list of instructors
            } catch (error) {
                console.error("Error deleting instructor:", error);
            }
        }
    };

    // Handle editing an instructor
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
    };

    return (
        <div className="container mt-5">
            <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

            {/* Form to add or edit an instructor styled with Bootstrap */}
            <div className="card mb-5">
                <div className="card-header">
                    {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
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
                        {/* Align the buttons to the right */}
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary btn-custom me-2">
                                {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
                            </button>
                            {editingInstructor && (
                                <button 
                                    type="button" 
                                    className="btn btn-secondary btn-custom"
                                    onClick={() => setEditingInstructor(null)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
           
                <h1> Liste des Instructeurs</h1>
                <div className="card mb-5">
                Liste des Instructeurs
                <div className="card-header">
                 
                </div>
                <div className="card-body">
           
                    <div className="table-responsive">
                        {/* Display as table on larger screens */}
                        <table className="table table-bordered">
    <thead>
        <tr>
            <th scope="col"></th>
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
                <td data-label="Nom Complet">{instructor.lastName} {instructor.firstName}</td>
                <td data-label="Email">{instructor.email}</td>
                <td data-label="Téléphone">{instructor.phoneNumber}</td>
                <td data-label="Adresse">{instructor.adress}</td>
                <td data-label="Spécialité">{instructor.speciality}</td>
                <td data-label="Actions">
                    <button 
                        className="btn btn-warning btn-sm btn-custom"
                        onClick={() => handleEdit(instructor)}
                    >
                        Modifier
                    </button>
                    <button 
                        className="btn btn-danger btn-sm btn-custom"
                        onClick={() => handleDelete(instructor.id)}
                    >
                        Supprimer
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
</table>

                        {/* Display as cards on smaller screens */}
                        <div className="d-md-none">
                            {instructors.map((instructor, index) => (
                                <div key={instructor.id} className="card mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
                                        <p className="card-text">
                                            <strong>Email:</strong> {instructor.email}<br />
                                            <strong>Téléphone:</strong> {instructor.phoneNumber}<br />
                                            <strong>Adresse:</strong> {instructor.adress}<br />
                                            <strong>Spécialité:</strong> {instructor.speciality}
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            <button 
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(instructor)}
                                            >
                                                Modifier
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm"
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row">
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="lastName"
//                                     placeholder="Nom"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="firstName"
//                                     placeholder="Prénom"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="email"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="phoneNumber"
//                                     placeholder="Téléphone"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="adress"
//                                     placeholder="Adresse"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="auto"
//                                         checked={formData.speciality === 'auto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Auto</label>
//                                 </div>
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="moto"
//                                         checked={formData.speciality === 'moto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Moto</label>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Align the buttons to the right */}
//                         <div className="text-end">
//                             <button type="submit" className="btn btn-primary btn-custom me-2">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary btn-custom"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
           
//                 <h1> Liste des Instructeurs</h1>
//                 <div className="card mb-5">
//                 Liste des Instructeurs
//                 <div className="card-header">
                 
//                 </div>
//                 <div className="card-body">
           
//                     <div className="table-responsive">
//                         {/* Display as table on larger screens */}
//                         <table className="table table-bordered d-none d-md-table">
//                             <thead>
//                                 <tr>
//                                     <th scope="col"></th>
//                                     <th scope="col">Nom Complet</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                     <th scope="col">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {instructors.map((instructor, index) => (
//                                     <tr key={instructor.id}>
//                                         <th scope="row">{index + 1}</th>
//                                         <td>{instructor.lastName} {instructor.firstName}</td>
//                                         <td>{instructor.email}</td>
//                                         <td>{instructor.phoneNumber}</td>
//                                         <td>{instructor.adress}</td>
//                                         <td>{instructor.speciality}</td>
//                                         <td>
//                                             <div className="d-flex justify-content-between">
//                                                 <button 
//                                                     className="btn btn-warning btn-sm btn-custom me-2"
//                                                     onClick={() => handleEdit(instructor)}
//                                                 >
//                                                     Modifier
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-danger btn-sm btn-custom"
//                                                     onClick={() => handleDelete(instructor.id)}
//                                                 >
//                                                     Supprimer
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>

//                         {/* Display as cards on smaller screens */}
//                         <div className="d-md-none">
//                             {instructors.map((instructor, index) => (
//                                 <div key={instructor.id} className="card mb-3">
//                                     <div className="card-body">
//                                         <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
//                                         <p className="card-text">
//                                             <strong>Email:</strong> {instructor.email}<br />
//                                             <strong>Téléphone:</strong> {instructor.phoneNumber}<br />
//                                             <strong>Adresse:</strong> {instructor.adress}<br />
//                                             <strong>Spécialité:</strong> {instructor.speciality}
//                                         </p>
//                                         <div className="d-flex justify-content-between">
//                                             <button 
//                                                 className="btn btn-warning btn-sm"
//                                                 onClick={() => handleEdit(instructor)}
//                                             >
//                                                 Modifier
//                                             </button>
//                                             <button 
//                                                 className="btn btn-danger btn-sm"
//                                                 onClick={() => handleDelete(instructor.id)}
//                                             >
//                                                 Supprimer
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row">
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="lastName"
//                                     placeholder="Nom"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="firstName"
//                                     placeholder="Prénom"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="email"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="phoneNumber"
//                                     placeholder="Téléphone"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="adress"
//                                     placeholder="Adresse"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="auto"
//                                         checked={formData.speciality === 'auto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Auto</label>
//                                 </div>
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="moto"
//                                         checked={formData.speciality === 'moto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Moto</label>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Align the buttons to the right */}
//                         <div className="text-end">
//                             <button type="submit" className="btn btn-primary btn-custom me-2">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary btn-custom"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     Liste des Instructeurs
//                 </div>
//                 <div className="card-body">
//                     <div className="d-none d-md-block">
//                         {/* Display as table on larger screens */}
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th scope="col"></th>
//                                     <th scope="col">Nom Complet</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                     <th scope="col">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {instructors.map((instructor, index) => (
//                                     <tr key={instructor.id}>
//                                         <th scope="row">{index + 1}</th>
//                                         <td>{instructor.lastName} {instructor.firstName}</td>
//                                         <td>{instructor.email}</td>
//                                         <td>{instructor.phoneNumber}</td>
//                                         <td>{instructor.adress}</td>
//                                         <td>{instructor.speciality}</td>
//                                         <td>
//                                             <div className="d-flex justify-content-between">
//                                                 <button 
//                                                     className="btn btn-warning btn-sm btn-custom me-2"
//                                                     onClick={() => handleEdit(instructor)}
//                                                 >
//                                                     Modifier
//                                                 </button>
//                                                 <button 
//                                                     className="btn btn-danger btn-sm btn-custom"
//                                                     onClick={() => handleDelete(instructor.id)}
//                                                 >
//                                                     Supprimer
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                     <div className="d-md-none">
//                         {/* Display as cards on smaller screens */}
//                         {instructors.map((instructor, index) => (
//                             <div key={instructor.id} className="card mb-3">
//                                 <div className="card-body">
//                                     <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
//                                     <p className="card-text">
//                                         <strong>Email:</strong> {instructor.email}<br />
//                                         <strong>Téléphone:</strong> {instructor.phoneNumber}<br />
//                                         <strong>Adresse:</strong> {instructor.adress}<br />
//                                         <strong>Spécialité:</strong> {instructor.speciality}
//                                     </p>
//                                     <div className="d-flex justify-content-between">
//                                         <button 
//                                             className="btn btn-warning btn-sm btn-custom me-2"
//                                             onClick={() => handleEdit(instructor)}
//                                         >
//                                             Modifier
//                                         </button>
//                                         <button 
//                                             className="btn btn-danger btn-sm btn-custom"
//                                             onClick={() => handleDelete(instructor.id)}
//                                         >
//                                             Supprimer
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row">
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="lastName"
//                                     placeholder="Nom"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="firstName"
//                                     placeholder="Prénom"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="email"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="phoneNumber"
//                                     placeholder="Téléphone"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="adress"
//                                     placeholder="Adresse"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6 mb-3">
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="auto"
//                                         checked={formData.speciality === 'auto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Auto</label>
//                                 </div>
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="moto"
//                                         checked={formData.speciality === 'moto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Moto</label>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Align the buttons to the right */}
//                         <div className="text-end">
//                             <button type="submit" className="btn btn-primary btn-custom me-2">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary btn-custom"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     Liste des Instructeurs
//                 </div>
//                 <div className="card-body">
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th scope="col"></th>
//                                 <th scope="col">Nom Complet</th>
//                                 <th scope="col">Email</th>
//                                 <th scope="col">Téléphone</th>
//                                 <th scope="col">Adresse</th>
//                                 <th scope="col">Spécialité</th>
//                                 <th scope="col">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {instructors.map((instructor, index) => (
//                                 <tr key={instructor.id}>
//                                     <th scope="row">{index + 1}</th>
//                                     <td>{instructor.lastName} {instructor.firstName}</td>
//                                     <td>{instructor.email}</td>
//                                     <td>{instructor.phoneNumber}</td>
//                                     <td>{instructor.adress}</td>
//                                     <td>{instructor.speciality}</td>
//                                     <td>
//                                         <div className="d-flex justify-content-between">
//                                             <button 
//                                                 className="btn btn-warning btn-sm btn-custom me-2"
//                                                 onClick={() => handleEdit(instructor)}
//                                             >
//                                                 Modifier
//                                             </button>
//                                             <button 
//                                                 className="btn btn-danger btn-sm btn-custom"
//                                                 onClick={() => handleDelete(instructor.id)}
//                                             >
//                                                 Supprimer
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         fullName: '', // Remplace 'lastName' et 'firstName'
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors();
//             setFormData({ fullName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors();
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             fullName: `${instructor.lastName} ${instructor.firstName}`, // Combine lastName et firstName
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality
//         });
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Formulaire responsive avec Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row g-3">
//                             <div className="col-md-3 col-sm-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="fullName"
//                                     placeholder="Nom Complet"
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-3 col-sm-6">
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="email"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-3 col-sm-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="phoneNumber"
//                                     placeholder="Téléphone"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-3 col-sm-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="adress"
//                                     placeholder="Adresse"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-12">
//                                 <label className="form-label">Spécialité</label>
//                                 <div className="form-check form-check-inline">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="auto"
//                                         checked={formData.speciality === 'auto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Auto</label>
//                                 </div>
//                                 <div className="form-check form-check-inline">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="moto"
//                                         checked={formData.speciality === 'moto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Moto</label>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Alignement du bouton responsive */}
//                         <div className="text-end mt-3">
//                             <button type="submit" className="btn btn-primary">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary ms-2"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Tableau responsive */}
//             <div className="container mt-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <div className="table-responsive">
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Nom Complet</th>
//                                 <th>Email</th>
//                                 <th>Téléphone</th>
//                                 <th>Adresse</th>
//                                 <th>Spécialité</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {instructors.map((instructor, index) => (
//                                 <tr key={instructor.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{instructor.lastName} {instructor.firstName}</td>
//                                     <td>{instructor.email}</td>
//                                     <td>{instructor.phoneNumber}</td>
//                                     <td>{instructor.adress}</td>
//                                     <td>{instructor.speciality}</td>
//                                     <td>
//                                         <button 
//                                             className="btn btn-warning btn-sm"
//                                             onClick={() => handleEdit(instructor)}
//                                         >
//                                             Modifier
//                                         </button>
//                                         <button 
//                                             className="btn btn-danger btn-sm ms-2"
//                                             onClick={() => handleDelete(instructor.id)}
//                                         >
//                                             Supprimer
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../InstructorsPage/InstructorPage.css'; // Peut être supprimé si non utilisé

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         fullName: '', // Remplace 'lastName' et 'firstName'
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors();
//             setFormData({ fullName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors();
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             fullName: `${instructor.lastName} ${instructor.firstName}`, // Combine lastName et firstName
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality
//         });
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Formulaire responsive avec Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="row g-3">
//                             <div className="col-md-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="fullName"
//                                     placeholder="Nom Complet"
//                                     value={formData.fullName}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <input
//                                     type="email"
//                                     className="form-control"
//                                     name="email"
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="phoneNumber"
//                                     placeholder="Téléphone"
//                                     value={formData.phoneNumber}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <input
//                                     type="text"
//                                     className="form-control"
//                                     name="adress"
//                                     placeholder="Adresse"
//                                     value={formData.adress}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                             <div className="col-md-12">
//                                 <label className="form-label">Spécialité</label>
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="auto"
//                                         checked={formData.speciality === 'auto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Auto</label>
//                                 </div>
//                                 <div className="form-check">
//                                     <input
//                                         type="radio"
//                                         className="form-check-input"
//                                         name="speciality"
//                                         value="moto"
//                                         checked={formData.speciality === 'moto'}
//                                         onChange={handleChange}
//                                     />
//                                     <label className="form-check-label">Moto</label>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Alignement du bouton responsive */}
//                         <div className="text-end mt-3">
//                             <button type="submit" className="btn btn-primary">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary ms-2"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Tableau responsive */}
//             <div className="container mt-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <div className="table-responsive">
//                     <table className="table table-bordered">
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Nom Complet</th>
//                                 <th>Email</th>
//                                 <th>Téléphone</th>
//                                 <th>Adresse</th>
//                                 <th>Spécialité</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {instructors.map((instructor, index) => (
//                                 <tr key={instructor.id}>
//                                     <td>{index + 1}</td>
//                                     <td>{instructor.lastName} {instructor.firstName}</td>
//                                     <td>{instructor.email}</td>
//                                     <td>{instructor.phoneNumber}</td>
//                                     <td>{instructor.adress}</td>
//                                     <td>{instructor.speciality}</td>
//                                     <td>
//                                         <button 
//                                             className="btn btn-warning btn-sm"
//                                             onClick={() => handleEdit(instructor)}
//                                         >
//                                             Modifier
//                                         </button>
//                                         <button 
//                                             className="btn btn-danger btn-sm ms-2"
//                                             onClick={() => handleDelete(instructor.id)}
//                                         >
//                                             Supprimer
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th scope="col"></th>
//                                     <th scope="col">Nom</th>
//                                     <th scope="col">Prénom</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>1</td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             placeholder="Nom"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="firstName"
//                                             placeholder="Prénom"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email"
//                                             placeholder="Email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phoneNumber"
//                                             placeholder="Téléphone"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="adress"
//                                             placeholder="Adresse"
//                                             value={formData.adress}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="auto"
//                                                 checked={formData.speciality === 'auto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Auto</label>
//                                         </div>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="moto"
//                                                 checked={formData.speciality === 'moto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Moto</label>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         {/* Align the button to the right */}
//                         <div className="text-end">
//                             <button type="submit" className="btn btn-primary btn-custom">
//                                 {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
//                             </button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary btn-custom btn-annuler"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="container mt-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th scope="col"></th>
//                             <th scope="col">Nom Complet</th>
//                             <th scope="col">Email</th>
//                             <th scope="col">Téléphone</th>
//                             <th scope="col">Adresse</th>
//                             <th scope="col">Spécialité</th>
//                             <th scope="col">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {instructors.map((instructor, index) => (
//                             <tr key={instructor.id}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{instructor.lastName} {instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     <button 
//                                         className="btn btn-warning btn-sm btn-custom"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     <button 
//                                         className="btn btn-danger btn-sm btn-custom"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th scope="col"></th>
//                                     <th scope="col">Nom</th>
//                                     <th scope="col">Prénom</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>1</td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             placeholder="Nom"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="firstName"
//                                             placeholder="Prénom"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email"
//                                             placeholder="Email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phoneNumber"
//                                             placeholder="Téléphone"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="adress"
//                                             placeholder="Adresse"
//                                             value={formData.adress}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="auto"
//                                                 checked={formData.speciality === 'auto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Auto</label>
//                                         </div>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="moto"
//                                                 checked={formData.speciality === 'moto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Moto</label>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <div className="d-flex justify-content-center">
//                             <button type="submit" className="btn btn-primary btn-custom">{editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}</button>
//                             {editingInstructor && (
//                                 <button 
//                                     type="button" 
//                                     className="btn btn-secondary btn-custom btn-annuler"
//                                     onClick={() => setEditingInstructor(null)}
//                                 >
//                                     Annuler
//                                 </button>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="container mt-5 mb-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th scope="col"></th>
//                             <th scope="col">Nom Complet</th>
//                             <th scope="col">Email</th>
//                             <th scope="col">Téléphone</th>
//                             <th scope="col">Adresse</th>
//                             <th scope="col">Spécialité</th>
//                             <th scope="col">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {instructors.map((instructor, index) => (
//                             <tr key={instructor.id}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{instructor.lastName} {instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     <button 
//                                         className="btn btn-warning btn-sm btn-custom"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     <button 
//                                         className="btn btn-danger btn-sm btn-custom"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
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

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
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
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th scope="col"></th>
//                                     <th scope="col">Nom</th>
//                                     <th scope="col">Prénom</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>1</td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             placeholder="Nom"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="firstName"
//                                             placeholder="Prénom"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email"
//                                             placeholder="Email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phoneNumber"
//                                             placeholder="Téléphone"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="adress"
//                                             placeholder="Adresse"
//                                             value={formData.adress}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="auto"
//                                                 checked={formData.speciality === 'auto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Auto</label>
//                                         </div>
//                                         <div className="form-check">
//                                             <input
//                                                 type="radio"
//                                                 className="form-check-input"
//                                                 name="speciality"
//                                                 value="moto"
//                                                 checked={formData.speciality === 'moto'}
//                                                 onChange={handleChange}
//                                             />
//                                             <label className="form-check-label">Moto</label>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <button type="submit" className="btn btn-primary">{editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}</button>
//                         {editingInstructor && (
//                             <button 
//                                 type="button" 
//                                 className="btn btn-secondary ml-2"
//                                 onClick={() => setEditingInstructor(null)}
//                             >
//                                 Annuler
//                             </button>
//                         )}
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="container mt-5 mb-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th scope="col"></th>
//                             <th scope="col">Nom Complet</th>
//                             <th scope="col">Email</th>
//                             <th scope="col">Téléphone</th>
//                             <th scope="col">Adresse</th>
//                             <th scope="col">Spécialité</th>
//                             <th scope="col">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {instructors.map((instructor, index) => (
//                             <tr key={instructor.id}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{instructor.lastName} {instructor.firstName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     {/* Edit button */}
//                                     <button 
//                                         className="btn btn-warning btn-sm mr-2"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     {/* Delete button */}
//                                     <button 
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;



// // InstructorPage.jsx VERSION OK  SANS RESPONSIVE 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const InstructorsPage = () => {
//     const [instructors, setInstructors] = useState([]);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         phoneNumber: '',
//         adress: '',
//         speciality: ''
//     });
//     const [editingInstructor, setEditingInstructor] = useState(null);

//     // Fetch all instructors when the component is mounted
//     useEffect(() => {
//         fetchInstructors();
//     }, []);

//     // Fetch all instructors from the API
//     const fetchInstructors = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/instructor/getall');
//             setInstructors(response.data);
//         } catch (error) {
//             console.error("Error fetching instructors:", error);
//         }
//     };

//     // Handle form submission for adding a new instructor
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (editingInstructor) {
//                 // Update existing instructor
//                 await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
//                 alert('Instructeur modifié avec succès');
//                 setEditingInstructor(null);
//             } else {
//                 // Add new instructor
//                 await axios.post('http://localhost:3001/api/instructor/add', formData);
//                 alert('Instructeur ajouté avec succès');
//             }
//             fetchInstructors(); // Refresh the list of instructors
//             setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', adress: '', speciality: '' }); // Reset the form
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     // Handle form changes
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     // Handle deleting an instructor
//     const handleDelete = async (id) => {
//         if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
//             try {
//                 await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
//                 alert('Instructeur supprimé avec succès');
//                 fetchInstructors(); // Refresh the list of instructors
//             } catch (error) {
//                 console.error("Error deleting instructor:", error);
//             }
//         }
//     };

//     // Handle editing an instructor
//     const handleEdit = (instructor) => {
//         setEditingInstructor(instructor);
//         setFormData({
//             firstName: instructor.firstName,
//             lastName: instructor.lastName,
//             email: instructor.email,
//             phoneNumber: instructor.phoneNumber,
//             adress: instructor.adress,
//             speciality: instructor.speciality
//         });
//     };

//     return (
//         <div className="container mt-5">
//             <h1>{editingInstructor ? 'Modifier Instructeur' : 'Ajout des Instructeurs'}</h1>

//             {/* Form to add or edit an instructor styled with Bootstrap */}
//             <div className="card mb-5">
//                 <div className="card-header">
//                     {editingInstructor ? 'Formulaire de Modification' : 'Formulaire d\'ajout'}
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleSubmit}>
//                         <table className="table table-bordered">
//                             <thead>
//                                 <tr>
//                                     <th scope="col">#</th>
//                                     <th scope="col">Prénom</th>
//                                     <th scope="col">Nom</th>
//                                     <th scope="col">Email</th>
//                                     <th scope="col">Téléphone</th>
//                                     <th scope="col">Adresse</th>
//                                     <th scope="col">Spécialité</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>1</td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="firstName"
//                                             placeholder="Prénom"
//                                             value={formData.firstName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="lastName"
//                                             placeholder="Nom"
//                                             value={formData.lastName}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="email"
//                                             className="form-control"
//                                             name="email"
//                                             placeholder="Email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="phoneNumber"
//                                             placeholder="Téléphone"
//                                             value={formData.phoneNumber}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="adress"
//                                             placeholder="Adresse"
//                                             value={formData.adress}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                     <td>
//                                         <input
//                                             type="text"
//                                             className="form-control"
//                                             name="speciality"
//                                             placeholder="Spécialité"
//                                             value={formData.speciality}
//                                             onChange={handleChange}
//                                         />
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <button type="submit" className="btn btn-primary">{editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}</button>
//                         {editingInstructor && (
//                             <button 
//                                 type="button" 
//                                 className="btn btn-secondary ml-2"
//                                 onClick={() => setEditingInstructor(null)}
//                             >
//                                 Annuler
//                             </button>
//                         )}
//                     </form>
//                 </div>
//             </div>

//             {/* Display the list of instructors in a Bootstrap table with edit and delete buttons */}
//             <div className="container mt-5 mb-5">
//                 <h2>Liste des Instructeurs</h2>
//                 <table className="table table-bordered">
//                     <thead>
//                         <tr>
//                             <th scope="col">#</th>
//                             <th scope="col">Nom Complet</th>
//                             <th scope="col">Email</th>
//                             <th scope="col">Téléphone</th>
//                             <th scope="col">Adresse</th>
//                             <th scope="col">Spécialité</th>
//                             <th scope="col">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {instructors.map((instructor, index) => (
//                             <tr key={instructor.id}>
//                                 <th scope="row">{index + 1}</th>
//                                 <td>{instructor.firstName} {instructor.lastName}</td>
//                                 <td>{instructor.email}</td>
//                                 <td>{instructor.phoneNumber}</td>
//                                 <td>{instructor.adress}</td>
//                                 <td>{instructor.speciality}</td>
//                                 <td>
//                                     {/* Edit button */}
//                                     <button 
//                                         className="btn btn-warning btn-sm mr-2"
//                                         onClick={() => handleEdit(instructor)}
//                                     >
//                                         Modifier
//                                     </button>
//                                     {/* Delete button */}
//                                     <button 
//                                         className="btn btn-danger btn-sm"
//                                         onClick={() => handleDelete(instructor.id)}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default InstructorsPage;
