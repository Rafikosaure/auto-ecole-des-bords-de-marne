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
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/instructor/getall');
            setInstructors(response.data);
        } catch (error) {
            console.error("Error fetching instructors:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingInstructor) {
                await axios.put(`http://localhost:3001/api/instructor/update/${editingInstructor.id}`, formData);
                alert('Instructeur modifié avec succès');
                setEditingInstructor(null);
            } else {
                await axios.post('http://localhost:3001/api/instructor/add', formData);
                alert('Instructeur ajouté avec succès');
            }
            fetchInstructors();
            setFormData({ lastName: '', firstName: '', email: '', phoneNumber: '', adress: '', speciality: '' });
            setShowForm(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
            try {
                await axios.delete(`http://localhost:3001/api/instructor/delete/${id}`);
                alert('Instructeur supprimé avec succès');
                fetchInstructors();
            } catch (error) {
                console.error("Error deleting instructor:", error);
            }
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
            <h1>Liste des Instructeurs</h1>

            <button 
                className="btn btn-success mb-3 btn-standard"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Annuler' : 'Ajouter Instructeur'}
            </button>

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
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="adress"
                                        placeholder="Adresse"
                                        value={formData.adress}
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
                            <div className="text-end">
                                <button type="submit" className="btn btn-success btn-standard me-2">
                                    {editingInstructor ? 'Modifier' : 'Ajouter Instructeur'}
                                </button>
                                {editingInstructor && (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-standard"
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

            <div className="instructors-container">
                <div className="card mb-5">
                    <div className="card-header">Liste des Instructeurs</div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered d-none d-md-table">
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
                                            <td>{instructor.lastName} {instructor.firstName}</td>
                                            <td>{instructor.email}</td>
                                            <td>{instructor.phoneNumber}</td>
                                            <td>{instructor.adress}</td>
                                            <td>{instructor.speciality}</td>
                                            <td>
                                                <div className="d-flex justify-content-end">
                                                    <button 
                                                        className="btn btn-warning btn-standard me-2"
                                                        onClick={() => handleEdit(instructor)}
                                                    >
                                                        Modifier
                                                    </button>
                                                    <button 
                                                        className="btn btn-danger btn-standard"
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
                            <div className="d-md-none">
                                {instructors.map((instructor) => (
                                    <div key={instructor.id} className="card mb-3">
                                        <div className="card-body">
                                            <h5 className="card-title">{instructor.lastName} {instructor.firstName}</h5>
                                            <p className="card-text">
                                                <strong>Email:</strong> {instructor.email}<br />
                                                <strong>Téléphone:</strong> {instructor.phoneNumber}<br />
                                                <strong>Adresse:</strong> {instructor.adress}<br />
                                                <strong>Spécialité:</strong> {instructor.speciality}
                                            </p>
                                            <div className="d-flex justify-content-end">
                                                <button 
                                                    className="btn btn-warning btn-standard"
                                                    onClick={() => handleEdit(instructor)}
                                                >
                                                    Modifier
                                                </button>
                                                <button 
                                                    className="btn btn-danger btn-standard"
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

