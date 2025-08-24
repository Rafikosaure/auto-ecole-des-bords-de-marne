import axios from 'axios'
import Button from 'react-bootstrap/Button';
import deleteFilesAfterProcessing from './deleteFilesAfterProcessing';
import { useSelector } from 'react-redux';
import { selectPrintFileData } from '../../redux/slices/printFileDataSlice';
import config from '../../config';



export default function PrintContractButton({ setNumberOfComponent, student }) {

  // Redux store
  const fetchData = useSelector(selectPrintFileData)

  // Fonction de téléchargement du contrat de formation
  const downloadFile = async () => {
    try {
      // Envoie la requête POST avec axios

      const response = await axios.post(
        `${config.apiBaseUrl}/document/downloadOneDocument/${student.id}`,
        fetchData, // Données envoyées dans le corps de la requête
        { responseType: 'blob' } // Important pour que axios interprète la réponse en tant que blob
      );

      // Crée un blob pour le fichier
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Crée un lien de téléchargement temporaire
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Contrat_Stagiaire.pdf'; // Nom du fichier à télécharger
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Libère l'URL après le téléchargement
      window.URL.revokeObjectURL(downloadUrl);
     

      // Appel de la fonction de nettoyage des fichiers inutiles côté serveur
      deleteFilesAfterProcessing(student.id)
      setNumberOfComponent(1)
      // dispatch(reinitializeState())
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  }


return (
    <Button variant="primary" onClick={downloadFile}>Télécharger le fichier</Button>
  )
}