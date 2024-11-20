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
                                <h5 className="modal-title">Document: {selectedDocument.type}</h5>
                                <button
                                    type="button"
                                    className="close"
                                    onClick={closeDocument}
                                    style={{ fontSize: '30px', marginTop: '-10px' }}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">

                            {
                            selectedDocument.baseExtension !== "pdf" ? (
                                <img
                                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                src={`data:image/${selectedDocument.baseExtension};base64,${selectedDocument.document}`}
                                alt={selectedDocument.type}
                                />
                            ) : (
                                <iframe
                                src={`data:application/pdf;base64,${selectedDocument.document}`}  // Spécifiez explicitement le type "pdf"
                                title={`Document PDF - ${selectedDocument.type}`}  // Titre unique
                                style={{ width: '100%', height: '500px' }}  // Ajustez la hauteur pour que le PDF soit bien visible
                                frameBorder="0"
                                />
                            )
                            }


                                
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


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [documents, setDocuments] = useState([]);
//     const cardRefs = useRef({}); // Stockage des références pour chaque type de carte

//     const cardTypes = [
//         "carte d'identité",
//         "Permis de conduire",
//         "Carte d'enseignement",
//         "Contrat de travail",
//     ];

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

//     const handleUpload = async (type, files) => {
//         if (!files || files.length === 0) return;

//         const formData = new FormData();
//         formData.append("documents", files[0]);
//         formData.append("instructorId", id);
//         formData.append("filesType", JSON.stringify([type]));

//         try {
//             const res = await apiClient.post("/instructor/document/add", formData);
//             if (res.status === 200) {
//                 alert(`${type} téléchargé avec succès !`);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement du fichier.");
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier : " + error.message);
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
//                 setError("Erreur lors de la suppression du document.");
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

//     const displayCards = cardTypes.map((type) => {
//         const document = documents.find((doc) => doc.type === type);

//         return (
//             <div
//                 className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
//                 key={type}
//                 style={{ cursor: 'default' }}
//             >
//                 <div
//                     className="card"
//                     style={{ border: '1px solid black', borderRadius: '5px' }}
//                 >
//                     <div className="card-body" style={{ padding: '0px' }}>
//                         <h5
//                             className="card-title"
//                             onClick={() => cardRefs.current[type]?.click()} // Téléchargement activé uniquement sur le titre
//                             style={{ cursor: 'pointer', textDecoration: 'underline' }}
//                         >
//                             {type}
//                         </h5>
//                         <div
//                             style={{
//                                 height: '200px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 border: '1px solid black',
//                                 borderRadius: '5px',
//                                 overflow: 'hidden',
//                             }}
//                         >
//                             {document ? (
//                                 document.baseExtension !== "pdf" ? (
//                                     <img
//                                         style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                         src={`data:image/${document.baseExtension};base64, ${document.document}`}
//                                         alt={type}
//                                     />
//                                 ) : (
//                                     <iframe
//                                         src={`data:application/${document.baseExtension};base64,${document.document}`}
//                                         title={type}
//                                         style={{ width: "100%", height: "100%" }}
//                                     />
//                                 )
//                             ) : (
//                                 <p className="text-center">Aucun document</p>
//                             )}
//                         </div>
//                         {document && (
//                             <button
//                                 className="btn btn-danger mt-2 w-100"
//                                 onClick={(e) => {
//                                     e.stopPropagation(); // Empêche la propagation vers le clic de la carte
//                                     handleDelete(document.id); // Passe l'ID du document à supprimer
//                                 }}
//                             >
//                                 Supprimer
//                             </button>
//                         )}
//                     </div>
//                 </div>
//                 <input
//                     type="file"
//                     ref={(el) => (cardRefs.current[type] = el)} // Associe chaque type de carte à son champ input
//                     style={{ display: 'none' }}
//                     onChange={(e) => handleUpload(type, e.target.files)}
//                 />
//             </div>
//         );
//     });

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

