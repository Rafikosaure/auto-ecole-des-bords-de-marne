
exports.emailConvocPermis = (data, datetime) => {
    return (
        `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; ">
            <title>convocation permis</title>
        </head>
            <body>
                <div class="moz-text-html" lang="x-unicode">
                <div dir="ltr">
                    <p>${datetime.charAt(0).toUpperCase() + datetime.slice(1)}</p><br><br>
                    <p style="margin-bottom:0cm">
                    <font color="#222222">
                        <font face="Arial, Helvetica, sans-serif">
                        <font size="3">Bonsoir ${data.studentData.studentFirstName} ${data.studentData.studentLastName},</font>
                        </font>
                    </font>
                    </p>
                    <p style="margin-bottom:0cm">
                    <span style="font-size:medium">Nous vous avons réservé une date de permis pour le ${data.formationData.drivingTestExamDatetime.examDate}
                    </span>
                    <br>
                    </p>
                    <p style="margin-bottom:0cm">
                    <font color="#222222">
                        <font face="Arial, Helvetica, sans-serif">
                        <font size="3">
                            <b>Le rendez-vous de&nbsp;</b>
                            <b>
                            <u>
                            Départ
                            </u>
                            </b>
                            <b>&nbsp;est fixé à ${data.formationData.drivingTestExamDatetime.examTime} à l'auto école de ${data.schoolData.location.town} ${data.schoolData.location.number} ${data.schoolData.location.street}</b>
                        </font>
                        </font>
                    </font>
                    </p>
                    <p style="margin-bottom:0cm">
                    <span style="font-size:medium">&nbsp;(&nbsp;Ne pas tenir compte de l'heure ,ni du lieu de rendez-vous donné par " Rdv&nbsp;Permis")</span>
                    </p>
                    <p style="margin-bottom:0cm">
                    <font size="3">Passe nous voir à l'agence afin de planifier / ajuster tes leçons de conduite.</font>
                    </p>
                    <p style="margin-bottom:0cm">
                    <font size="3">Tu signeras en même temps ta convocation&nbsp;pour le permis.</font>
                    </p>
                    <p style="margin-bottom:0cm">
                    <span style="font-size:medium">Merci d'accuser réception de ce message.</span>
                    <br>
                    </p>
                    <p style="margin-bottom:0cm">
                    <span style="font-size:medium">Excellente soirée</span>
                    <br>
                    </p>
                    <p style="margin-bottom:0cm">
                    <span style="font-size:medium">Le directeur</span>
                    </p>
                    <div>
                    <br>
                    </div>
                    <span class="gmail_signature_prefix">-- </span>
                    <br>
                    <div dir="ltr" class="gmail_signature" data-smartmail="gmail_signature">
                    <div dir="ltr">
                        <font face="tahoma, sans-serif">
                        <span style="color:rgb(0,0,0)">
                            <b>AUTO ECOLE DES BORDS DE MARNE</b>
                        </span>
                        <br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
                        <span style="color:rgb(0,0,0)">9 Grande rue Charles de Gaulle</span>
                        <br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
                        <span style="color:rgb(0,0,0)">94360 BRY-SUR-MARNE</span>
                        <br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
                        <span style="color:rgb(0,0,0)">Tél : 01 49.83.93.91</span>
                        <br style="color:rgb(0,0,0);font-stretch:normal;line-height:normal;margin:auto;padding:0px">
                        <span style="color:rgb(0,0,0)">E-mail : <a href="mailto:aebdm94@gmail.com" target="_blank">aebdm94@gmail.com</a>
                        </span>
                        </font>
                        <div>
                        <a href="https://www.autoecole-bordsdemarne.fr/" style="font-family:tahoma,sans-serif" target="_blank">www.autoecole-bordsdemarne.fr</a>
                        </div>
                        <div>
                        <br>
                        </div>
                        <div>
                        <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                            <font color="#0000cd">Etablissement adhérant de L'école de conduite française :&nbsp;</font>
                            <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                            <em style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                                <span style="margin:auto;padding:0px;border:0px;font-style:normal;font-stretch:normal;line-height:normal;background-color:rgb(255,0,0)">
                                <font color="#f3f3f3">
                                    <b>ecf&nbsp;</b>
                                </font>
                                </span>
                            </em>
                            </span>
                        </span>
                        <br>
                        </div>
                        <div>
                        <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal;color:rgb(0,0,205)">
                            <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:24px;line-height:normal">
                            <em style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                                <span style="margin:auto;padding:0px;border:0px;font-style:normal;font-stretch:normal;line-height:normal;background-color:rgb(255,0,0)">
                                <br>
                                </span>
                            </em>
                            </span>
                        </span>
                        </div>
                        <div>
                        <p style="font-stretch:normal;font-size:12px;line-height:normal;font-family:Tahoma;color:rgb(0,0,0);margin:0px;padding:0px;border:0px;width:auto;height:auto;float:none">
                            <font color="#000000" style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                            <font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                                <font style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:8pt;line-height:normal">
                                <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:10.6667px;line-height:normal">Organisme de Formation enregistré à la DIRECCTE Île-de-France sous le numéro 11 94 056 55 94</span>
                                </font>
                            </font>
                            </font>
                            <br style="font-stretch:normal;line-height:normal;margin:auto;padding:0px">
                            <font color="#000000" style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                            <font style="margin:auto;padding:0px;border:0px;font-stretch:normal;line-height:normal">
                                <font style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:8pt;line-height:normal">
                                <span style="margin:auto;padding:0px;border:0px;font-stretch:normal;font-size:10.6667px;line-height:normal">(cet enregistrement ne vaut pas agrément de l’État)</span>
                                </font>
                            </font>
                            </font>
                        </p>
                        <div>
                            <font face="tahoma, sans-serif">
                            <img width="200" height="121" src="https://ci3.googleusercontent.com/mail-sig/AIorK4wuXgVD2kJmqyyElYPV6D_NSWska2tgnhC-s8pHETZhhWK4SKdpfZgr3ZKNDI4MHoXXUSNwODYoQmFj">
                            <br>
                            </font>
                            <div>
                            <br>
                            </div>
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