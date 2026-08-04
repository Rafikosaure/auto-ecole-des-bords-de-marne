import config from "../../../config";


// Fonction de nettoyage des fichiers inutiles côté serveur
const deleteFilesAfterProcessing = (studentId) => {
    fetch(`${config.apiBaseUrl}/document/deleteDocumentsAfterContractGeneration/${studentId}`, {
        method: "DELETE",
        credentials: "include",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
    })
    .catch(error => {
        console.error(error)
    })
}

export default deleteFilesAfterProcessing;