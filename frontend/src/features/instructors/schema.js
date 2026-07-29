import { z } from 'zod';

export const instructorFormSchema = z.object({
  lastName: z.string().min(1, 'Le nom de famille est requis'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  email: z.string().min(1, "L'email est requis").email('Adresse email invalide'),
  phoneNumber: z.string(),
  adress: z.string(),
  speciality: z.array(z.string()),
});
