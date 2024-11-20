import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client';
import './InstructorProfilPage.css';

// Liste statique des types de documents
const documentTypes = [
    "Carte d'identité",
    "Permis de conduire",
    "Carte d'enseignement",
    "Contrat de travail",
];

const InstructorProfilPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [documents, setDocuments] = useState([]);

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

                // Combine les types de documents par défaut avec les documents reçus
                const mergedDocuments = documentTypes.map((type) => {
                    const doc = response.data.documents?.find((d) => d.type === type) || null;
                    return { type, ...doc }; // Si aucun document, reste null
                });

                setDocuments(mergedDocuments);
            } catch (error) {
                setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructor();
    }, [id]); // documentTypes est statique et n'a pas besoin d'être dans les dépendances

     const handleDelete = async (documentId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            return;
        }

        try {
            const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
            if (response.status === 200) {
                alert("Document supprimé avec succès");
                const updatedDocuments = documents.map((doc) =>
                    doc.id === documentId ? { type: doc.type } : doc
                ); // Remplace le document par un type vide
                setDocuments(updatedDocuments);
            } else {
                setError("Erreur lors de la suppression du document.");
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

            <h3 className="mt-4">Documents</h3>

            {/* Affichage des cartes */}
            <div className="row">
                {documents.map((doc, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
                        <div
                            className="card"
                            style={{ border: '1px solid black', borderRadius: '5px' }}
                        >
                            <div className="card-body" style={{ padding: '0px' }}>
                                <h5 className="card-title">{doc.type}</h5>
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
                                >
                                    {doc.document ? (
                                        doc.baseExtension !== "pdf" ? (
                                            <img
                                                style={{ height: "100%", width: "auto", objectFit: "contain" }}
                                                src={`data:image/${doc.baseExtension};base64,${doc.document}`}
                                                alt={doc.type}
                                            />
                                        ) : (
                                            <iframe
                                                src={`data:application/${doc.baseExtension};base64,${doc.document}`}
                                                title={doc.type}
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        )
                                    ) : (
                                        <span>Aucun document</span>
                                    )}
                                </div>
                                {doc.id && (
                                    <button
                                        className="btn btn-danger mt-2"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                                    >
                                        Supprimer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
//     const [documents, setDocuments] = useState([]);

//     // Liste des types de documents par défaut
//     const documentTypes = [
//         "Carte d'identité",
//         "Permis de conduire",
//         "Carte d'enseignement",
//         "Contrat de travail",
//     ];

//     // Charger les détails de l'instructeur
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

//                 // Combine les types de documents par défaut avec les documents reçus
//                 const mergedDocuments = documentTypes.map((type) => {
//                     const doc = response.data.documents?.find((d) => d.type === type) || null;
//                     return { type, ...doc }; // Si aucun document, reste null
//                 });

//                 setDocuments(mergedDocuments);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails de l'instructeur : " + error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     // Supprimer un document
//     const handleDelete = async (documentId) => {
//         if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
//             return;
//         }

//         try {
//             const response = await apiClient.delete(`/instructor/document/delete/${documentId}`);
//             if (response.status === 200) {
//                 alert("Document supprimé avec succès");
//                 const updatedDocuments = documents.map((doc) =>
//                     doc.id === documentId ? { type: doc.type } : doc
//                 ); // Remplace le document par un type vide
//                 setDocuments(updatedDocuments);
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

//             <h3 className="mt-4">Documents</h3>

//             {/* Affichage des cartes */}
//             <div className="row">
//                 {documents.map((doc, index) => (
//                     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={index}>
//                         <div
//                             className="card"
//                             style={{ border: '1px solid black', borderRadius: '5px' }}
//                         >
//                             <div className="card-body" style={{ padding: '0px' }}>
//                                 <h5 className="card-title">{doc.type}</h5>
//                                 <div
//                                     style={{
//                                         height: '200px',
//                                         display: 'flex',
//                                         justifyContent: 'center',
//                                         alignItems: 'center',
//                                         border: '1px solid black',
//                                         borderRadius: '5px',
//                                         overflow: 'hidden',
//                                     }}
//                                 >
//                                     {doc.document ? (
//                                         doc.baseExtension !== "pdf" ? (
//                                             <img
//                                                 style={{ height: "100%", width: "auto", objectFit: "contain" }}
//                                                 src={`data:image/${doc.baseExtension};base64,${doc.document}`}
//                                                 alt={doc.type}
//                                             />
//                                         ) : (
//                                             <iframe
//                                                 src={`data:application/${doc.baseExtension};base64,${doc.document}`}
//                                                 title={doc.type}
//                                                 style={{ width: "100%", height: "100%" }}
//                                             />
//                                         )
//                                     ) : (
//                                         <span>Aucun document</span>
//                                     )}
//                                 </div>
//                                 {doc.id && (
//                                     <button
//                                         className="btn btn-danger mt-2"
//                                         onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
//                                     >
//                                         Supprimer
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
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

