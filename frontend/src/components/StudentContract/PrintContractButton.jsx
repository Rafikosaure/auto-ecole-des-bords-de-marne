import React from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import deleteFilesAfterProcessing from './deleteFilesAfterProcessing';
// import dataStorage from './StudentContractPages/temporaryData';
import { useSelector } from 'react-redux';
import { selectPrintFileData } from '../../redux/slices/printFileDataSlice';
import config from '../../config';



export default function PrintContractButton({ setNumberOfComponent, student }) {

  // Import des données par défaut
  // const data = dataStorage(student)

  // Redux store
  const fetchData = useSelector(selectPrintFileData)

  // useEffect(() => {
  //   console.log(fetchData)
  // }, [fetchData])


  // Données à envoyer au serveur
  // const fetchData = {
  //   fileData: {
  //       print: true,
  //       documentType: "Contrat_Stagiaire",
  //       documentTitle: "CONTRAT D'ENSEIGNEMENT À LA CONDUITE - CATÉGORIE B DU PERMIS DE CONDUIRE",
  //       dateTime: "",
  //       studentContractData: {
  //         location: "Bry-sur-Marne",
  //         isReadAndApproved: false, // traduire en "checked" si true !
  //         initialsOptions: {
  //           ifInitialed_page1: false, // traduire en "checked" si true !
  //           ifInitialed_page2: false, // traduire en "checked" si true !
  //           ifInitialed_page3: false, // traduire en "checked" si true !
  //           ifInitialed_page4: false, // traduire en "checked" si true !
  //           ifInitialed_page5: false, // traduire en "checked" si true !
  //           initialsFileName: "studentInitials"
  //         },
  //         signature: {
  //           studentId: student.id,
  //           studentSignature: "studentSignature",
  //           legalRepresentativeSignature: "legalRepresentSignature",
  //           enterpriseSignature: "enterpriseSignature"
  //         }
  //       }
  //     },
  //     schoolData: {
  //       location: {
  //         number: "9",
  //         street: "Grande rue Charles de Gaulle",
  //         town: "Bry-sur-Marne"
  //       }
  //     },
  //     evaluation: {
  //       date: {
  //         evaluationDay: "", // Vérifier la validité de la date !
  //         evaluationMonth: "", // Vérifier la validité de la date !
  //         evaluationYear: "" // Vérifier la validité de la date !
  //       },
  //       instructorFirstName: "",
  //       vehicleType: ""
  //     },
  //     emailType: "",
  //     studentData: {
  //       studentFirstName: student.firstName,
  //       studentLastName: student.lastName,
  //       studentBirthDate: "",
  //       studentAddress: "",
  //       studentPhoneNumber: student.phoneNumber,
  //       studentEmail: student.email
  //     },
  //     formationData: {
  //       formationType: {
  //         formationTradB: true, // traduire en "checked" si true !
  //         apprentAnticipConduite: true, // traduire en "checked" si true !
  //         conduiteSupervis: true, // traduire en "checked" si true !
  //         theoricalFormation: {
  //           isChecked: true, // traduire en "checked" si true !
  //           duration: "",
  //           location: {
  //             onSite: false, // traduire en "checked" si true !
  //             remote: false, // traduire en "checked" si true !
  //             onSiteAndRemote: false, // traduire en "checked" si true !
  //             individualCourses: false, // traduire en "checked" si true !
  //             groupCourses: false // traduire en "checked" si true !
  //           }
  //         },
  //         practicalFormation: {
  //           isChecked: true, // traduire en "checked" si true !
  //           duration: "20 heures",
  //           location: {
  //             openWayWithAnInstructor: false, // traduire en "checked" si true !
  //             manualTransmission: false, // traduire en "checked" si true !
  //             automaticTransmission: false // traduire en "checked" si true !
  //           }
  //         }
  //       },
  //       formationTitle: "Permis de conduire (BOITE AUTO ou MECANIQUE)",
  //       formationStartDate: {
  //         day: "00",
  //         month: "00",
  //         year: "0000"
  //       },
  //       formationEndingDesiredDate: {
  //         day: "00",
  //         month: "00",
  //         year: "0000"
  //       },
  //       formationMaxEndingDate: {
  //         day: "00",
  //         month: "00",
  //         year: "0000"
  //       },
  //       formationDuration: {
  //         drivingPractice: "000",
  //         totalDrivingLearningDuration: "00"
  //       },
  //       drivingTestExamDatetime: {
  //         examDate: "", // Mettre en forme la date d'examen avant la validation !
  //         examTime: "" // Mettre en forme l'heure d'examen avant la validation !
  //       },
  //       formationPrices: {
  //         EvaluationPrealable: {
  //           PRESTATION: "Évaluation Préalable",
  //           Obligatoire: "OUI",
  //           PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
  //           NbHeures_ou_Units: "Hors forfait",
  //           MontantTTC: "" // Gérer le symbole "€" avant la validation !
  //         },
  //         Frais_Administratifs: {
  //           raw001: {
  //             PRESTATION: "Gestion de l’élève (dossier, rdv, planning)",
  //             Obligatoire: "OUI",
  //             PrixUnitaireTTC: "150,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1 Inclus",
  //             MontantTTC: "80,00 €" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw002: {
  //             PRESTATION: "Demande de numéro NEPH sur ANTS",
  //             Obligatoire: "OUI",
  //             PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1 Inclus",
  //             MontantTTC: "50,00 €" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw003: {
  //             PRESTATION: "Demande Fabrication du Titre (Réussite)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1 Inclus",
  //             MontantTTC: "50,00 €" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw004: {
  //             PRESTATION: "Livret d'apprentissage",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "20,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1 Inclus",
  //             MontantTTC: "20,00 €" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw005: {
  //             PRESTATION: "Frais de résiliation (uniquement lorsque l'élève n'a pas de motif légitime et avant le début de la formation pratique)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "50,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "",
  //             MontantTTC: "" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw006: {
  //             PRESTATION: "Frais de Gestion Compte CPF",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "250,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "",
  //             MontantTTC: "" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw007: {
  //             PRESTATION: "Réservation d'une place d'Examen sur RDV PERMIS",
  //             Obligatoire: "OUI",
  //             PrixUnitaireTTC: "65,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1X65€ Non Inclus",
  //             MontantTTC: "Non Inclus" // Gérer le symbole "€" avant la validation !
  //           }
  //         },
  //         Theorie: {
  //           packwebAppAccessCodePrices: {
  //             pricePerMonth: "20€",
  //             priceForFourMonths: "50€"
  //           },
  //           raw001: {
  //             PRESTATION: "Rendez-vous Pédagogique (AAC uniquement)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "55,00 €",
  //             NbHeures_ou_Units: "3X57€ Non Inclus",
  //             MontantTTC: "Non Inclus"
  //           },
  //           raw002: {
  //             PRESTATION: "Contrôles des connaissance (Examen Blanc)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "55,00 €",
  //             NbHeures_ou_Units: "",
  //             MontantTTC: ""
  //           },
  //           raw003: {
  //             PRESTATION: "Forfait de Formation Théorique",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "150,00 €",
  //             NbHeures_ou_Units: "1 Inclus",
  //             MontantTTC: "99,00 €"
  //           },
  //           raw004: {
  //             PRESTATION: "Livre de Vérification",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "10,00 €",
  //             NbHeures_ou_Units: "",
  //             MontantTTC: ""
  //           },
  //           raw005: {
  //             PRESTATION: "Accès e-learning (code en ligne) Pack web",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "50,00 €",
  //             NbHeures_ou_Units: "",
  //             MontantTTC: ""
  //           }
  //         },
  //         Pratique: {
  //           raw001: {
  //             PRESTATION: "Rendez-vous Préalable AAC ou Supervisée",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "",
  //             MontantTTC: "" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw002: {
  //             PRESTATION: "RDV Pédagogique (Obligatoire pour AAC)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "55,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "3X57€ Non Inclus",
  //             MontantTTC: "Non Inclus" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw003: {
  //             PRESTATION: "Leçon de Conduite Individuelle BM (*)",
  //             Obligatoire: "OUI",
  //             PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "20x50€ inclus",
  //             MontantTTC: "1 000,00 €" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw004: {
  //             PRESTATION: "Leçon de Conduite Individuelle BVA (**)",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "",
  //             MontantTTC: "" // Gérer le symbole "€" avant la validation !
  //           },
  //           raw005: {
  //             PRESTATION: "Accompagnement à l'Examen (Tarif ne dépassant pas celui d'1h de conduite)",
  //             Obligatoire: "OUI",
  //             PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
  //             NbHeures_ou_Units: "1x57€ Non Inclus",
  //             MontantTTC: "Non Inclus"
  //           },
  //           raw006: {
  //             PRESTATION: "Forfait de Formation Pratique",
  //             Obligatoire: "",
  //             PrixUnitaireTTC: "",
  //             NbHeures_ou_Units: "",
  //             MontantTTC: ""
  //           }
  //         },
  //         total: {
  //           TypeFormation: "Forfait AAC - 20h Manuelle avec Code",
  //           MontantTTC: "1299 €" // Gérer le symbole "€" avant la validation !
  //         },
  //         paymentMethod: {
  //           creditCard: false, // traduire en "checked" si true !
  //           cheque: false, // traduire en "checked" si true !
  //           bankTransfer: false, // traduire en "checked" si true !
  //           cash: false, // traduire en "checked" si true !
  //           SEPA_DirectDebit: false // traduire en "checked" si true !
  //         },
  //         paymentOptions: {
  //           withDepositAndBalance: {
  //             isChecked: false, // traduire en "checked" si true !
  //             paymentDate: {
  //               paymentDay: "00",
  //               paymentMonth: "00",
  //               paymentYear: "0000"
  //             }
  //           },
  //           one_offCashPayment: false, // traduire en "checked" si true !
  //           pay_as_you_go_afterEachService: false, // traduire en "checked" si true !
  //           three_instalments_FreeOfCharge: false, // traduire en "checked" si true !
  //           five_instalments_FreeOfCharge: false // traduire en "checked" si true !
  //         },
  //         failOfTheDrivingSchool: {
  //           yesOption: {
  //             isChecked: false, // traduire en "checked" si true !
  //             garantEntity: {
  //               name: "",
  //               address: {
  //                 number: "",
  //                 street: "",
  //                 town: ""
  //               }
  //             }
  //           },
  //           noOptionIsChecked: true
  //         },
  //         priceOfCodeExam: "30 € TTC"
  //         }
  //     }}

  // Fonction de téléchargement du contrat de formation
  const downloadFile = async () => {
    try {
      // Envoie la requête POST avec axios

      const response = await axios.post(
        `${config.apiBaseUrl}/document/downloadOneDocument/${student.id}`,
        // data
        fetchData
        /* { fileData: {
          print: true,
          documentType: "Contrat_Stagiaire",
          documentTitle: "CONTRAT D'ENSEIGNEMENT À LA CONDUITE - CATÉGORIE B DU PERMIS DE CONDUIRE",
          dateTime: "Mercredi 30 octobre 2024 à 14h12",
          studentContractData: {
            location: "Bry-sur-Marne",
            isReadAndApproved: true,
            initialsOptions: {
              ifInitialed_page1: true,
              ifInitialed_page2: true,
              ifInitialed_page3: true,
              ifInitialed_page4: true,
              ifInitialed_page5: true,
              initialsFileName: "studentInitials"
            },
            signature: {
              studentId: student.id,
              studentSignature: "studentSignature",
              legalRepresentativeSignature: "legalRepresentSignature",
              enterpriseSignature: "enterpriseSignature"
            }
          }
        },
        schoolData: {
          location: {
            number: "9",
            street: "Grande rue Charles de Gaulle",
            town: "Bry-sur-Marne"
          }
        },
        evaluation: {
          date: {
            evaluationDay: "12",
            evaluationMonth: "03",
            evaluationYear: "2024"
          },
          instructorFirstName: "Sylvie",
          vehicleType: "RENAULT CLIO/CAPTUR"
        },
        emailType: "convocation_formation",
        studentData: {
          studentFirstName: "Rafik",
          studentLastName: "BEN SADI",
          studentBirthDate: "12/03/1985",
          studentAddress: "4, allée des Terrasses, Torcy",
          studentPhoneNumber: "0615243342",
          studentEmail: "rafikbensadi@live.fr"
        },
        formationData: {
          formationType: {
            formationTradB: "checked",
            apprentAnticipConduite: "",
            conduiteSupervis: "",
            theoricalFormation: {
              isChecked: "",
              duration: "",
              location: {
                onSite: "",
                remote: "",
                onSiteAndRemote: "checked",
                individualCourses: "",
                groupCourses: ""
              }
            },
            practicalFormation: {
              isChecked: "checked",
              duration: "20 heures",
              location: {
                openWayWithAnInstructor: "checked",
                manualTransmission: "",
                automaticTransmission: ""
              }
            }
          },
          formationTitle: "Permis de conduire (BOITE AUTO ou MECANIQUE)",
          formationStartDate: {
            day: "01",
            month: "11",
            year: "2024"
          },
          formationEndingDesiredDate: {
            day: "25",
            month: "05",
            year: "2025"
          },
          formationMaxEndingDate: {
            day: "31",
            month: "07",
            year: "2025"
          },
          formationDuration: {
            drivingPractice: "350",
            totalDrivingLearningDuration: "20"
          },
          drivingTestExamDatetime: {
            examDate: "VENDREDI 03/01/2025",
            examTime: "08h45"
          },
          formationPrices: {
            EvaluationPrealable: {
              PRESTATION: "Évaluation Préalable",
              Obligatoire: "OUI",
              PrixUnitaireTTC: "60,00 €",
              NbHeures_ou_Units: "Hors forfait",
              MontantTTC: ""
            },
            Frais_Administratifs: {
              raw001: {
                PRESTATION: "Gestion de l’élève (dossier, rdv, planning)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "150,00 €",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "80,00 €"
              },
              raw002: {
                PRESTATION: "Demande de numéro NEPH sur ANTS",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "60,00 €",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "50,00 €"
              },
              raw003: {
                PRESTATION: "Demande Fabrication du Titre (Réussite)",
                Obligatoire: "",
                PrixUnitaireTTC: "60,00 €",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "50,00 €"
              },
              raw004: {
                PRESTATION: "Livret d'apprentissage",
                Obligatoire: "",
                PrixUnitaireTTC: "20,00 €",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "20,00 €"
              },
              raw005: {
                PRESTATION: "Frais de résiliation (uniquement lorsque l'élève n'a pas de motif légitime et avant le début de la formation pratique)",
                Obligatoire: "",
                PrixUnitaireTTC: "50,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw006: {
                PRESTATION: "Frais de Gestion Compte CPF",
                Obligatoire: "",
                PrixUnitaireTTC: "250,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw007: {
                PRESTATION: "Réservation d'une place d'Examen sur RDV PERMIS",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "65,00 €",
                NbHeures_ou_Units: "1X65€ Non Inclus",
                MontantTTC: "Non Inclus"
              }
            },
            Theorie: {
              packwebAppAccessCodePrices: {
                pricePerMonth: "20€",
                priceForFourMonths: "50€"
              },
              raw001: {
                PRESTATION: "Rendez-vous Pédagogique (AAC uniquement)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00 €",
                NbHeures_ou_Units: "3X57€ Non Inclus",
                MontantTTC: "Non Inclus"
              },
              raw002: {
                PRESTATION: "Contrôles des connaissance (Examen Blanc)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw003: {
                PRESTATION: "Forfait de Formation Théorique",
                Obligatoire: "",
                PrixUnitaireTTC: "150,00 €",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "99,00 €"
              },
              raw004: {
                PRESTATION: "Livre de Vérification",
                Obligatoire: "",
                PrixUnitaireTTC: "10,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw005: {
                PRESTATION: "Accès e-learning (code en ligne) Pack web",
                Obligatoire: "",
                PrixUnitaireTTC: "50,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              }
            },
            Pratique: {
              raw001: {
                PRESTATION: "Rendez-vous Préalable AAC ou Supervisée",
                Obligatoire: "",
                PrixUnitaireTTC: "57,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw002: {
                PRESTATION: "RDV Pédagogique (Obligatoire pour AAC)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00 €",
                NbHeures_ou_Units: "3X57€ Non Inclus",
                MontantTTC: "Non Inclus"
              },
              raw003: {
                PRESTATION: "Leçon de Conduite Individuelle BM (*)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "57,00 €",
                NbHeures_ou_Units: "20x50€ inclus",
                MontantTTC: "1 000,00 €"
              },
              raw004: {
                PRESTATION: "Leçon de Conduite Individuelle BVA (**)",
                Obligatoire: "",
                PrixUnitaireTTC: "57,00 €",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              },
              raw005: {
                PRESTATION: "Accompagnement à l'Examen (Tarif ne dépassant pas celui d'1h de conduite)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "57,00 €",
                NbHeures_ou_Units: "1x57€ Non Inclus",
                MontantTTC: "Non Inclus"
              },
              raw006: {
                PRESTATION: "Forfait de Formation Pratique",
                Obligatoire: "",
                PrixUnitaireTTC: "",
                NbHeures_ou_Units: "",
                MontantTTC: ""
              }
            },
            total: {
              TypeFormation: "Forfait AAC - 20h Manuelle avec Code",
              MontantTTC: "1299 €"
            },
            paymentMethod: {
              creditCard: "checked",
              cheque: "",
              bankTransfer: "",
              cash: "",
              SEPA_DirectDebit: ""
            },
            paymentOptions: {
              withDepositAndBalance: {
                isChecked: "checked",
                paymentDate: {
                  paymentDay: "01",
                  paymentMonth: "01",
                  paymentYear: "2025"
                }
              },
              one_offCashPayment: "",
              pay_as_you_go_afterEachService: "",
              three_instalments_FreeOfCharge: "",
              five_instalments_FreeOfCharge: ""
            },
            failOfTheDrivingSchool: {
              yesOption: {
                isChecked: "",
                garantEntity: {
                  name: "",
                  address: {
                    number: "",
                    street: "",
                    town: ""
                  }
                }
              },
              noOptionIsChecked: "checked"
            },
            priceOfCodeExam: "30 € TTC"
            }
        }} */, // Données envoyées dans le corps de la requête
        { responseType: 'blob' } // Important pour que axios interprète la réponse en tant que blob
      );

      // Crée un blob pour le fichier
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      
      // Crée un lien de téléchargement temporaire
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Contrat_Stagiaire.pdf'; // Nom du fichier à télécharger
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Libère l'URL après le téléchargement
      window.URL.revokeObjectURL(downloadUrl);
     

      // Appel de la fonction de nettoyage des fichiers inutiles côté serveur
      deleteFilesAfterProcessing(student.id)
      setNumberOfComponent(1)
      // dispatch(reinitializeState())
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  }


return (
    <Button variant="primary" onClick={downloadFile}>Télécharger le fichier</Button>
  )
}