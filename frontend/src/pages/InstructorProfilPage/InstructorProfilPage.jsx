

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
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={doc.id}>
                            <div className="card" style={{ border: '1px solid black', borderRadius: '5px' }}>
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
                                        <img 
                                            src={`data:image/png;base64, ${doc.document}`} 
                                            style={{
                                                width: 'auto',
                                                height: '100%',
                                                objectFit: 'contain' // Ajuste l'image pour qu'elle reste proportionnelle
                                            }} 
                                            alt={doc.type} 
                                        />
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
