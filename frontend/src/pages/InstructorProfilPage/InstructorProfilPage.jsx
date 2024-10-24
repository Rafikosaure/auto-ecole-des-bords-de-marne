// src/pages/InstructorPage/InstructorProfilPage.jsx
//creation de la page avec info sur le moniteur, il manque le telechargement des documents et du bouton déconnexion 


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pour obtenir l'ID du moniteur depuis l'URL et la navigation
import apiClient from '../../api/api-client';


const InstructorProfilPage = () => {
    const { id } = useParams(); // Récupérer l'ID du moniteur depuis l'URL
    const navigate = useNavigate(); // Pour rediriger vers d'autres pages
    const [instructor, setInstructor] = useState(null); // Stocker les données du moniteur
    const [loading, setLoading] = useState(true); // Indicateur de chargement
    const [error, setError] = useState(''); // Stocker les erreurs

    // Récupérer les données du moniteur avec l'ID depuis l'API
    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await apiClient.get(`/instructor/get/${id}`);
                setInstructor(response.data); // Mettre à jour les données du moniteur
            } catch (error) {
                setError("Erreur lors de la récupération des détails du moniteur");
            } finally {
                setLoading(false); // Désactiver le chargement après la requête
            }
        };
        fetchInstructor();
    }, [id]);

    // Fonction pour retourner à la liste des moniteurs
    const handleBackToList = () => {
        navigate('/instructors');
    };

    // Affichage pendant le chargement
    if (loading) {
        return <div>Chargement des données...</div>;
    }

    // Affichage en cas d'erreur
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Détails du Moniteur</h1>

            {/* Vérifier si les données du moniteur existent */}
            {instructor ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Nom : {instructor.lastName}</h5>
                        <p className="card-text"><strong>Prénom :</strong> {instructor.firstName}</p>
                        <p className="card-text"><strong>Email :</strong> {instructor.email}</p>
                        <p className="card-text"><strong>Téléphone :</strong> {instructor.phoneNumber}</p>
                        <p className="card-text"><strong>Adresse :</strong> {instructor.adress}</p>
                        <p className="card-text"><strong>Spécialités :</strong> {instructor.speciality}</p>
                    </div>
                </div>
            ) : (
                <div>Aucun moniteur trouvé</div>
            )}

            {/* Bouton pour retourner à la liste des moniteurs */}
            <div className="text-center">
                <button className="btn btn-primary" onClick={handleBackToList}>
                    Retour à la liste des moniteurs
                </button>
            </div>
        </div>
    );
};

export default InstructorProfilPage;
