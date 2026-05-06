import axios from "axios";
import config from "../../config";


// Fonction de nettoyage des fichiers inutiles côté serveur
const deleteFilesAfterProcessing = (studentId) => {
    axios.delete(`${config.apiBaseUrl}/document/deleteDocumentsAfterContractGeneration/${studentId}`,)
    .catch(error => {
        console.error(error)
    })
}

export default deleteFilesAfterProcessing;