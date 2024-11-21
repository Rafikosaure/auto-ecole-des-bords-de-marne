import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';
import './InstructorProfilPage.css';

const InstructorProfilPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null); // Pour stocker le document sélectionné
    const cardRefs = useRef({}); // Stockage des références pour chaque type de carte

    const cardTypes = [
        "carte d'identité",
        "Permis de conduire",
        "Carte d'enseignement",
        "Contrat de travail",
    ];

    useEffect(() => {
        if (!id) {
            setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
            setLoading(false);
            return;
        }

        const fetchInstructor = async () => {
            try {
                const response = await apiClient.get(`/instructor/get/${id}`);
                setInstructor(response.data);
                setDocuments(response.data.documents || []);
            } catch (error) {
                setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [id]);

    const handleUpload = async (type, files) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        formData.append("documents", files[0]);
        formData.append("instructorId", id);
        formData.append("filesType", JSON.stringify([type]));

        try {
            const res = await apiClient.post("/instructor/document/add", formData);
            if (res.status === 200) {
                alert(`${type} téléchargé avec succès !`);
                fetchDocuments();
            } else {
                setError("Erreur lors du téléchargement du fichier.");
            }
        } catch (error) {
            setError("Erreur lors du téléchargement du fichier : " + error.message);
        }
    };

    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`/instructor/get/${id}`);
            setDocuments(response.data.documents || []);
        } catch (error) {
            setError("Erreur lors de la récupération des documents : " + error.message);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            return;
        }

        try {
            const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
            if (response.status === 200) {
                alert("Document supprimé avec succès");
                fetchDocuments();
            } else {
                setError("Erreur lors de la suppression du document.");
            }
        } catch (error) {
            setError("Erreur lors de la suppression du document : " + error.message);
        }
    };

    // Fonction pour ouvrir la modale
    const openDocument = (document) => {
        setSelectedDocument(document);
    };

    // Fonction pour fermer la modale
    const closeDocument = () => {
        setSelectedDocument(null);
    };

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const displayCards = cardTypes.map((type) => {
        const document = documents.find((doc) => doc.type === type);

        return (
            <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
                key={type}
                style={{ cursor: 'default' }}
            >
                <div
                    className="card"
                    style={{ border: '1px solid black', borderRadius: '5px' }}
                >
                    <div className="card-body" style={{ padding: '0px' }}>
                        <h5
                            className="card-title"
                            onClick={() => cardRefs.current[type]?.click()} // Téléchargement activé uniquement sur le titre
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {type}
                        </h5>
                        <div
                            style={{
                                height: '200px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid black',
                                borderRadius: '5px',
                                overflow: 'hidden',
                            }}
                            onClick={() => document && openDocument(document)} // Ouvre le document dans la modale
                        >
                            {document ? (
                                document.baseExtension !== "pdf" ? (
                                    <img
                                        style={{ height: "100%", width: "auto", objectFit: "contain" }}
                                        src={`data:image/${document.baseExtension};base64, ${document.document}`}
                                        alt={type}
                                    />
                                ) : (
                                    <iframe
                                        src={`data:application/${document.baseExtension};base64,${document.document}`}
                                        title={type}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                )
                            ) : (
                                <p className="text-center">Aucun document</p>
                            )}
                        </div>
                        {document && (
                            <button
                                className="btn btn-danger mt-2 w-100"
                                onClick={(e) => {
                                    e.stopPropagation(); // Empêche la propagation vers le clic de la carte
                                    handleDelete(document.id); // Passe l'ID du document à supprimer
                                }}
                            >
                                Supprimer
                            </button>
                        )}
                    </div>
                </div>
                <input
                    type="file"
                    ref={(el) => (cardRefs.current[type] = el)} // Associe chaque type de carte à son champ input
                    style={{ display: 'none' }}
                    onChange={(e) => handleUpload(type, e.target.files)}
                />
            </div>
        );
    });


    return (
        <div className="container mt-5">
            <h1 className="text-center">Détails de l'instructeur</h1>

            {instructor && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Informations de l'instructeur</h5>
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
            )}

            <div className="row">
                {displayCards}
            </div>

            {/* Modale pour afficher le document */}
            {selectedDocument && (
                <div className="modal" style={{ display: 'block', position: 'fixed', top: '0', left: '0', right: '0', zIndex: 1050 }}>
                    <div className="modal-dialog" style={{ maxWidth: '90%', marginTop: '10px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Document : {selectedDocument.type}</h5>
                            </div>
                            <div className="modal-body">
                                {selectedDocument.baseExtension !== "pdf" ? (
                                    <img
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        src={`data:image/${selectedDocument.baseExtension};base64,${selectedDocument.document}`}
                                        alt={selectedDocument.type}
                                    />
                                ) : (
                                    <iframe
                                        src={`data:application/pdf;base64,${selectedDocument.document}`}
                                        title={`Document PDF - ${selectedDocument.type}`}
                                        style={{ width: '100%', height: '500px' }}
                                        frameBorder="0"
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={closeDocument}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
                    Retour aux formateurs
                </button>
            </div>
        </div>
    );
};



export default InstructorProfilPage;

