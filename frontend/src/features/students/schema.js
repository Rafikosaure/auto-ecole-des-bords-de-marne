import { z } from 'zod';

export const studentSchema = z.object({
  lastName: z.string().min(1, 'Le nom de famille est requis'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  email: z.string().min(1, "L'email est requis").email('Adresse email invalide'),
  phoneNumber: z.string().min(1, 'Le numéro de téléphone est requis'),
  birthdate: z.string().min(1, 'La date de naissance est requise'),
  formationStart: z.string().min(1, 'La date de début de formation est requise'),
  formationDesiredEnd: z.string().min(1, 'La date de fin souhaitée est requise'),
  formationMaxEndingDate: z.string().min(1, 'La date maximale de fin est requise'),
  formationMaxDuration: z.string().min(1, 'La durée maximale est requise'),
});
