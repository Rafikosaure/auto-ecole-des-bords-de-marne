import axios from "axios";


// Fonction de nettoyage des fichiers inutiles côté serveur
const deleteFilesAfterProcessing = (studentId) => {
    axios.delete(`http://localhost:3001/api/document/deleteDocumentsAfterContractGeneration/${studentId}`,)
    .then(response => console.log(response))
    .catch(error => {
        console.log(error)
    })
}

export default deleteFilesAfterProcessing;