//             <div className="row">
//                 {displayCards}
//             </div>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux formateurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [documents, setDocuments] = useState([]);
//     const cardRefs = useRef({}); // Stockage des références pour chaque type de carte

//     const cardTypes = [
//         "carte d'identité",
//         "Permis de conduire",
//         "Carte d'enseignement",
//         "Contrat de travail",
//     ];

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

//     const handleUpload = async (type, files) => {
//         if (!files || files.length === 0) return;

//         const formData = new FormData();
//         formData.append("documents", files[0]);
//         formData.append("instructorId", id);
//         formData.append("filesType", JSON.stringify([type]));

//         try {
//             const res = await apiClient.post("/instructor/document/add", formData);
//             if (res.status === 200) {
//                 alert(`${type} téléchargé avec succès !`);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement du fichier.");
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier : " + error.message);
//         }
//     };

//         const fetchDocuments = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setDocuments(response.data.documents || []);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des documents : " + error.message);
//             }
//         };
//         const handleDelete = async (documentId) => {
//             console.log("ID du document à supprimer :", documentId); // Vérifie que l'ID est correct
//             if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
//                 return;
//             }
    
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); // Recharge les documents après suppression
//             } else {
//                 setError("Erreur lors de la suppression du document.");
//                 console.error("Erreur API :", response);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document : " + error.message);
//             console.error("Erreur dans handleDelete :", error);
//         }
//     };
    
   

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div className="alert alert-danger">{error}</div>;
//     }

//     const displayCards = cardTypes.map((type) => {
//         const document = documents.find((doc) => doc.type === type);

//         return (
//             <div
//                 className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
//                 key={type}
//                 onClick={() => cardRefs.current[type]?.click()} // Utilisation de la ref pour déclencher le champ d'upload
//                 style={{ cursor: 'pointer' }}
//             >
//                 <div
//                     className="card"
//                     style={{ border: '1px solid black', borderRadius: '5px' }}
//                 >
//                     <div className="card-body" style={{ padding: '0px' }}>
//                         <h5 className="card-title">{type}</h5>
//                         <div
//                             style={{
//                                 height: '200px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 border: '1px solid black',
//                                 borderRadius: '5px',
//                                 overflow: 'hidden'
//                             }}
//                         >
//                             {document ? (
//                                 document.baseExtension !== "pdf" ? (
//                                     <img
//                                         style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                         src={`data:image/${document.baseExtension};base64, ${document.document}`}
//                                         alt={type}
//                                     />
//                                 ) : (
//                                     <iframe
//                                         src={`data:application/${document.baseExtension};base64,${document.document}`}
//                                         title={type}
//                                         style={{ width: "100%", height: "100%" }}
//                                     />
//                                 )
//                             ) : (
//                                 <p className="text-center">Aucun document</p>
//                             )}
//                         </div>
//                         {document && (
//                     <button
//                         className="btn btn-danger mt-2 w-100"
//                         onClick={(e) => {
//                             e.stopPropagation(); // Empêche la propagation vers le clic de la carte
//                             handleDelete(document.id); // Passe l'ID du document à supprimer
//                         }}
//                     >
//                         Supprimer
//                     </button>
//                 )}
    
                        
//                     </div>
//                 </div>
//                 <input
//                     type="file"
//                     ref={(el) => (cardRefs.current[type] = el)} // Associe chaque type de carte à son champ input
//                     style={{ display: 'none' }}
//                     onChange={(e) => handleUpload(type, e.target.files)}
//                 />
//             </div>
//         );
//     });

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

//             <div className="row">
//                 {displayCards}
//             </div>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux formateurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [documents, setDocuments] = useState([]);
//     const cardRefs = useRef({}); // Stockage des références pour chaque type de carte

//     const cardTypes = [
//         "carte d'identité",
//         "Permis de conduire",
//         "Carte d'enseignement",
//         "Contrat de travail",
//     ];

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

//     const handleUpload = async (type, files) => {
//         if (!files || files.length === 0) return;

//         const formData = new FormData();
//         formData.append("documents", files[0]);
//         formData.append("instructorId", id);
//         formData.append("filesType", JSON.stringify([type]));

