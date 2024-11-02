
exports.emailRelaunch = (data, datetime) => {
    return (
        `
            <!DOCTYPE html>
            <html>
            <head>
            <title>relance</title>
            </head>
            <body style="display: block; margin: auto; max-width: 800px; width: 90%;">
            <div>
                <div>${datetime.charAt(0).toUpperCase() + datetime.slice(1)}</div><br><br>
                <div>Bonjour ${data.studentData.studentFirstName} ${data.studentData.studentLastName},
                </div><br>
                <div>
                J'espère&nbsp;que vous allez bien.
                </div>
                <div>
                Je me permets de vous contacter, car cela fait 2 mois que vous n'es pas vue à l'auto-école,
                </div>
                <div>
                Je veux juste de savoir quand est ce que vous allez revenir poursuivre les cours , car la formation a une date de fin. En effet l'inscription a une durée de validité de 8h au cours desquels il faut&nbsp;finir vos heures de conduite de votre forfait. Sinon vous&nbsp;risquez de les perdre.&nbsp;
                </div>
                <div>
                A très&nbsp;bientôt
                </div>
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
            </body>
            </html>
        `
    )
}