// Le frontend envoie tous les champs de formulaire sous forme de chaînes de
// caractères (inputs HTML), mais Prisma est strict sur les types déclarés
// dans le schéma et rejette toute incohérence (PrismaClientValidationError)
// avant même d'atteindre la base de données. On normalise ici les champs
// Student dont le type Prisma n'est pas String.
const STUDENT_DATE_FIELDS = ['birthdate', 'formationStart', 'formationDesiredEnd', 'formationMaxEndingDate'];
const STUDENT_INT_FIELDS = ['formationMaxDuration'];

const normalizeStudentPayload = (body) => {
    const normalized = { ...body };
    for (const field of STUDENT_DATE_FIELDS) {
        if (normalized[field] !== undefined && normalized[field] !== null && normalized[field] !== '') {
            normalized[field] = new Date(normalized[field]);
        }
    }
    for (const field of STUDENT_INT_FIELDS) {
        if (normalized[field] !== undefined && normalized[field] !== null && normalized[field] !== '') {
            normalized[field] = parseInt(normalized[field], 10);
        }
    }
    return normalized;
};

module.exports = { normalizeStudentPayload };
