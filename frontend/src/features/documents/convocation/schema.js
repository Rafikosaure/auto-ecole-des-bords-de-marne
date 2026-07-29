import { z } from 'zod';

// Une date au format JJ/MM/AAAA, dont la validité calendaire réelle est vérifiée
// (remplace le bloc de validation mort de l'ancien ConvocationFormation.jsx).
export const dateStringSchema = z.string().refine((value) => {
  const [day, month, year] = value.split('/');
  if (!day || !month || !year) return false;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getMonth() === Number(month) - 1;
}, { message: 'Date invalide (format attendu JJ/MM/AAAA)' });

export const dateParts = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return { day, month, year };
};

// Champs édités dans le formulaire "convocation formation" (document PDF joint).
export const convocationFormSchema = z.object({
  documentTitle: z.string().min(1, 'Le titre du document est requis'),
  studentFirstName: z.string().min(1, 'Le prénom est requis'),
  studentLastName: z.string().min(1, 'Le nom est requis'),
  formationTitle: z.string().min(1, 'Le titre de la formation est requis'),
  formationStartDate: dateStringSchema,
  formationEndingDesiredDate: dateStringSchema,
  formationMaxEndingDate: dateStringSchema,
  drivingPracticeDuration: z.string().min(1, 'La durée est requise'),
});

// Forme exacte du payload envoyé à POST /email/send-mail/:studentId
// (contrat avec backend/controllers/email.controller.js — sendMail).
export const emailPayloadSchema = z.object({
  emailType: z.enum(['convocationFormation', 'relaunch', 'convocationExam']),
  studentData: z.object({
    studentFirstName: z.string(),
    studentLastName: z.string(),
    studentEmail: z.string().email(),
  }),
  schoolData: z.object({
    location: z.object({
      number: z.string(),
      street: z.string(),
      town: z.string(),
    }),
  }),
  formationData: z.object({
    formationTitle: z.string().optional(),
    drivingTestExamDatetime: z
      .object({ examDate: z.string(), examHour: z.string() })
      .optional(),
    formationStartDate: z
      .object({ day: z.string(), month: z.string(), year: z.string() })
      .optional(),
    formationEndingDesiredDate: z
      .object({ day: z.string(), month: z.string(), year: z.string() })
      .optional(),
    formationMaxEndingDate: z
      .object({ day: z.string(), month: z.string(), year: z.string() })
      .optional(),
    formationDuration: z.object({ drivingPractice: z.string() }).optional(),
  }),
  fileData: z
    .object({
      documentType: z.literal('convocationFormation'),
      documentTitle: z.string(),
      dateTime: z.string(),
    })
    .optional(),
});
