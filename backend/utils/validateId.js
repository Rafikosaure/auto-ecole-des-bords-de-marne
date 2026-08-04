// Un identifiant d'étudiant/instructeur (clé Prisma auto-incrémentée) doit
// toujours être un entier positif. Utilisé pour valider les paramètres de
// route avant de les injecter dans un chemin de fichier, afin d'empêcher
// toute traversée de répertoire (ex: studentId = "../../../../etc/passwd").
exports.isValidId = (value) => /^[1-9]\d*$/.test(String(value));
