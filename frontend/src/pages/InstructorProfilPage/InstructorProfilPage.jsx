


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';

const InstructorProfilPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);

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
                setError("Erreur lors de la récupération des détails du moniteur : " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [id]);

    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files);
    };

    const handleFileUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
            return;
        }

        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            formData.append('documents', file);
        });
        formData.append('instructorId', id); 

        try {
            setUploading(true);
            const response = await apiClient.post(`/instructor/document/add`, formData);

            if (response.status === 200) {
                alert("Fichiers téléchargés avec succès");
                setSelectedFiles(null);
                fetchDocuments(); 
            } else {
                setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status);
            }
        } catch (error) {
            setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message);
        } finally {
            setUploading(false);
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

    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Détails du Moniteur</h1>

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

            <h3 className="mt-4">Ajouter un document</h3>
            <input type="file" onChange={handleFileChange} multiple />
            <button 
                className="btn btn-primary mt-2" 
                onClick={handleFileUpload}
                disabled={uploading}
            >
                {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
            </button>

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <h3 className="mt-4">Documents de l'instructeur</h3>
            {documents.length > 0 ? (
                <div className="row">
                    {documents.map((doc) => (
                        <div className="col-md-3 mb-3" key={doc.id}>
                            <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }}>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0px' }}>
                                    <h5 className="card-title">{doc.type}</h5>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', borderRadius: '5px', overflow: 'hidden', width: '100%', maxHeight: '200px' }}>
                                        <img src={`data:image/png;base64, ${doc.document}`} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} alt={doc.type} />
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={() => handleDelete(doc.id)}>Supprimer</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun document trouvé pour cet instructeur.</p>
            )}

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={() => navigate('/instructors')}>
                    Retour à la liste des moniteurs
                </button>
                <button className="btn btn-danger" onClick={() => navigate('/connexion')}>
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default InstructorProfilPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';
// import './InstructorProfilPage.css'; // Assurez-vous d'importer le fichier CSS

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
//                                     <div className="image-container">
//                                         <img 
//                                             src={`data:image/png;base64, ${doc.document}`} 
//                                             className="img-fluid rotated-image" // Classe ajoutée pour la rotation
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
//         formData.append('instructorId', id); // Assurez-vous que `id` est bien la bonne valeur

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 await fetchDocuments(); // Récupère les documents mis à jour
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

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents : " + error.message);
//         }
//     };

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Fonction pour gérer la suppression d'un document
//     const handleDelete = async (documentId) => {
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); // Récupère les documents mis à jour après la suppression
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

//             {instructor ? (
//                 <div className="card mb-4">
//                     <div className="card-body">
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
//             ) : (
//                 <div>Aucun moniteur trouvé</div>
//             )}

//             <h3>Ajouter un document</h3>
//             <input type="file" onChange={(e) => handleFileChange(e)} multiple />
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
//                         <div className="col-md-3 mb-3" key={doc.id} >
//                             <div className="card" style={{ width: 'fit-content', height: 'fit content', border: '1px solid black', borderRadius: '5px' }}>
//                                 <div className="card-body" style={{ width: '250px', height: '300px', margin: '0px', padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', borderRadius: '5px', margin: '0px', overflow: 'hidden' }}>
//                                         <img src={`data:image/png;base64, ${doc.document}`} style={{ width: 'auto', height: '100%' }} alt={doc.type} />
//                                     </div>
//                                 </div>
//                                 {/* Le bouton Supprimer a été déplacé ici */}
//                                 <button className="btn btn-danger" onClick={() => handleDelete(doc.id)}>Supprimer</button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
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
//         formData.append('instructorId', id); // Assurez-vous que `id` est bien la bonne valeur

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 await fetchDocuments(); // Récupère les documents mis à jour
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

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents : " + error.message);
//         }
//     };

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Fonction pour gérer l'ajout d'un document
//     const handleAdd = async (documentId) => {
//         // Logique pour ajouter le document (à implémenter selon vos besoins)
//         console.log("Ajouter le document avec ID :", documentId);
//     };

//     // Fonction pour gérer la suppression d'un document
//     const handleDelete = async (documentId) => {
//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 fetchDocuments(); // Récupère les documents mis à jour après la suppression
//             } else {
//                 setError("Erreur lors de la suppression du documentdddd. Statut: " + response.status);
//             }
//         } catch (error) {
//             setError("Erreur lors de la suppression du document vvvvvv : " + error.message);
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

//             {instructor ? (
//                 <div className="card mb-4">
//                     <div className="card-body">
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
//             ) : (
//                 <div>Aucun moniteur trouvé</div>
//             )}

//             <h3>Ajouter un document</h3>
//             <input type="file" onChange={(e) => handleFileChange(e)} multiple />
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
//                         <div className="col-md-3 mb-3" key={doc.id} >
//                             <div className="card"  style={{ width: 'fit-content', height: 'fit content', border: '1px solid black', borderRadius: '5px' }}>
//                                 <div className="card-body" style={{ width: '250px', height: '300px', margin: '0px', padding: '0px' }}>
//                                     <h5 className="card-title">{doc.type} </h5>
//                                     <div style={{ width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black', borderRadius: '5px', margin: '0px', overflow: 'hidden' }}>
//                                         <img src={`data:image/png;base64, ${doc.document}`} style={{ width:'auto', height: '100%' }} alt={doc.type} />
//                                     </div>
                                    
//                                     <div className="mt-2 d-flex justify-content-between">
    
                                       
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
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
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
//                 await fetchDocuments();
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

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents : " + error.message);
//         }
//     };

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     const handleAddDocument = (docId) => {
//         console.log("Ajouter document avec ID:", docId);
//         // Logique pour ajouter le document, par exemple, envoyer une requête à l'API
//     };

//     const handleRemoveDocument = async (instructorId) => {
//         try {
//             await apiClient.delete(`/instructor/document/delete/${instructorId}`);
//             await fetchDocuments(); // Mettre à jour la liste après suppression
//             alert("Document supprimé avec succès");
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

//             {instructor ? (
//                 <div className="card mb-4">
//                     <div className="card-body">
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
//             ) : (
//                 <div>Aucun moniteur trouvé</div>
//             )}

//             <h3>Ajouter un document</h3>
//             <input type="file" onChange={(e) => handleFileChange(e)} multiple />
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
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <img src={`data:image/png;base64, ${doc.document}`} alt={doc.type} />
//                                     <div className="d-flex justify-content-between mt-2">
//                                         <button className="btn btn-success" onClick={() => handleAddDocument(doc.id)}>Ajouter</button>
//                                         <button className="btn btn-danger" onClick={() => handleRemoveDocument(doc.id)}>Supprimer</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
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
//     // Assurez-vous que l'ID est bien récupéré comme chaîne de caractères
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
//         formData.append('instructorId', id); // Assurez-vous que `id` est bien la bonne valeur

//         try {
//             setUploading(true);
//             const response = await apiClient.post(`/instructor/document/add`, formData);

//             if (response.status === 200) {
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null);
//                 await fetchDocuments(); // Récupère les documents mis à jour
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

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents : " + error.message);
//         }
//     };

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
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

//             {instructor ? (
//                 <div className="card mb-4">
//                     <div className="card-body">
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
//             ) : (
//                 <div>Aucun moniteur trouvé</div>
//             )}

//             <h3>Ajouter un document</h3>
//             <input type="file" onChange={(e) => handleFileChange(e)} multiple />
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
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">{doc.type}</h5>
//                                     <img src={`data:image/png;base64, ${doc.document}`} />
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <p>Aucun document trouvé pour cet instructeur.</p>
//             )}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;

