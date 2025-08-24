import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../api/api-client';
import './InstructorProfilPage.css';


const InstructorProfilPage = () => {

    const { id } = useParams();
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const cardRefs = useRef({});

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

    const openDocument = (document) => {
        setSelectedDocument(document);
    };

    const closeDocument = () => {
        setSelectedDocument(null);
    };

    const openFileInput = (type) => {
        cardRefs.current[type]?.click();
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
                style={{ cursor: 'pointer' }}
            >
                <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }}>
                    <div className="card-body" style={{ padding: '0px' }}>
                        <h5
                            className="card-title"
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openFileInput(type); // Ouvre l'input pour l'upload
                            }}
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
                            onClick={() => document && openDocument(document)} // L'ouverture de la modale se fait par le bouton "Agrandir"
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
                                        src={`data:application/pdf;base64,${document.document}`}
                                        title={`Document PDF - ${type}`} // Ajout du titre unique pour l'iframe
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                )
                            ) : (
                                <p className="text-center">Aucun document</p>
                            )}
                        </div>
                        <div className="d-flex flex-column">
                            <button
                                className="btn btn-primary mt-2 w-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openFileInput(type); // Ouvre le sélecteur de fichier pour l'upload
                                }}
                            >
                                Télécharger
                            </button>
                            <button
                                className="btn btn-info mt-2 w-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openDocument(document); // Ouvre la modale lorsqu'on clique sur "Agrandir"
                                }}
                            >
                                Agrandir
                            </button>
                            {document && (
                                <button
                                    className="btn btn-danger mt-2 w-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(document.id);
                                    }}
                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <input
                    type="file"
                    ref={(el) => (cardRefs.current[type] = el)}
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

            {selectedDocument && (
                <div className="modal" style={{
                    display: 'block',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1050,
                    overflowY: 'auto'
                }}>
                    <div className="modal-dialog" style={{
                        maxWidth: '90%',
                        marginTop: '10px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}>
                        <div className="modal-content" style={{ height: '80vh' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Document {selectedDocument.type}</h5>
                                <button type="button" className="btn-close" onClick={closeDocument}></button>
                            </div>
                            <div className="modal-body">
                                {selectedDocument.baseExtension !== "pdf" ? (
                                    <img
                                        style={{ width: "100%", height: "auto", objectFit: "contain" }}
                                        src={`data:image/${selectedDocument.baseExtension};base64, ${selectedDocument.document}`}
                                        alt={selectedDocument.type}
                                    />
                                ) : (
                                    <iframe
                                        src={`data:application/pdf;base64,${selectedDocument.document}`}
                                        title={`Document PDF - ${selectedDocument.type}`}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={closeDocument}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InstructorProfilPage;