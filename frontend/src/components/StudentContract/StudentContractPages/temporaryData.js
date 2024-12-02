
const dataStorage = (student) => {
    
    // Gérer l'horodatage du contrat
    const dateObject = new Date()
    const datetime = dateObject.toLocaleDateString("fr-FR")
    
    // Gérer les dates de l'étudiant
    let studentBirthDate = new Date(student.birthdate)
    studentBirthDate = studentBirthDate.toLocaleDateString("fr-FR")
    const birthDay = studentBirthDate.split('/')[0]
    const birthMonth = studentBirthDate.split('/')[1]
    const birthYear = studentBirthDate.split('/')[2]

    // Date de fin désirée
    let formationDesiredEndDate = new Date(student.formationDesiredEnd)
    formationDesiredEndDate = formationDesiredEndDate.toLocaleDateString("fr-FR")

    // Formation maximum ending date
    let maxEndingDate = new Date(student.formationMaxEndingDate)
    maxEndingDate = maxEndingDate.toLocaleDateString("fr-FR")

    const data = {
        fileData: {
            print: true,
            documentType: "Contrat_Stagiaire",
            documentTitle: "CONTRAT D'ENSEIGNEMENT À LA CONDUITE - CATÉGORIE B DU PERMIS DE CONDUIRE",
            dateTime: datetime,
            studentContractData: {
              location: "Bry-sur-Marne",
              isReadAndApproved: false, // traduire en "checked" si true !
              initialsOptions: {
                ifInitialed_page1: false, // traduire en "checked" si true !
                ifInitialed_page2: false, // traduire en "checked" si true !
                ifInitialed_page3: false, // traduire en "checked" si true !
                ifInitialed_page4: false, // traduire en "checked" si true !
                ifInitialed_page5: false, // traduire en "checked" si true !
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
              evaluationDay: "00", // Vérifier la validité de la date !
              evaluationMonth: "00", // Vérifier la validité de la date !
              evaluationYear: "0000" // Vérifier la validité de la date !
            },
            instructorFirstName: "",
            vehicleType: ""
          },
          emailType: "",
          studentData: {
            studentFirstName: student.firstName,
            studentLastName: student.lastName,
            studentBirthDate: {
              birthDay: birthDay,
              birthMonth: birthMonth,
              birthYear: birthYear
            },
            studentAddress: {
              number: "",
              street: "",
              town: ""
            },
            studentPhoneNumber: student.phoneNumber,
            studentEmail: student.email
          },
          formationData: {
            formationType: {
              formationTradB: true, // traduire en "checked" si true !
              apprentAnticipConduite: true, // traduire en "checked" si true !
              conduiteSupervis: true, // traduire en "checked" si true !
              theoricalFormation: {
                isChecked: true, // traduire en "checked" si true !
                duration: "",
                location: {
                  onSite: false, // traduire en "checked" si true !
                  remote: false, // traduire en "checked" si true !
                  onSiteAndRemote: false, // traduire en "checked" si true !
                  individualCourses: false, // traduire en "checked" si true !
                  groupCourses: false // traduire en "checked" si true !
                }
              },
              practicalFormation: {
                isChecked: true, // traduire en "checked" si true !
                duration: "20 heures",
                location: {
                  openWayWithAnInstructor: false, // traduire en "checked" si true !
                  manualTransmission: false, // traduire en "checked" si true !
                  automaticTransmission: false // traduire en "checked" si true !
                }
              }
            },
            formationTitle: "Permis de conduire (BOITE AUTO ou MECANIQUE)",
            formationStartDate: {
              day: datetime.split('/')[0],
              month: datetime.split('/')[1],
              year: datetime.split('/')[2]
            },
            formationEndingDesiredDate: {
              day: formationDesiredEndDate.split('/')[0],
              month: formationDesiredEndDate.split('/')[1],
              year: formationDesiredEndDate.split('/')[2]
            },
            formationMaxEndingDate: {
              day: maxEndingDate.split('/')[0],
              month: maxEndingDate.split('/')[1],
              year: maxEndingDate.split('/')[2]
            },
            formationDuration: {
              drivingPractice: "000",
              totalDrivingLearningDuration: "00"
            },
            drivingTestExamDatetime: {
              examDate: "00/00/0000", // Mettre en forme la date d'examen avant la validation !
              examTime: "00/00/0000" // Mettre en forme l'heure d'examen avant la validation !
            },
            formationPrices: {
              EvaluationPrealable: {
                PRESTATION: "Évaluation Préalable",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
                NbHeures_ou_Units: "Hors forfait",
                MontantTTC: "" // Gérer le symbole "€" avant la validation !
              },
              Frais_Administratifs: {
                raw001: {
                  PRESTATION: "Gestion de l’élève (dossier, rdv, planning)",
                  Obligatoire: "OUI",
                  PrixUnitaireTTC: "150,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "1 Inclus",
                  MontantTTC: "80,00 €" // Gérer le symbole "€" avant la validation !
                },
                raw002: {
                  PRESTATION: "Demande de numéro NEPH sur ANTS",
                  Obligatoire: "OUI",
                  PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "1 Inclus",
                  MontantTTC: "50,00 €" // Gérer le symbole "€" avant la validation !
                },
                raw003: {
                  PRESTATION: "Demande Fabrication du Titre (Réussite)",
                  Obligatoire: "",
                  PrixUnitaireTTC: "60,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "1 Inclus",
                  MontantTTC: "50,00 €" // Gérer le symbole "€" avant la validation !
                },
                raw004: {
                  PRESTATION: "Livret d'apprentissage",
                  Obligatoire: "",
                  PrixUnitaireTTC: "20,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "1 Inclus",
                  MontantTTC: "20,00 €" // Gérer le symbole "€" avant la validation !
                },
                raw005: {
                  PRESTATION: "Frais de résiliation (uniquement lorsque l'élève n'a pas de motif légitime et avant le début de la formation pratique)",
                  Obligatoire: "",
                  PrixUnitaireTTC: "50,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "",
                  MontantTTC: "" // Gérer le symbole "€" avant la validation !
                },
                raw006: {
                  PRESTATION: "Frais de Gestion Compte CPF",
                  Obligatoire: "",
                  PrixUnitaireTTC: "250,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "",
                  MontantTTC: "" // Gérer le symbole "€" avant la validation !
                },
                raw007: {
                  PRESTATION: "Réservation d'une place d'Examen sur RDV PERMIS",
                  Obligatoire: "OUI",
                  PrixUnitaireTTC: "65,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "1X65€ Non Inclus",
                  MontantTTC: "Non Inclus" // Gérer le symbole "€" avant la validation !
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
                  PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "",
                  MontantTTC: "" // Gérer le symbole "€" avant la validation !
                },
                raw002: {
                  PRESTATION: "RDV Pédagogique (Obligatoire pour AAC)",
                  Obligatoire: "",
                  PrixUnitaireTTC: "55,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "3X57€ Non Inclus",
                  MontantTTC: "Non Inclus" // Gérer le symbole "€" avant la validation !
                },
                raw003: {
                  PRESTATION: "Leçon de Conduite Individuelle BM (*)",
                  Obligatoire: "OUI",
                  PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "20x50€ inclus",
                  MontantTTC: "1 000,00 €" // Gérer le symbole "€" avant la validation !
                },
                raw004: {
                  PRESTATION: "Leçon de Conduite Individuelle BVA (**)",
                  Obligatoire: "",
                  PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
                  NbHeures_ou_Units: "",
                  MontantTTC: "" // Gérer le symbole "€" avant la validation !
                },
                raw005: {
                  PRESTATION: "Accompagnement à l'Examen (Tarif ne dépassant pas celui d'1h de conduite)",
                  Obligatoire: "OUI",
                  PrixUnitaireTTC: "57,00 €", // Gérer le symbole "€" avant la validation !
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
                WithDeposit: "",
                MontantTTC: "1299 €" // Gérer le symbole "€" avant la validation !
              },
              paymentMethod: {
                creditCard: false, // traduire en "checked" si true !
                cheque: false, // traduire en "checked" si true !
                bankTransfer: false, // traduire en "checked" si true !
                cash: false, // traduire en "checked" si true !
                SEPA_DirectDebit: false // traduire en "checked" si true !
              },
              paymentOptions: {
                withDepositAndBalance: {
                  isChecked: false, // traduire en "checked" si true !
                  paymentDate: {
                    paymentDay: "00",
                    paymentMonth: "00",
                    paymentYear: "0000"
                  }
                },
                one_offCashPayment: false, // traduire en "checked" si true !
                pay_as_you_go_afterEachService: false, // traduire en "checked" si true !
                three_instalments_FreeOfCharge: false, // traduire en "checked" si true !
                five_instalments_FreeOfCharge: false // traduire en "checked" si true !
              },
              failOfTheDrivingSchool: {
                yesOption: {
                  isChecked: false, // traduire en "checked" si true !
                  garantEntity: {
                    name: "",
                    address: {
                      number: "",
                      street: "",
                      town: ""
                    }
                  }
                },
                noOptionIsChecked: true
              },
              priceOfCodeExam: "30 € TTC"
              }
          }}





        /* fileData: {
        documentType: "Convocation_Formation",
        documentConvocationTitle: "CONVOCATION FORMATION PERMIS DE CONDUIRE B",
        documentContractTitle: "CONTRAT D'ENSEIGNEMENT À LA CONDUITE - CATÉGORIE B DU PERMIS DE CONDUIRE",
        dateTime: "", // datetime
        studentContractData: {
            location: "Bry-sur-Marne",
            initialsOptions: {
            ifInitialed_page1: false,
            ifInitialed_page2: false,
            ifInitialed_page3: false,
            ifInitialed_page4: false,
            ifInitialed_page5: false,
            initialsFileName: `parapheRB.png`
            },
            signature: {
            studentSignature: `signature_jean-claude.png`,
            legalRepresentativeSignature: `signature_rafik_simple.png`,
            enterpriseSignature: `signature_random.png`
            }
        },
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
        emailType: "convocation_exam",
        studentData: {
        studentFirstName: 'Rafik',
        studentLastName: 'BEN SADI',
        studentBirthDate: {
            birthDay: '12',
            birthMonth: '03',
            birthYear: '1985'
        },
        studentAddress: {
            number: '2',
            street: "allée des concepteurs-développeurs d'applications",
            town: 'Bry-sur-Marne'
        },
        studentPhoneNumber: '06 05 04 03 02',
        studentEmail: "rafikbensadi@live.fr",
        },
        formationData: {
        formationType: {
            formationTradB: false,
            apprentAnticipConduite: false,
            conduiteSupervis: false,
            theoricalFormation: {
            isChecked: '',
            duration: '', // Préciser le mot "heures" en backticks après la variable
            location: {
                onSite: '',
                remote: '',
                onSiteAndRemote: 'checked',
                individualCourses: '',
                groupCourses: ''
            }
            },
            practicalFormation: {
            isChecked: "checked",
            duration: '20 heures', // Préciser le mot "heures" en backticks après la variable
            location: {
                openWayWithAnInstructor: 'checked',
                manualTransmission: '',
                automaticTransmission: ''
            }
            }
        },
        formationTitle: 'Permis de conduire (BOITE AUTO ou MECANIQUE)',
        formationStartDate: {
            day: '01',
            month: '11',
            year: '2024'
        },
        formationEndingDesiredDate: {
            day: '25',
            month: '05',
            year: '2025'
        },
        formationMaxEndingDate: {
            day: '31',
            month: '07',
            year: '2025'
        },
        formationDuration: {
            drivingPractice: '350',
            totalDrivingLearningDuration: '20',
        },
        drivingTestExamDatetime: {
            examDate: "", // codeExamDate
            examTime: ""  // codeExamHour
        },
        formationPrices: {
            EvaluationPrealable: {
            PRESTATION: "Évaluation Préalable",
            Obligatoire: "OUI",
            PrixUnitaireTTC: "60,00",
            NbHeures_ou_Units: "Hors forfait",
            MontantTTC: "0"
            },
            Frais_Administratifs: {
            raw001: {
                PRESTATION: "Gestion de l’élève (dossier, rdv, planning)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "150,00",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "80,00"
            },
            raw002: {
                PRESTATION: "Demande de numéro NEPH sur ANTS",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "60,00",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "50,00"
            },
            raw003: {
                PRESTATION: "Demande Fabrication du Titre (Réussite)",
                Obligatoire: "",
                PrixUnitaireTTC: "60,00",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "50,00"
            },
            raw004: {
                PRESTATION: "Livret d'apprentissage",
                Obligatoire: "",
                PrixUnitaireTTC: "20,00",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "20,00"
            },
            raw005: {
                PRESTATION: "Frais de résiliation (uniquement lorsque l'élève n'a pas de motif légitime et avant le début de la formation pratique)",
                Obligatoire: "",
                PrixUnitaireTTC: "50,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw006: {
                PRESTATION: "Frais de Gestion Compte CPF",
                Obligatoire: "",
                PrixUnitaireTTC: "250,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw007: {
                PRESTATION: "Réservation d'une place d'Examen sur RDV PERMIS",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "65,00",
                NbHeures_ou_Units: "1X65€ Non Inclus",
                MontantTTC: "Non Inclus"
            }
            },
            Theorie: {
            packwebAppAccessCodePrices: {
                pricePerMonth: "20",
                priceForFourMonths: "50"
            },
            raw001: {
                PRESTATION: "Rendez-vous Pédagogique (AAC uniquement)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00",
                NbHeures_ou_Units: "3X57€ Non Inclus",
                MontantTTC: "Non Inclus"
            },
            raw002: {
                PRESTATION: "Contrôles des connaissance (Examen Blanc)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw003: {
                PRESTATION: "Forfait de Formation Théorique",
                Obligatoire: "",
                PrixUnitaireTTC: "150,00",
                NbHeures_ou_Units: "1 Inclus",
                MontantTTC: "99,00"
            },
            raw004: {
                PRESTATION: "Livre de Vérification",
                Obligatoire: "",
                PrixUnitaireTTC: "10,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw005: {
                PRESTATION: "Accès e-learning (code en ligne) Pack web",
                Obligatoire: "",
                PrixUnitaireTTC: "50,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            }
            },
            Pratique: {
            raw001: {
                PRESTATION: "Rendez-vous Préalable AAC ou Supervisée",
                Obligatoire: "",
                PrixUnitaireTTC: "57,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw002: {
                PRESTATION: "RDV Pédagogique (Obligatoire pour AAC)",
                Obligatoire: "",
                PrixUnitaireTTC: "55,00",
                NbHeures_ou_Units: "3X57€ Non Inclus",
                MontantTTC: "Non Inclus"
            },
            raw003: {
                PRESTATION: "Leçon de Conduite Individuelle BM (*)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "57,00",
                NbHeures_ou_Units: "20x50€ inclus",
                MontantTTC: "1 000,00"
            },
            raw004: {
                PRESTATION: "Leçon de Conduite Individuelle BVA (**)",
                Obligatoire: "",
                PrixUnitaireTTC: "57,00",
                NbHeures_ou_Units: "",
                MontantTTC: ""
            },
            raw005: {
                PRESTATION: "Accompagnement à l'Examen (Tarif ne dépassant pas celui d'1h de conduite)",
                Obligatoire: "OUI",
                PrixUnitaireTTC: "57,00",
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
            MontantTTC: "1299"
            },
            paymentMethod: {
            creditCard: 'checked',
            cheque: '',
            bankTransfer: '',
            cash: '',
            SEPA_DirectDebit: ''
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
                isChecked: false,
                garantEntity: {
                name: "OpenClassrooms",
                address: {
                    number: "10",
                    street: "Allée des Sarcasmes Politisés",
                    town: "Paris"
                }
                }
            },
            noOptionIsChecked: true
            },
            priceOfCodeExam: "30 € TTC"
        }
        }
    } */

    return data
}

export default dataStorage