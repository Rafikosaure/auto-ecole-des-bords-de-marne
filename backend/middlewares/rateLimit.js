const rateLimit = require('express-rate-limit');

// Limite les tentatives de connexion pour freiner le bruteforce de mot de passe.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.' },
});

// Limite les demandes de réinitialisation de mot de passe (abus d'envoi d'email).
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TooManyRequests', message: 'Trop de demandes, veuillez réessayer plus tard.' },
});

exports.loginLimiter = loginLimiter;
exports.forgotPasswordLimiter = forgotPasswordLimiter;
