import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInstructor, useUploadInstructorDocument, useDeleteInstructorDocument } from './api';

const cardTypes = [
  "carte d'identité",
  'Permis de conduire',
  "Carte d'enseignement",
  'Contrat de travail',
];

const InstructorProfilPage = () => {
  const { id } = useParams();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState('');
  const cardRefs = useRef({});

  const { data: instructor, isLoading } = useInstructor(id);
  const uploadDocument = useUploadInstructorDocument();
  const deleteDocument = useDeleteInstructorDocument(id);

  const documents = instructor?.documents || [];

  const handleUpload = async (type, files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('documents', files[0]);
    formData.append('instructorId', id);
    formData.append('filesType', JSON.stringify([type]));

    try {
      const res = await uploadDocument.mutateAsync(formData);
      if (res.status === 200) {
        alert(`${type} téléchargé avec succès !`);
      } else {
        setError('Erreur lors du téléchargement du fichier.');
      }
    } catch (error) {
      setError('Erreur lors du téléchargement du fichier : ' + error.message);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      return;
    }

    try {
      const response = await deleteDocument.mutateAsync(documentId);
      if (response.status === 200) {
        alert('Document supprimé avec succès');
      } else {
        setError('Erreur lors de la suppression du document.');
      }
    } catch (error) {
      setError('Erreur lors de la suppression du document : ' + error.message);
    }
  };

  const openDocument = (document) => setSelectedDocument(document);
  const closeDocument = () => setSelectedDocument(null);
  const openFileInput = (type) => cardRefs.current[type]?.click();

  if (isLoading) {
    return <div>Chargement des données...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const displayCards = cardTypes.map((type) => {
    const document = documents.find((doc) => doc.type === type);

    return (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={type} style={{ cursor: 'pointer' }}>
        <div className="card border border-dark rounded">
          <div className="card-body p-0">
            <h5
              className="card-title text-decoration-underline"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                openFileInput(type);
              }}
            >
              {type}
            </h5>
            <div
              className="d-flex justify-content-center align-items-center border border-dark rounded overflow-hidden"
              style={{ height: '200px' }}
              onClick={() => document && openDocument(document)}
            >
              {document ? (
                document.baseExtension !== 'pdf' ? (
                  <img
                    className="h-100 w-auto"
                    style={{ objectFit: 'contain' }}
                    src={`data:image/${document.baseExtension};base64, ${document.document}`}
                    alt={type}
                  />
                ) : (
                  <iframe
                    src={`data:application/pdf;base64,${document.document}`}
                    title={`Document PDF - ${type}`}
                    className="w-100 h-100"
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
                  openFileInput(type);
                }}
              >
                Télécharger
              </button>
              <button
                className="btn btn-info mt-2 w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  openDocument(document);
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
          className="d-none"
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

      <div className="row">{displayCards}</div>

      {selectedDocument && (
        <div className="modal bg-black bg-opacity-50" style={{ display: 'block' }}>
          <div className="modal-dialog mt-2" style={{ maxWidth: '90%' }}>
            <div className="modal-content" style={{ height: '80vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">Document {selectedDocument.type}</h5>
                <button type="button" className="btn-close" onClick={closeDocument}></button>
              </div>
              <div className="modal-body">
                {selectedDocument.baseExtension !== 'pdf' ? (
                  <img
                    className="w-100 h-auto"
                    style={{ objectFit: 'contain' }}
                    src={`data:image/${selectedDocument.baseExtension};base64, ${selectedDocument.document}`}
                    alt={selectedDocument.type}
                  />
                ) : (
                  <iframe
                    src={`data:application/pdf;base64,${selectedDocument.document}`}
                    title={`Document PDF - ${selectedDocument.type}`}
                    className="w-100 h-100"
                  />
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDocument}>
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
