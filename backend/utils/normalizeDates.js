// Le frontend envoie tous les champs de formulaire sous forme de chaînes de
// caractères (inputs HTML), mais Prisma est strict sur les types déclarés
// dans le schéma et rejette toute incohérence (PrismaClientValidationError)
// avant même d'atteindre la base de données. On normalise ici les champs
// Student dont le type Prisma n'est pas String.
const STUDENT_DATE_FIELDS = ['birthdate', 'formationStart', 'formationDesiredEnd', 'formationMaxEndingDate'];
const STUDENT_INT_FIELDS = ['formationMaxDuration'];

// Liste blanche des champs réellement modifiables par un appelant : évite
// qu'un corps de requête ne fournisse des champs additionnels (id, createdAt,
// updatedAt, ou une écriture imbriquée sur les relations documents/remarks)
// qui seraient sinon transmis tels quels à Prisma.
const STUDENT_WRITABLE_FIELDS = [
    'lastName', 'firstName', 'email', 'phoneNumber',
    'birthdate', 'formationStart', 'formationDesiredEnd', 'formationMaxEndingDate',
    'formationMaxDuration', 'isRemote',
];

const normalizeStudentPayload = (body) => {
    const normalized = {};
    for (const field of STUDENT_WRITABLE_FIELDS) {
        if (body[field] !== undefined) normalized[field] = body[field];
    }
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
