
// // src/pages/InstructorPage/InstructorProfilPage.jsx TEST avec boutton "retour à la la liste des moniteurs",
//"télécharger" n et bouton "déconnexion"


// src/pages/InstructorPage/InstructorProfilPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';

const InstructorProfilPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await apiClient.get(`/instructor/get/${id}`);
                setInstructor(response.data);
            } catch (error) {
                setError("Erreur lors de la récupération des détails du moniteur");
            } finally {
                setLoading(false);
            }
        };
        fetchInstructor();
    }, [id]);

    const handleBackToList = () => {
        navigate('/instructors');
    };

    const handleDownloadDocuments = () => {
        // Logique pour télécharger les documents du moniteur
        alert("Téléchargement des documents du moniteur en cours...");
    };

    const handleLogout = () => {
        // Logique pour déconnecter l'utilisateur
        navigate('/connexion');
    };

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Détails du Moniteur</h1>

            {instructor ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <div className="d-flex flex-wrap">
                            <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
                            <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
                            <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
                            <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
                            <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
                            <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Aucun moniteur trouvé</div>
            )}

            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={handleBackToList}>
                    Retour à la liste des moniteurs
                </button>
                <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
                    Télécharger les documents
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default InstructorProfilPage;




// // src/pages/InstructorPage/InstructorProfilPage.jsx
// //creation de la page avec info sur le moniteur, il manque le telechargement des documents et du bouton déconnexion 


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; // Pour obtenir l'ID du moniteur depuis l'URL et la navigation
// import apiClient from '../../api/api-client';


// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupérer l'ID du moniteur depuis l'URL
//     const navigate = useNavigate(); // Pour rediriger vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocker les données du moniteur
//     const [loading, setLoading] = useState(true); // Indicateur de chargement
//     const [error, setError] = useState(''); // Stocker les erreurs

//     // Récupérer les données du moniteur avec l'ID depuis l'API
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Mettre à jour les données du moniteur
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false); // Désactiver le chargement après la requête
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     // Fonction pour retourner à la liste des moniteurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Affichage pendant le chargement
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affichage en cas d'erreur
//     if (error) {
//         return <div>{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails du Moniteur</h1>

//             {/* Vérifier si les données du moniteur existent */}
//             {instructor ? (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Nom : {instructor.lastName}</h5>
//                         <p className="card-text"><strong>Prénom :</strong> {instructor.firstName}</p>
//                         <p className="card-text"><strong>Email :</strong> {instructor.email}</p>
//                         <p className="card-text"><strong>Téléphone :</strong> {instructor.phoneNumber}</p>
//                         <p className="card-text"><strong>Adresse :</strong> {instructor.adress}</p>
//                         <p className="card-text"><strong>Spécialités :</strong> {instructor.speciality}</p>
//                     </div>
//                 </div>
//             ) : (
//                 <div>Aucun moniteur trouvé</div>
//             )}

//             {/* Bouton pour retourner à la liste des moniteurs */}
//             <div className="text-center">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;
