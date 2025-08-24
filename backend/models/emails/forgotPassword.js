/**
 * sets the template for a password reset email.
 * @param {string} username - name/username of the recipient.
 * @param {string} date - current date dd/MM/YYYY (french format).
 * @param {string} time - current time HH:mm (french format).
 * @param {string} link - the reset link.
 */
exports.forgotPasswordTemplate = (username, date, time, link) => {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #333333;
            font-size: 24px;
            margin: 0;
        }
        .content {
            line-height: 1.6;
            color: #555555;
            font-size: 16px;
        }
        .btn-reset {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007BFF;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .btn-reset:hover {
            background-color: #0056b3;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
            margin-top: 20px;
        }
        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container {
                padding: 15px;
                border-radius: 6px;
            }
            .header h1 {
                font-size: 20px;
            }
            .content {
                font-size: 14px;
            }
            .btn-reset {
                font-size: 14px;
                padding: 8px 15px;
            }
        }
        @media screen and (max-width: 400px) {
            .content {
                font-size: 13px;
            }
            .btn-reset {
                font-size: 13px;
                padding: 6px 12px;
            }
        }
    </style>
</head>
<body>
    <img src="../../assets/pixel.png" alt="pixel de suivi" style="display: none; width: 1px; height: 1px; visibility: hidden;"/>
    <div class="email-container">
        <div class="header">
            <h1>Réinitialisation de votre mot de passe</h1>
        </div>
        <div class="content">
            <p>Bonjour ${username},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe administrateur le ${date} à ${time}. Pour procéder, veuillez cliquer sur le bouton ci-dessous (lien valide pendant 10 minutes) :</p>
            <p style="text-align: center;">
                <a href="${link}" class="btn-reset">Réinitialiser mon mot de passe</a>
            </p>
            <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email. Votre mot de passe actuel restera inchangé.</p>
        </div>
        <div class="footer">
            <p>© auto-ecole-des-bords-de-marne - Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
`;
};