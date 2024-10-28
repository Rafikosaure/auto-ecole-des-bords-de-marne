const jwt = require("jsonwebtoken");
const { ENV } = require("../config/env.js");
const { createError,
    contexts,
    errors,
    errorHandler } = require('./errorHandler.js');
/**
 * Checks if a cookie is sent with the request and its validity.
 * @param {object} req - Http(s) request.
 * @param {object} res - Http(s) response.
 * @param {Function} next - built-in express function.
 * @returns {Function} `next()`, granting access to the next middleware if both checks are successful.
 */
const verifyToken = (req, res, next) => {
    try {
        // Récupère le jeton (token) JWT à partir des cookies de la requête

        const token = req.cookies.access_token;

        // Si le jeton (token) n'est pas présent,
        // renvoie une erreur 401 (accès refusé)
        if (!token) throw createError(req, errors.ErrorNoToken, contexts.Token);

        // Vérifier la validité du jeton en utilisant jwt.verify
        jwt.verify(token, ENV.TOKEN, (error, user) => {
            // si une erreur se produit lors de la vérification du jeton
            if (error) {
                // Renvoie une erreur 403 (interdit)
                // car le jeton (token) n'est pas valide
                throw createError(req, errors.ErrorInvalidToken, contexts.Token);
            }
            // si la vérification réussit,
            // ajoute les information de l'utilisateur
            // dans l'objet req
            req.user = user;

            return next();
        });
    } catch (error) {
        if (error.status == 401) return next(errorHandler(req, res, error, contexts.Token));
        return next(errorHandler(req, res, error, contexts.invalidToken));
    }
};

exports.verifyToken = verifyToken;