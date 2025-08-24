
exports.emailConvocFormation = (data, datetime) => {
    return (
        `
        <!DOCTYPE html>
        <html>
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <title></title>
            </head>
            <body style="font-family: sans-serif;">
            <img src="../../assets/pixel.png" alt="pixel de suivi" style="display: none; width: 1px; height: 1px; visibility: hidden;"/>
            <div style="display: block; margin: auto; max-width: 800px; width: 90%;" class="main">
            <p>Envoyé le ${datetime}</p><br>
            <br>
            <p style="margin-bottom:0.21cm" align="justify"></p>
            <p style="font-weight: bold"><font color="#1C1C1C"><font face="Arial, sans-serif"><font size="4">Bonjour ${data.studentData.studentFirstName} ${data.studentData.studentLastName},</font></font></font></p>
            <p style="margin-bottom:0.21cm" align="justify"><font color="#000000"><font face="Arial, sans-serif"><font size="3"><b>Vous êtes convoquée pour la formation</b></font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3">:</font></font></font> <strong><font color="#000000"><font face="Arial, sans-serif"><font size="3"><span style="font-weight:normal">${data.formationData.formationTitle}</span></font></font></font></strong></p>
            <p style="margin-bottom:0.21cm" align="justify"><strong><font color="#000000"><font face="Arial, sans-serif"><font size="3"><b>Dates de la formation</b></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font size="3">:</font></font></font><font color="#000000"><font face="Arial, sans-serif"><font size="3"><b>DÉBUT :</b></font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3">${data.formationData.formationStartDate.day}</font></font></font><font color="#000000"><font face="Arial, sans-serif"><font size="3">/${data.formationData.formationStartDate.month}/${data.formationData.formationStartDate.year}–</font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3"><b>FIN :</b></font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3">${data.formationData.formationEndingDesiredDate.day}/${data.formationData.formationEndingDesiredDate.month}/${data.formationData.formationEndingDesiredDate.year} (8 Mois Maxi)</font></font></font></p>
            <p style="margin-bottom:0.21cm" align="left"><strong><font color="#000000"><font face="Arial, sans-serif"><font size="3"><b>Contenu de la formation</b></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font size="3">: Gestion et démarches Administratives + 1 livre de code + Accès en salle de code en illimité</font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">(valable 8 mois)</font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3">
            + 1 Packweb code en ligne</font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">(valable 4 mois)
            </font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font size="3">+ Livret numérique et pédagogique +30 Heures de conduite + Réservation d'une place d'examen sur «&nbsp;rdv permis&nbsp;» + 1 Présentation Pratique</font></font></font> <font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">(Accompagnement et mise à disposition d'un véhicule et présence d'un enseignant)</font></font></font></p>
            <p style="margin-bottom:0.21cm" align="justify"><strong><font color="#000000"><font face="Arial, sans-serif"><font size="2"><u><b>Objectifs Pédagogiques</b></u></font></font></font></strong></p>
            <p style="margin-bottom:0.21cm" align="left"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">- Connaître la réglementation routière<br>
            - Maîtriser le maniement du véhicule<br>
            - Appréhender la route dans des conditions Normales (Respecter les règles de circulation, adapter son allure aux situations, bien se placer (quelque soit le type de route)<br>
            - Circuler dans des conditions difficiles et partager la route avec les autres usagers.<br>
            - Pratiquer une conduite sûre et autonome<br>
            - Sensibilisation aux enjeux environnementaux et aux usagers vulnérables.</font></font></font></p>
            <p style="margin-bottom:0.21cm"><strong><font color="#000000"><font face="Arial, sans-serif"><font size="2"><u><b>Vous Trouverez en pièces jointes</b></u></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font size="2"><u><b>:</b></u></font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">1 - Le plan détaillé de la formation</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">2 - Le déroulement de la formation</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">3 - Le déroulement d'une séance pratique</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">4 - Le Règlement Intérieur</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">5 - Le Programme de Formation</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">6- CGU</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#222222"><font face="Arial, Helvetica, sans-serif"><font size="3"><b><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br></font></font></font><font color="#000000"><font face="Arial, sans-serif"><font size="4">Nos horaires d'ouverture:</font></font></font></b></font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><i><u><b>Bureau et salle de code</b></u></i><i><b>:</b></i><br>
            Lundi : 17h-20h<br>
            Du mardi au vendredi :16h-20h<br>
            Le samedi : 10h-12h</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><i><u><b>Cours de Conduite</b></u></i></font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">Lundi au vendredi: 8h-20h</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">Samedi : 8h-16h</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br></font></font></font><strong><font color="#000000"><font face="Arial, sans-serif"><font size="4"><u><b>Mode de réservation des cours:</b></u></font></font></font></strong></p>
            <p style="margin-bottom:0.21cm"><font color="#222222"><font face="Arial, Helvetica, sans-serif"><font size="3"><i><b><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><u>CODE</u></font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">:</font></font></font></b></i></font></font></font></p>
            <p style="margin-bottom:0.21cm"><strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><u><span style="font-weight:normal">
            Formation à distance:</span></u></font></font></font></strong><strong><font color="#000000"><font face="Arial, Helvetica, sans-serif"><font size="3"><span style="font-weight:normal">&nbsp;</span></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">un lien avec mot de passe pour la plate-forme PACKWEB vous sera fourni.
            </font></font></font></p>
            <p style="margin-bottom:0.21cm"><strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><u><span style="font-weight:normal">Formation en salle de code:</span></u></font></font></font></strong></p>
            <p style="margin-bottom:0.21cm"><strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><span style="font-weight:normal">-&nbsp;</span></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">Accès libre sans rdv aux horaires ci dessus ( Arrive toujours à heure pile)</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">- Une séance dure environ 50 min, vous pouvez faire plusieurs séances d'affilée.</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">- Vous munir d'un stylo et de votre livre de code</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font size="3"><font style="font-size:9pt"><u><b>CONDUITE</b></u></font><font style="font-size:9pt">: Par téléphone ou directement au bureau.</font></font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">Vous munir de votre pièce d'identité.</font></font></font></p>
            <p style="margin-bottom:0.21cm"><strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><u><span style="font-weight:normal">Services à proximité</span></u></font></font></font></strong><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><u>:</u></font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt">Transport:</font></font></font><em><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><span style="font-style:normal">bus 120, 210, RER A arrêt Bry-sur-Marne</span></font></font></font></em><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br>
            Restauration:</font></font></font><em><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><span style="font-style:normal">Pizzeria et restauration rapide</span></font></font></font></em><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br>
            Café, brasserie<br>
            Banques, Tabac-Presse</font></font></font></p>
            <p style="margin-bottom:0.21cm"><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">Auto-Ecole des Bords de Marne – 9 Grande rue Charles de Gaulle – 94360 Bry-sur-Marne</font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br></font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">Tél: 01.49.83.93.91 Mail&nbsp;:&nbsp;</font></font></font><a href="mailto:lmyw@sfr.fr" target="_blank"><font color="#4D90FE"><font face="Arial, sans-serif"><font size="1">lmyw@sfr.fr</font></font></font></a><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br></font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">Organisme de Formation enregistré à la DIRECCTE Île-de-France sous le numéro 11 94 056 55 94</font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:9pt"><br></font></font></font><font color="#000000"><font face="Arial, sans-serif"><font style="font-size:8pt">(cet enregistrement ne vaut pas agrément de l’État)</font></font></font></p>
            <div>
            <br>
            </div><span class="gmail_signature_prefix">--</span><br>
            <div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">
            <div dir="ltr">
            <font face="tahoma, sans-serif"><span style="color:rgb(0,0,0)"><b>AUTO ECOLE DES BORDS DE MARNE</b></span><br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
            <span style="color:rgb(0,0,0)">9 Grande rue Charles de Gaulle</span><br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
            <span style="color:rgb(0,0,0)">94360 BRY-SUR-MARNE</span><br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
            <span style="color:rgb(0,0,0)">Tél : 01 49.83.93.91</span><br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
            <span style="color:rgb(0,0,0)">E-mail : <a href="mailto:aebdm94@gmail.com" target="_blank">aebdm94@gmail.com</a></span></font>
            <div>
            <a href="https://www.autoecole-bordsdemarne.fr/" style="font-family:tahoma,sans-serif" target="_blank">www.autoecole-bordsdemarne.fr</a>
            </div>
            <div>
            <br>
            </div>
            <div>
            <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><font color="#0000CD">Etablissement adhérant de L'école de conduite française :&nbsp;</font><span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><em style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><span style="margin:auto;padding:0px;border:0px;font-style:normal;font-stretch:normal;line-height:normal;background-color:rgb(255,0,0)"><font color="#F3F3F3"><b>ecf&nbsp;</b></font></span></em></span></span><br>
            </div>
            <div>
            <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal;color:rgb(0,0,205)"><span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:24px;line-height:normal"><em style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><span style="margin:auto;padding:0px;border:0px;font-style:normal;font-stretch:normal;line-height:normal;background-color:rgb(255,0,0)"><br></span></em></span></span>
            </div>
            <div>
            <p style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Tahoma;color:rgb(0,0,0);margin:0px;padding:0px;border:0px;width:auto;height:auto;float:none"><font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal" color="#000000"><font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><font style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:8pt;line-height:normal"><span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:10.6667px;line-height:normal">Organisme de Formation enregistré à la DIRECCTE Île-de-France sous le numéro 11 94 056 55 94</span></font></font></font><br style="font-stretch:normal;line-height:normal;margin:auto;padding:0px">
            <font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal" color="#000000"><font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal"><font style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:8pt;line-height:normal"><span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:10.6667px;line-height:normal">(cet enregistrement ne vaut pas agrément de l’État)</span></font></font></font></p>
            <div>
            <font face="tahoma, sans-serif"><img src="https://ci3.googleusercontent.com/mail-sig/AIorK4wuXgVD2kJmqyyElYPV6D_NSWska2tgnhC-s8pHETZhhWK4SKdpfZgr3ZKNDI4MHoXXUSNwODYoQmFj" width="200" height="121" alt="AIorK4wuXgVD2kJmqyyElYPV6D_NSWska2tgnhC-s8pHETZhhWK4SKdpfZgr3ZKNDI4MHoXXUSNwODYoQmFj"><br></font>
            <div>
            <br>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </body>
        </html>
        `
    )
}