//         try {
//             const res = await apiClient.post("/instructor/document/add", formData);
//             if (res.status === 200) {
//                 alert(`${type} téléchargé avec succès !`);
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement du fichier.");
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier : " + error.message);
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
//                 setError("Erreur lors de la suppression du document.");
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

//     const displayCards = cardTypes.map((type) => {
//         const document = documents.find((doc) => doc.type === type);

//         return (
//             <div
//                 className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3"
//                 key={type}
//                 onClick={() => cardRefs.current[type]?.click()} // Utilisation de la ref pour déclencher le champ d'upload
//                 style={{ cursor: 'pointer' }}
//             >
//                 <div
//                     className="card"
//                     style={{ border: '1px solid black', borderRadius: '5px' }}
//                 >
//                     <div className="card-body" style={{ padding: '0px' }}>
//                         <h5 className="card-title">{type}</h5>
//                         <div
//                             style={{
//                                 height: '200px',
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 border: '1px solid black',
//                                 borderRadius: '5px',
//                                 overflow: 'hidden'
//                             }}
//                         >
//                             {document ? (
//                                 document.baseExtension !== "pdf" ? (
//                                     <img
//                                         style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                         src={`data:image/${document.baseExtension};base64, ${document.document}`}
//                                         alt={type}
//                                     />
//                                 ) : (
//                                     <iframe
//                                         src={`data:application/${document.baseExtension};base64,${document.document}`}
//                                         title={type}
//                                         style={{ width: "100%", height: "100%" }}
//                                     />
//                                 )
//                             ) : (
//                                 <p className="text-center">Aucun document</p>
//                             )}
//                         </div>
//                         {document && (
//                             <button
//                                 className="btn btn-danger mt-2"
//                                 onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleDelete(document.id);
//                                 }}
//                             >
//                                 Supprimer
//                             </button>
//                         )}
//                     </div>
//                 </div>
//                 <input
//                     type="file"
//                     ref={(el) => (cardRefs.current[type] = el)} // Associe chaque type de carte à son champ input
//                     style={{ display: 'none' }}
//                     onChange={(e) => handleUpload(type, e.target.files)}
//                 />
//             </div>
//         );
//     });

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

//             <div className="row">
//                 {displayCards}
//             </div>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux formateurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// // bonne version

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
//     const [documents, setDocuments] = useState([]);

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

//     // Soumission du formulaire pour télécharger des fichiers
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Empêche le rechargement de la page
//         const formData = new FormData();
//         for (const file of e.target[0].files) {
//             formData.append("documents", file);
//         }
//         formData.append("instructorId", id);
//         formData.append(
//             "filesType",
//             JSON.stringify(["carte d'identité", "Permis de conduire", "Carte d'enseignement", "Contrat de travail"])
//         );

//         try {
//             const res = await apiClient.post("/instructor/document/add", formData); // Envoie la requête
//             console.log(res.status, res.data.message);
//             if (res.status === 200) {
//                 alert("Fichiers téléchargés avec succès !");
//                 fetchDocuments(); // Actualise la liste des documents
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers.");
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers : " + error.message);
//         }
//     };

//     // Récupération des documents après chaque mise à jour
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
//                 setError("Erreur lors de la suppression du document.");
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
//                                     <div
//                                         style={{
//                                             height: '200px',
//                                             display: 'flex',
//                                             justifyContent: 'center',
//                                             alignItems: 'center',
//                                             border: '1px solid black',
//                                             borderRadius: '5px',
//                                             overflow: 'hidden'
//                                         }}
//                                     >
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

//             <h3 className="mt-4">Télécharger des documents</h3>

//             {/* Formulaire pour télécharger plusieurs fichiers */}
//             <form onSubmit={handleSubmit}>
//                 <input type="file" multiple />
//                 <button type="submit" className="btn btn-primary mt-2">
//                     Télécharger les fichiers
//                 </button>
//             </form>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
//                     Retour aux formateurs
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;

