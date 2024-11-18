import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';
import './InstructorProfilPage.css';

const InstructorProfilPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState(null);

    // Chargement des détails de l'instructeur
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

    // Sélection d'un fichier
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Téléchargement d'un fichier
    const handleFileUpload = async (documentType) => {
        if (!selectedFile) {
            setError("Veuillez sélectionner un fichier à télécharger.");
            return;
        }

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('documentType', documentType);  // Spécifie le type de document
        formData.append('instructorId', id);

        try {
            setUploading(true);
            const response = await apiClient.post(`/instructor/document/add`, formData);

            if (response.status === 200) {
                alert("Fichier téléchargé avec succès");
                setSelectedFile(null);
                fetchDocuments();
            } else {
                setError("Erreur lors du téléchargement du fichier. Statut: " + response.status);
            }
        } catch (error) {
            setError("Erreur lors du téléchargement du fichier. Détails: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Récupération des documents après chaque upload
    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`/instructor/get/${id}`);
            setDocuments(response.data.documents || []);
        } catch (error) {
            setError("Erreur lors de la récupération des documents : " + error.message);
        }
    };

    // Suppression d'un document
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
                setError("Erreur lors de la suppression du document. Statut: " + response.status);
            }
        } catch (error) {
            setError("Erreur lors de la suppression du document : " + error.message);
        }
    };

    // Ouvrir une carte pour le téléchargement d'un document
    const openCardForUpload = (documentType) => {
        setSelectedDocumentType(documentType);  // Spécifie le type de document à télécharger
    };

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

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

            {documents.length > 0 ? (
                <div className="row">
                    {documents.map((doc) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
                            <div 
                                className="card" 
                                style={{ border: '1px solid black', borderRadius: '5px' }}
                            >
                                <div className="card-body" style={{ padding: '0px' }}>
                                    <h5 className="card-title">{doc.type}</h5>
                                    <div style={{ 
                                        height: '200px', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        border: '1px solid black', 
                                        borderRadius: '5px', 
                                        overflow: 'hidden' 
                                    }}>
                                        {doc.baseExtension !== "pdf" ? (
                                            <img 
                                                style={{ height: "100%", width: "auto", objectFit: "contain" }}
                                                src={`data:image/${doc.baseExtension};base64, ${doc.document}`} 
                                                alt={doc.type} 
                                            />
                                        ) : (
                                            <iframe 
                                                src={`data:application/${doc.baseExtension};base64,${doc.document}`} 
                                                title={doc.type} 
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        )}
                                    </div>
                                    <button 
                                        className="btn btn-danger mt-2" 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun document trouvé pour cet instructeur.</p>
            )}

            <h3 className="mt-4">Télécharger un document</h3>

            {/* Affichage des cartes à cliquer pour télécharger */}
            <div className="row">
                {["carte d'identité", "Permis de conduire", "Carte d'enseignement", "Contrat de travail"].map((type, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
                        <div 
                            className="card" 
                            style={{
                                width: '287px', 
                                height: '200px', 
                                border: '1px solid black', 
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                            onClick={() => openCardForUpload(type)}
                        >
                            <span>{type}</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDocumentType && (
                <div className="mt-3">
                    <input type="file" onChange={handleFileChange} />
                    <button 
                        className="btn btn-primary mt-2"
                        onClick={() => handleFileUpload(selectedDocumentType)}
                        disabled={uploading}
                    >
                        {uploading ? "Téléchargement en cours..." : "Télécharger le fichier"}
                    </button>
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


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);
//     const [selectedDocumentType, setSelectedDocumentType] = useState(null);  // Type de document sélectionné

//     // Chargement des détails de l'instructeur
//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }

//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     // Sélection d'un fichier
//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);  // Sélection d'un seul fichier
//     };

//     // Téléchargement d'un fichier
//     const handleFileUpload = async (documentType) => {
//         if (!selectedFile) {
//             setError("Veuillez sélectionner un fichier à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('document', selectedFile);
//         formData.append('documentType', documentType);  // Associer le type de document
//         formData.append('instructorId', id);

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichier téléchargé avec succès");
//                 setSelectedFile(null);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement du fichier. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Récupération des documents après chaque upload
//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     // Suppression d'un document
//     const handleDelete = async (documentId) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
//             return;
//         }

//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     // Ouvrir une carte pour le téléchargement d'un document
//     const openCardForUpload = (documentType) => {
//         setSelectedDocumentType(documentType);  // Spécifie le type de document à télécharger
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails de l'instructeur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
//                             <div 
//                                 className="card" 
//                                 style={{ border: '1px solid black', borderRadius: '5px' }}
//                             >
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ 
//                                         height: '200px', 
//                                         display: 'flex', 
//                                         justifyContent: 'center', 
//                                         alignItems: 'center', 
//                                         border: '1px solid black', 
//                                         borderRadius: '5px', 
//                                         overflow: 'hidden' 
//                                     }}>
//                                         {doc.baseExtension !== "pdf" ? (
//                                             <img 
//                                                 style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                                 src={`data:image/${doc.baseExtension};base64, ${doc.document}`} 
//                                                 alt={doc.type} 
//                                             />
//                                         ) : (
//                                             <iframe 
//                                                 src={`data:application/${doc.baseExtension};base64,${doc.document}`} 
//                                                 title={doc.type} 
//                                                 style={{ width: "100%", height: "100%" }}
//                                             />
//                                         )}
//                                     </div>
//                                     <button 
//                                         className="btn btn-danger mt-2" 
//                                         onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <h3 className="mt-4">Télécharger un document</h3>

//             {/* Affichage des cartes à cliquer pour télécharger */}
//             <div className="row">
//                 {["carte d'identité", "Permis de conduire", "Carte d'enseignement", "Contrat de travail"].map((type, index) => (
//                     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
//                         <div 
//                             className="card" 
//                             style={{
//                                 width: '287px', 
//                                 height: '200px', 
//                                 border: '1px solid black', 
//                                 borderRadius: '5px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 cursor: 'pointer'
//                             }}
//                             onClick={() => openCardForUpload(type)}
//                         >
//                             <span>{type}</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {selectedDocumentType && (
//                 <div className="mt-3">
//                     <input type="file" onChange={handleFileChange} />
//                     <button 
//                         className="btn btn-primary mt-2"
//                         onClick={() => handleFileUpload(selectedDocumentType)}
//                         disabled={uploading}
//                     >
//                         {uploading ? "Téléchargement en cours..." : "Télécharger le fichier"}
//                     </button>
//                 </div>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux formateurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedDocument, setSelectedDocument] = useState(null);

//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }

//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file);
//         });

//         // Ajout des types de documents
//         formData.append("filesType", JSON.stringify([
//             "carte d'identité", 
//             "Permis de conduire", 
//             "Carte d'enseignement",  
//             "Contrat de travail"
//         ]));

//         formData.append('instructorId', id);

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     const handleDelete = async (documentId) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
//             return;
//         }

//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     const openModal = (document) => {
//         setSelectedDocument(document);
//         setIsModalOpen(true);
//     };

//     const closeModal = (e) => {
//         e.stopPropagation();
//         setIsModalOpen(false);
//         setSelectedDocument(null);
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails de l'instructeur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h3 className="mt-4">Ajouter un document</h3>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <h3 className="mt-4">Documents de l'instructeur</h3>
//             <div className="row">
//                 {/* Affichage des 4 cartes vides */}
//                 {["carte d'identité", "Permis de conduire", "Carte d'enseignement", "Contrat de travail"].map((type, index) => (
//                     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
//                         <div 
//                             className="card" 
//                             style={{
//                                 width: '287px', 
//                                 height: '200px', 
//                                 border: '1px solid black', 
//                                 borderRadius: '5px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center'
//                             }}
//                         >
//                             <span>{type}</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
//                             <div 
//                                 className="card" 
//                                 style={{ border: '1px solid black', borderRadius: '5px' }}
//                                 onClick={() => openModal(doc)}
//                             >
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ 
//                                         height: '200px', 
//                                         display: 'flex', 
//                                         justifyContent: 'center', 
//                                         alignItems: 'center', 
//                                         border: '1px solid black', 
//                                         borderRadius: '5px', 
//                                         overflow: 'hidden' 
//                                     }}>
//                                         {document.baseExtension != "pdf" ? (
//                                             <img 
//                                                 style={{height: "720px", width: "1280px"}} 
//                                                 src={`data:image/${document.baseExtension};base64, ${document.document}`} 
//                                                 alt={document.type}      
//                                             />
//                                         ) : (
//                                             <iframe 
//                                                 src={`data:application/${document.baseExtension};base64,${document.document}`} 
//                                                 title={document.type} 
//                                                 style={{ width: "100%", height: "100%" }}
//                                             />
//                                         )}
//                                     </div>
//                                     <button 
//                                         className="btn btn-danger mt-2" 
//                                         onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux instructeurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedDocument, setSelectedDocument] = useState(null);

//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }

//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file);
//         });
//         formData.append('instructorId', id);

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     const handleDelete = async (documentId) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
//             return;
//         }

//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     const openModal = (document) => {
//         setSelectedDocument(document);
//         setIsModalOpen(true);
//     };

//     const closeModal = (e) => {
//         e.stopPropagation(); // Empêche la propagation pour ne pas fermer le modal lors du clic sur l'image
//         setIsModalOpen(false);
//         setSelectedDocument(null);
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails de l'instructeur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h3 className="mt-4">Ajouter un document</h3>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <h3 className="mt-4">Documents de l'instructeur</h3>
//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
//                             <div 
//                                 className="card" 
//                                 style={{ border: '1px solid black', borderRadius: '5px' }}
//                                 onClick={() => openModal(doc)}
//                             >
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ 
//                                         height: '200px', 
//                                         display: 'flex', 
//                                         justifyContent: 'center', 
//                                         alignItems: 'center', 
//                                         border: '1px solid black', 
//                                         borderRadius: '5px', 
//                                         overflow: 'hidden' 
//                                     }}>
//                                          console.log(doc);

//                                         {doc.baseExtension !== "pdf" ? (
//                                             <>
//                                               <a download={`${instructor.lastName}-${instructor.firstName}-${(doc.type || "document").replaceAll(" ", "_")}.${doc.baseExtension}`} 
//                                              href={`data:image/${doc.baseExtension};base64, ${doc.document}`}>
//                                              Télécharger
                                            
// </a>

//                                                 <img 
//                                                     style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                                     src={`data:image/${doc.baseExtension};base64, ${doc.document}`} 
//                                                     alt={doc.type} 
//                                                 />
//                                             </>
//                                         ) : (
//                                             <iframe 
//                                                 src={`data:application/${doc.baseExtension};base64,${doc.document}`} 
//                                                 title={doc.type} 
//                                                 style={{ width: "100%", height: "100%" }}
//                                             />
//                                         )}
//                                     </div>
//                                 </div>
//                                 <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>Supprimer</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour à la liste des instructeurs
//                 </button>
//                 <button className="btn btn-danger" onClick={() => navigate('/connexion')}>
//                     Déconnexion
//                 </button>
//             </div>

//             {isModalOpen && selectedDocument && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         {selectedDocument.baseExtension !== "pdf" ? (
//                             <img 
//                                 src={`data:image/${selectedDocument.baseExtension};base64, ${selectedDocument.document}`} 
//                                 alt={selectedDocument.type}
//                                 style={{ width: '100%', height: 'auto' }}
//                             />
//                         ) : (
//                             <iframe 
//                                 src={`data:application/pdf;base64,${selectedDocument.document}`}
//                                 title={selectedDocument.type}
//                                 style={{ width: '100%', height: '500px' }}
//                             />
//                         )}
//                         <button className="btn btn-secondary mt-2" onClick={closeModal}>
//                             Fermer
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstructorProfilPage;

// //BONNE VERSION 

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false); // état pour la modale
//     const [selectedDocument, setSelectedDocument] = useState(null);

//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }
        
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file);
//         });
//         formData.append('instructorId', id); 

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     const handleDelete = async (documentId) => {
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     const openModal = (document) => {
//         setSelectedDocument(document);
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedDocument(null);
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails du Moniteur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h3 className="mt-4">Ajouter un document</h3>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <h3 className="mt-4">Documents de l'instructeur</h3>
//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
//                             <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }} onClick={() => openModal(doc)}>
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ 
//                                         height: '200px', 
//                                         display: 'flex', 
//                                         justifyContent: 'center', 
//                                         alignItems: 'center', 
//                                         border: '1px solid black', 
//                                         borderRadius: '5px', 
//                                         overflow: 'hidden' 
//                                     }}>
//                                         <img 
//                                             src={`data:image/png;base64, ${doc.document}`} 
                                           
//                                             style={{
//                                                 width: 'auto',
//                                                 height: '100%',
//                                                 objectFit: 'contain' 
//                                             }} 
//                                             alt={doc.type} 
//                                         />
//                                     </div>
//                                 </div>
//                                 <button className="btn btn-danger" onClick={() => handleDelete(doc.id)}>Supprimer</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={() => navigate('/connexion')}>
//                     Déconnexion
//                 </button>
//             </div>

//             {/* Modale pour l'affichage du document sélectionné */}
//             {isModalOpen && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <img 
//                             src={`data:image/png;base64, ${selectedDocument.document}`} 
//                             alt={selectedDocument.type}
//                             style={{ width: '100%', height: 'auto' }}
//                         />
//                         <button className="close-modal" onClick={closeModal}>Fermer</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InstructorProfilPage;


// // VERSION 
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);

//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }
        
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file);
//         });
//         formData.append('instructorId', id); 

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     const handleDelete = async (documentId) => {
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails du Moniteur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h3 className="mt-4">Ajouter un document</h3>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <h3 className="mt-4">Documents de l'instructeur</h3>
//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
//                             <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }}>
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ 
//                                         height: '200px', 
//                                         display: 'flex', 
//                                         justifyContent: 'center', 
//                                         alignItems: 'center', 
//                                         border: '1px solid black', 
//                                         borderRadius: '5px', 
//                                         overflow: 'hidden' 
//                                     }}>
//                                         <img 
//                                             src={`data:image/png;base64, ${doc.document}`} 
//                                             style={{
//                                                 width: 'auto',
//                                                 height: '100%',
//                                                 objectFit: 'contain' // Ajuste l'image pour qu'elle reste proportionnelle
//                                             }} 
//                                             alt={doc.type} 
//                                         />
//                                     </div>
//                                 </div>
//                                 <button className="btn btn-danger" onClick={() => handleDelete(doc.id)}>Supprimer</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={() => navigate('/connexion')}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
    
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [selectedFiles, setSelectedFiles] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [documents, setDocuments] = useState([]);

//     useEffect(() => {
//         if (!id) {
//             setError("ID de l'instructeur manquant dans les paramètres de l'URL.");
//             setLoading(false);
//             return;
//         }
        
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file);
//         });
//         formData.append('instructorId', id); 

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
//         } finally {
//             setUploading(false);
//         }
//     };

//     const fetchDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             setDocuments(response.data.documents || []);
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents : " + error.message);
//         }
//     };

//     const handleDelete = async (documentId) => {
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); 
//             } else {
//                 setError("Erreur lors de la suppression du document. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//         }
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     return (
//         <div className="container mt-5">
//             <h1 className="text-center">Détails du Moniteur</h1>

//             {instructor && (
//                 <div className="card mb-4">
//                     <div className="card-body">
//                         <h5 className="card-title">Informations de l'instructeur</h5>
//                         <div className="d-flex flex-wrap">
//                             <div className="p-2"><strong>Nom :</strong> {instructor.lastName}</div>
//                             <div className="p-2"><strong>Prénom :</strong> {instructor.firstName}</div>
//                             <div className="p-2"><strong>Email :</strong> {instructor.email}</div>
//                             <div className="p-2"><strong>Téléphone :</strong> {instructor.phoneNumber}</div>
//                             <div className="p-2"><strong>Adresse :</strong> {instructor.adress}</div>
//                             <div className="p-2"><strong>Spécialités :</strong> {instructor.speciality}</div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <h3 className="mt-4">Ajouter un document</h3>
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <h3 className="mt-4">Documents de l'instructeur</h3>
//             {documents.length > 0 ? (
//                 <div className="row">
//                     {documents.map((doc) => (
//                         <div className="col-md-3 mb-3" key={doc.id}>
//                             <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }}>
//                                 <div className="card-body" style={{ padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', borderRadius: '5px', overflow: 'hidden' }}>
//                                         <img src={`data:image/png;base64, ${doc.document}`} style={{ width: 'auto', height: '100%' }} alt={doc.type} />
//                                     </div>
//                                 </div>
//                                 <button className="btn btn-danger" onClick={() => handleDelete(doc.id)}>Supprimer</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={() => navigate('/connexion')}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;
