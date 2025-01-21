import axios from "axios";
import config from "../../config";


// Fonction de nettoyage des fichiers inutiles côté serveur
const deleteFilesAfterProcessing = (studentId) => {
    axios.delete(`${config.apiBaseUrl}/document/deleteDocumentsAfterContractGeneration/${studentId}`,)
    .then(response => {
        // console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
}

export default deleteFilesAfterProcessing;