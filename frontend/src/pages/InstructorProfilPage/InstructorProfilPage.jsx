// corection de l'id 

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

const InstructorProfilPage = () => {
    const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
    const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
    const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
    const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
    const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
    const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
    const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours
    const [documents, setDocuments] = useState([]); // Stocke les documents de l'instructeur

    // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
    // Assurez-vous que l'ID est bien récupéré comme chaîne de caractères
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
            console.log(id);
            try {
                const response = await apiClient.get(`/instructor/get/${id}`);
                setInstructor(response.data); // Stocke les données de l'instructeur
                setDocuments(response.data.documents || []); // Assurez-vous que les documents sont également récupérés
                setInstructor(response.data);
                setDocuments(response.data.documents || []);
            } catch (error) {
                setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
                setError("Erreur lors de la récupération des détails du moniteur : " + error.message);
            } finally {
                setLoading(false); // Désactive le mode chargement
            }
        };

        fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
    }, [id]); // Exécute useEffect uniquement lorsque l'ID change

    // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
    const handleFileChange = (event) => {
        setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
    };

    // Gère l'upload de fichiers vers le backend
    const handleFileUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
            return; // Arrête l'exécution si aucun fichier n'est sélectionné
        }

        const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
        Array.from(selectedFiles).forEach((file) => {
            formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
        });
        formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

        try {
            setUploading(true); // Active le mode téléchargement
            const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

            if (response.status === 200) { // Vérifie si le téléchargement a réussi
                alert("Fichiers téléchargés avec succès");
                setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
                // Récupérez les documents à nouveau après le téléchargement
                fetchDocuments();
            } else {
                setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status); // Affiche une erreur si le statut n'est pas 201
            }
        } catch (error) {
            setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message); // Capture et affiche une erreur
        } finally {
            setUploading(false); // Désactive le mode téléchargement
        }
    };

    // Récupère les documents de l'instructeur
    const fetchDocuments = async () => {
        try {
            const response = await apiClient.get(`/instructor/documents/${id}`);
            setDocuments(response.data.documents || []); // Mettez à jour l'état des documents
        } catch (error) {
            setError("Erreur lors de la récupération des documents. Détails: " + error.message);
        }
    };

    // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
    //ette fonction télécharge un fichier ZIP, crée un lien temporaire pour démarrer le téléchargement,
    // puis supprime le lien une fois que le téléchargement est lancé.
    const handleDownloadDocuments = async () => {
        try {
            const response = await apiClient.get(`/document/download/${id}`, {
                responseType: 'blob', // Cette ligne envoie une requête au serveur pour obtenir un fichier ZIP 
                //lié à un instructeur (identifié par id).Le responseType: 'blob' signifie que la réponse attendue est un fichier binaire
                // (comme un fichier ZIP).
            });
            const url = window.URL.createObjectURL(new Blob([response.data])); 
            // Crée un objet de type blob à partir des données du fichier.
            //Génère une URL temporaire pour ce blob, permettant de le télécharger configure pour pointer vers l'URL du fichier.
            const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
            link.href = url;
            link.setAttribute('download', `document${id}.zip`); // Le nom de fichier sera document{id}.zip (ex., document5.zip si id vaut 5).
            //Ajoute le lien au document pour qu’il puisse être cliqué.
            //Simule un clic pour démarrer le téléchargement, puis supprime le lien pour nettoyer la page.
            
            document.body.appendChild(link);
            link.click(); // Déclenche le téléchargement du fichier
            document.body.removeChild(link); // Supprime le lien de la page
        } catch (error) {
            setError("Erreur lors du téléchargement des documents. Détails: " + error.message); // Affiche une erreur en cas de problème
        }
    };

    // Redirige l'utilisateur vers la liste des instructeurs
    const handleBackToList = () => {
        navigate('/instructors');
    };

    // Redirige l'utilisateur vers la page de connexion

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
            console.log(file);
            formData.append('documents', file);
        });
        formData.append('instructorId', id); // Assurez-vous que `id` est bien la bonne valeur

        try {
            setUploading(true);
            const response = await apiClient.post(`/instructor/document/add`, formData);

            if (response.status === 200) {
                alert("Fichiers téléchargés avec succès");
                setSelectedFiles(null);
                await fetchDocuments(); // Récupère les documents mis à jour
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

    const handleDownloadDocuments = async () => {
        try {
            const response = await apiClient.get(`/document/download/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document${id}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setError("Erreur lors du téléchargement des documents : " + error.message);
        }
    };

    const handleBackToList = () => {
        navigate('/instructors');
    };

    const handleLogout = () => {
        navigate('/connexion');
    };

    // Affiche un message de chargement pendant le chargement des données
    if (loading) {
        return <div>Chargement des données...</div>;
    }

    // Affiche le message d'erreur si une erreur est détectée
    if (error) {
        return <div className="alert alert-danger">{error}</div>;
        return <div className="alert alert-danger">{error}</div>;
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

            <h3>Ajouter un document</h3>
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
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{doc.type}</h5>
                                    <a href={doc.document} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                        Voir Document
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun document trouvé pour cet instructeur.</p>
            )}

            <div className="d-flex justify-content-between mt-4">
            <h3>Ajouter un document</h3>
            <input type="file" onChange={(e) => handleFileChange(e)} multiple />
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
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{doc.type}</h5>
                                    
                                    <img src={`data:image/jpg;base64, ${documents.document}`}   /> 
                                 
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucun document trouvé pour cet instructeur.</p>
            )}

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary" onClick={handleBackToList}>
                    Retour à la liste des moniteurs
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default InstructorProfilPage;


// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours
//     const [documents, setDocuments] = useState([]); // Stocke les documents de l'instructeur

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//                 setDocuments(response.data.documents || []); // Assurez-vous que les documents sont également récupérés
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             console.log(response);

//             if (response.status === 200) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//                 navigate(`/instructor/${id}`); // Redirige vers la page de l'instructeur après le téléchargement
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents. Détails: " + error.message); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
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
//                 <ul className="list-group">
//                     {documents.map((doc) => (
//                         <li key={doc.id} className="list-group-item">
//                             <a href={doc.document} target="_blank" rel="noopener noreferrer">{doc.type}</a>
//                         </li>
//                     ))}
//                 </ul>
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


// Importe les modules React et les hooks nécessaires // TEST DE LA PAGE PROFIL INSTRUCTEUR
// Importe les modules React et les hooks nécessaires
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 // Effectue une requête GET pour récupérer les détails de l'instructeur
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             if (response.status === 201) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//                 navigate(`/instructor/${id}`); // Redirige vers la page de l'instructeur après le téléchargement
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers"); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers"); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents"); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
//     if (error) {
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// // Importe les modules React et les hooks nécessaires
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 // Effectue une requête GET pour récupérer les détails de l'instructeur
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             if (response.status === 201) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers"); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers"); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents"); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
//     if (error) {
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
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
//     const [selectedFiles, setSelectedFiles] = useState(null); // Changement pour permettre plusieurs fichiers

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Met à jour pour prendre en charge plusieurs fichiers
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // 'documents' correspond au nom du champ
//         });
//         formData.append('instructorId', id); // Assurez-vous que cela est pris en compte dans votre backend

//         try {
//             await apiClient.post('instructor/document/add', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setSelectedFiles(null);
//             alert("Fichiers téléchargés avec succès");
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers");
//         }
//     };
//     console.log('essai n°1 ', instructor);

//     // Fonction pour gérer le téléchargement des documents de l'instructeur
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
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
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple /> {/* Ajoutez multiple ici */}
//             <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
//                 Télécharger le fichier
//             </button>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
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
//     const [selectedFile, setSelectedFile] = useState(null);

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFile) {
//             setError("Veuillez sélectionner un fichier à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('document', selectedFile);
//         formData.append('instructorId', id);

//         try {
//             await apiClient.post('/document/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setSelectedFile(null);
//             alert("Fichier téléchargé avec succès");
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier");
//         }
//     };

//     // Fonction pour gérer le téléchargement des documents de l'instructeur
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
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
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} />
//             <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
//                 Télécharger le fichier
//             </button>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;



// // // src/pages/InstructorPage/InstructorProfilPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document${id}`, {
//                 responseType: 'blob', // Reçoit le document sous forme de blob pour le téléchargement
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Nom du fichier téléchargé
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
//         }
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;



// // src/pages/InstructorPage/InstructorProfilPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = () => {
//         // Remplacez l'URL ci-dessous par la route de votre backend pour télécharger les documents
//         const downloadUrl = `/documents/download/${id}`; // Supposons que vous ayez une route qui utilise l'ID du moniteur
//         window.location.href = downloadUrl; // Redirige vers l'URL de téléchargement
//     };

//     const handleLogout = () => {
//         // Logique pour déconnecter l'utilisateur
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;

// // // src/pages/InstructorPage/InstructorProfilPage.jsx TEST avec boutton "retour à la la liste des moniteurs",
// //"télécharger" n et bouton "déconnexion"


// // src/pages/InstructorPage/InstructorProfilPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = () => {
//         // Logique pour télécharger les documents du moniteur
//         alert("Téléchargement des documents du moniteur en cours...");
//     };

//     const handleLogout = () => {
//         // Logique pour déconnecter l'utilisateur
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;

// //corection telechargment des images
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

//     // Récupération des détails de l'instructeur et de ses documents
//     useEffect(() => {
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
//                                     <a href={doc.document} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
//                                         Voir Document
//                                     </a>
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
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours
//     const [documents, setDocuments] = useState([]); // Stocke les documents de l'instructeur

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//                 setDocuments(response.data.documents || []); // Assurez-vous que les documents sont également récupérés
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         console.log("Tableau des documents chargés :", event.target.files)
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post(`/instructor/document/add`, formData); // Envoie les fichiers au backend

//             if (response.status === 200) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//                 // Récupérez les documents à nouveau après le téléchargement
//                 fetchDocuments();
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Récupère les documents de l'instructeur
//     const fetchDocuments = async () => {
//         try {
//             console.log("On entre dans la fonction fetchDocuments !")
//             const response = await apiClient.get(`/instructor/get/${id}`);
//             console.log('Notre réponse est :', response)
//             setDocuments(response.data.documents || []); // Mettez à jour l'état des documents
//         } catch (error) {
//             setError("Erreur lors de la récupération des documents. Détails: " + error.message);
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     //ette fonction télécharge un fichier ZIP, crée un lien temporaire pour démarrer le téléchargement,
//     // puis supprime le lien une fois que le téléchargement est lancé.
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Cette ligne envoie une requête au serveur pour obtenir un fichier ZIP 
//                 //lié à un instructeur (identifié par id).Le responseType: 'blob' signifie que la réponse attendue est un fichier binaire
//                 // (comme un fichier ZIP).
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); 
//             // Crée un objet de type blob à partir des données du fichier.
//             //Génère une URL temporaire pour ce blob, permettant de le télécharger configure pour pointer vers l'URL du fichier.
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`); // Le nom de fichier sera document{id}.zip (ex., document5.zip si id vaut 5).
//             //Ajoute le lien au document pour qu’il puisse être cliqué.
//             //Simule un clic pour démarrer le téléchargement, puis supprime le lien pour nettoyer la page.
            
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents. Détails: " + error.message); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
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
//                                     <a href={doc.document} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
//                                         Voir Document
//                                     </a>
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
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours
//     const [documents, setDocuments] = useState([]); // Stocke les documents de l'instructeur

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//                 setDocuments(response.data.documents || []); // Assurez-vous que les documents sont également récupérés
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             console.log(response);

//             if (response.status === 200) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//                 navigate(`/instructor/${id}`); // Redirige vers la page de l'instructeur après le téléchargement
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers. Statut: " + response.status); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers. Détails: " + error.message); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `document${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents. Détails: " + error.message); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
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
//                 <ul className="list-group">
//                     {documents.map((doc) => (
//                         <li key={doc.id} className="list-group-item">
//                             <a href={doc.document} target="_blank" rel="noopener noreferrer">{doc.type}</a>
//                         </li>
//                     ))}
//                 </ul>
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


// Importe les modules React et les hooks nécessaires // TEST DE LA PAGE PROFIL INSTRUCTEUR
// Importe les modules React et les hooks nécessaires
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 // Effectue une requête GET pour récupérer les détails de l'instructeur
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             if (response.status === 201) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//                 navigate(`/instructor/${id}`); // Redirige vers la page de l'instructeur après le téléchargement
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers"); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers"); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents"); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
//     if (error) {
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;


// // Importe les modules React et les hooks nécessaires
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client'; // Importe le client API pour interagir avec le backend

// const InstructorProfilPage = () => {
//     const { id } = useParams(); // Récupère l'ID de l'instructeur à partir de l'URL
//     const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
//     const [instructor, setInstructor] = useState(null); // Stocke les informations de l'instructeur
//     const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
//     const [error, setError] = useState(''); // Stocke les messages d'erreur à afficher
//     const [selectedFiles, setSelectedFiles] = useState(null); // Stocke les fichiers sélectionnés pour téléchargement
//     const [uploading, setUploading] = useState(false); // Indique si un téléchargement est en cours

//     // Utilise useEffect pour récupérer les données de l'instructeur au chargement de la page
//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 // Effectue une requête GET pour récupérer les détails de l'instructeur
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data); // Stocke les données de l'instructeur
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur"); // Définit un message d'erreur
//             } finally {
//                 setLoading(false); // Désactive le mode chargement
//             }
//         };

//         fetchInstructor(); // Appelle la fonction pour récupérer les données de l'instructeur
//     }, [id]); // Exécute useEffect uniquement lorsque l'ID change

//     // Met à jour selectedFiles lorsque l'utilisateur sélectionne des fichiers
//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Stocke les fichiers sélectionnés
//     };

//     // Gère l'upload de fichiers vers le backend
//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return; // Arrête l'exécution si aucun fichier n'est sélectionné
//         }

//         const formData = new FormData(); // Crée un objet FormData pour contenir les fichiers
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // Ajoute chaque fichier à formData avec le nom de champ 'documents'
//         });
//         formData.append('instructorId', id); // Ajoute l'ID de l'instructeur à formData

//         try {
//             setUploading(true); // Active le mode téléchargement
//             const response = await apiClient.post('/instructor/document/add', formData, {}); // Envoie les fichiers au backend

//             if (response.status === 201) { // Vérifie si le téléchargement a réussi
//                 alert("Fichiers téléchargés avec succès");
//                 setSelectedFiles(null); // Réinitialise les fichiers sélectionnés
//             } else {
//                 setError("Erreur lors du téléchargement des fichiers"); // Affiche une erreur si le statut n'est pas 201
//             }
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers"); // Capture et affiche une erreur
//         } finally {
//             setUploading(false); // Désactive le mode téléchargement
//         }
//     };

//     // Gère le téléchargement des documents de l'instructeur sous forme de fichier ZIP
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob', // Indique que la réponse sera de type blob pour les fichiers binaires
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data])); // Crée une URL pour le blob
//             const link = document.createElement('a'); // Crée un élément de lien pour le téléchargement
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Définit le nom du fichier à télécharger
//             document.body.appendChild(link);
//             link.click(); // Déclenche le téléchargement du fichier
//             document.body.removeChild(link); // Supprime le lien de la page
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents"); // Affiche une erreur en cas de problème
//         }
//     };

//     // Redirige l'utilisateur vers la liste des instructeurs
//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     // Redirige l'utilisateur vers la page de connexion
//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     // Affiche un message de chargement pendant le chargement des données
//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     // Affiche le message d'erreur si une erreur est détectée
//     if (error) {
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple />
//             <button 
//                 className="btn btn-primary mt-2" 
//                 onClick={handleFileUpload}
//                 disabled={uploading}
//             >
//                 {uploading ? "Téléchargement en cours..." : "Télécharger les fichiers"}
//             </button>

//             {error && <div className="alert alert-danger mt-2">{error}</div>}

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
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
//     const [selectedFiles, setSelectedFiles] = useState(null); // Changement pour permettre plusieurs fichiers

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFiles(event.target.files); // Met à jour pour prendre en charge plusieurs fichiers
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFiles || selectedFiles.length === 0) {
//             setError("Veuillez sélectionner un ou plusieurs fichiers à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         Array.from(selectedFiles).forEach((file) => {
//             formData.append('documents', file); // 'documents' correspond au nom du champ
//         });
//         formData.append('instructorId', id); // Assurez-vous que cela est pris en compte dans votre backend

//         try {
//             await apiClient.post('instructor/document/add', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setSelectedFiles(null);
//             alert("Fichiers téléchargés avec succès");
//         } catch (error) {
//             setError("Erreur lors du téléchargement des fichiers");
//         }
//     };
//     console.log('essai n°1 ', instructor);

//     // Fonction pour gérer le téléchargement des documents de l'instructeur
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
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
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} multiple /> {/* Ajoutez multiple ici */}
//             <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
//                 Télécharger le fichier
//             </button>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
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
//     const [selectedFile, setSelectedFile] = useState(null);

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchInstructor();
//     }, [id]);

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleFileUpload = async () => {
//         if (!selectedFile) {
//             setError("Veuillez sélectionner un fichier à télécharger.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append('document', selectedFile);
//         formData.append('instructorId', id);

//         try {
//             await apiClient.post('/document/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setSelectedFile(null);
//             alert("Fichier téléchargé avec succès");
//         } catch (error) {
//             setError("Erreur lors du téléchargement du fichier");
//         }
//     };

//     // Fonction pour gérer le téléchargement des documents de l'instructeur
//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document/download/${id}`, {
//                 responseType: 'blob',
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`);
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
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
//         return <div>{error}</div>;
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
//             <input type="file" onChange={handleFileChange} />
//             <button className="btn btn-primary mt-2" onClick={handleFileUpload}>
//                 Télécharger le fichier
//             </button>

//             <div className="d-flex justify-content-between mt-4">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;



// // // src/pages/InstructorPage/InstructorProfilPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = async () => {
//         try {
//             const response = await apiClient.get(`/document${id}`, {
//                 responseType: 'blob', // Reçoit le document sous forme de blob pour le téléchargement
//             });
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `documents_moniteur_${id}.zip`); // Nom du fichier téléchargé
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//         } catch (error) {
//             setError("Erreur lors du téléchargement des documents");
//         }
//     };

//     const handleLogout = () => {
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;



// // src/pages/InstructorPage/InstructorProfilPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = () => {
//         // Remplacez l'URL ci-dessous par la route de votre backend pour télécharger les documents
//         const downloadUrl = `/documents/download/${id}`; // Supposons que vous ayez une route qui utilise l'ID du moniteur
//         window.location.href = downloadUrl; // Redirige vers l'URL de téléchargement
//     };

//     const handleLogout = () => {
//         // Logique pour déconnecter l'utilisateur
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;

// // // src/pages/InstructorPage/InstructorProfilPage.jsx TEST avec boutton "retour à la la liste des moniteurs",
// //"télécharger" n et bouton "déconnexion"


// // src/pages/InstructorPage/InstructorProfilPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import apiClient from '../../api/api-client';

// const InstructorProfilPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [instructor, setInstructor] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchInstructor = async () => {
//             try {
//                 const response = await apiClient.get(`/instructor/get/${id}`);
//                 setInstructor(response.data);
//             } catch (error) {
//                 setError("Erreur lors de la récupération des détails du moniteur");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInstructor();
//     }, [id]);

//     const handleBackToList = () => {
//         navigate('/instructors');
//     };

//     const handleDownloadDocuments = () => {
//         // Logique pour télécharger les documents du moniteur
//         alert("Téléchargement des documents du moniteur en cours...");
//     };

//     const handleLogout = () => {
//         // Logique pour déconnecter l'utilisateur
//         navigate('/connexion');
//     };

//     if (loading) {
//         return <div>Chargement des données...</div>;
//     }

//     if (error) {
//         return <div>{error}</div>;
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

//             <div className="d-flex justify-content-between">
//                 <button className="btn btn-primary" onClick={handleBackToList}>
//                     Retour à la liste des moniteurs
//                 </button>
//                 <button className="btn btn-secondary" onClick={handleDownloadDocuments}>
//                     Télécharger les documents
//                 </button>
//                 <button className="btn btn-danger" onClick={handleLogout}>
//                     Déconnexion
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default InstructorProfilPage;




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
