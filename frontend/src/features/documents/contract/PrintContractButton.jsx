import Button from 'react-bootstrap/Button';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import deleteFilesAfterProcessing from './deleteFilesAfterProcessing';
import { buildContractPayload, contractSchema } from './schema';
import config from '../../../config';

// Doit être rendu à l'intérieur du même <FormProvider> que ContractForm
// (voir PrintContractView.jsx) — remplace la lecture du store Redux qui ne
// servait qu'à faire transiter les données entre ces deux composants frères.
export default function PrintContractButton({ setNumberOfComponent, student }) {
  const { getValues } = useFormContext();

  const downloadFile = async () => {
    const payload = buildContractPayload(getValues());
    const validation = contractSchema.safeParse(payload);
    if (!validation.success) {
      console.error(validation.error);
      toast.error("Le contrat contient des données invalides, veuillez vérifier les champs saisis.");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/document/downloadOneDocument/${student.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validation.data),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Contrat_Stagiaire.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      deleteFilesAfterProcessing(student.id);
      setNumberOfComponent(1);
    } catch (error) {
      console.error('Erreur lors du téléchargement :', error);
    }
  };

  return (
    <Button variant="primary" onClick={downloadFile}>Télécharger le fichier</Button>
  );
}
