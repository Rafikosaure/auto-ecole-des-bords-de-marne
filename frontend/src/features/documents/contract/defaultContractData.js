// Valeurs par défaut du formulaire de contrat, dérivées du dossier de l'étudiant.
// Remplace StudentContractPages/temporaryData.js — même contenu, adapté en
// defaultValues pour react-hook-form (booléens bruts, transformés en "checked"/""
// uniquement au moment de l'envoi, voir schema.js#toCheckedAttribute).
const getDefaultValues = (student) => {
  const dateObject = new Date();
  const datetime = dateObject.toLocaleDateString('fr-FR');

  let studentBirthDate = new Date(student.birthdate);
  studentBirthDate = studentBirthDate.toLocaleDateString('fr-FR');
  const birthDay = studentBirthDate.split('/')[0];
  const birthMonth = studentBirthDate.split('/')[1];
  const birthYear = studentBirthDate.split('/')[2];

  let formationDesiredEndDate = new Date(student.formationDesiredEnd);
  formationDesiredEndDate = formationDesiredEndDate.toLocaleDateString('fr-FR');

  let maxEndingDate = new Date(student.formationMaxEndingDate);
  maxEndingDate = maxEndingDate.toLocaleDateString('fr-FR');

  return {
    // Champs de date composites affichés dans un seul input visuel (voir schema.js
    // splitDateString/joinDateParts) — découpés en day/month/year au moment de l'envoi.
    _composites: {
      studentBirthDate: `${birthDay}/${birthMonth}/${birthYear}`,
      evaluationDate: '00/00/0000',
      formationMaxEndingDate: maxEndingDate,
      paymentDate: '00/00/0000',
    },
    fileData: {
      documentType: 'contratStagiaire',
      documentTitle: "CONTRAT D'ENSEIGNEMENT À LA CONDUITE - CATÉGORIE B DU PERMIS DE CONDUIRE",
      dateTime: datetime,
      studentContractData: {
        location: 'Bry-sur-Marne',
        isReadAndApproved: false,
        initialsOptions: {
          ifInitialed_page1: false,
          ifInitialed_page2: false,
          ifInitialed_page3: false,
          ifInitialed_page4: false,
          ifInitialed_page5: false,
          initialsFileName: 'studentInitials',
        },
        signature: {
          studentId: student.id,
          studentSignature: 'studentSignature',
          legalRepresentativeSignature: 'legalRepresentSignature',
          enterpriseSignature: 'enterpriseSignature',
        },
      },
    },
    schoolData: {
      location: {
        number: '9',
        street: 'Grande rue Charles de Gaulle',
        town: 'Bry-sur-Marne',
      },
    },
    evaluation: {
      date: {
        evaluationDay: '00',
        evaluationMonth: '00',
        evaluationYear: '0000',
      },
      instructorFirstName: '',
      vehicleType: '',
    },
    emailType: '',
    studentData: {
      studentFirstName: student.firstName,
      studentLastName: student.lastName,
      studentBirthDate: { birthDay, birthMonth, birthYear },
      studentAddress: { number: '', street: '', town: '' },
      studentPhoneNumber: student.phoneNumber,
      studentEmail: student.email,
    },
    formationData: {
      formationType: {
        formationTradB: true,
        apprentAnticipConduite: true,
        conduiteSupervis: true,
        theoricalFormation: {
          isChecked: true,
          duration: '',
          location: {
            onSite: false,
            remote: false,
            onSiteAndRemote: false,
            individualCourses: false,
            groupCourses: false,
          },
        },
        practicalFormation: {
          isChecked: true,
          duration: '20 heures',
          location: {
            openWayWithAnInstructor: false,
            manualTransmission: false,
            automaticTransmission: false,
          },
        },
      },
      // Aligné sur le comportement d'origine : la date de début affichée dans le
      // formulaire de contrat est la date du jour, pas la date réelle de début de
      // formation de l'étudiant (déjà utilisée ailleurs, ex. StudentCommunication).
      formationStartDate: {
        day: datetime.split('/')[0],
        month: datetime.split('/')[1],
        year: datetime.split('/')[2],
      },
      formationEndingDesiredDate: {
        day: formationDesiredEndDate.split('/')[0],
        month: formationDesiredEndDate.split('/')[1],
        year: formationDesiredEndDate.split('/')[2],
      },
      formationMaxEndingDate: {
        day: maxEndingDate.split('/')[0],
        month: maxEndingDate.split('/')[1],
        year: maxEndingDate.split('/')[2],
      },
      formationDuration: {
        drivingPractice: '000',
        totalDrivingLearningDuration: '00',
      },
      drivingTestExamDatetime: {
        examDate: '00/00/0000',
        examTime: '00/00/0000',
      },
      formationPrices: {
        EvaluationPrealable: {
          PRESTATION: 'Évaluation Préalable',
          Obligatoire: 'OUI',
          PrixUnitaireTTC: '60,00 €',
          NbHeures_ou_Units: '',
          MontantTTC: '',
        },
        Frais_Administratifs: {
          raw001: {
            PRESTATION: 'Gestion de l’élève (dossier, rdv, planning)',
            Obligatoire: 'OUI',
            PrixUnitaireTTC: '150,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw002: {
            PRESTATION: 'Demande de numéro NEPH sur ANTS',
            Obligatoire: 'OUI',
            PrixUnitaireTTC: '60,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw003: {
            PRESTATION: 'Demande Fabrication du Titre (Réussite)',
            Obligatoire: '',
            PrixUnitaireTTC: '60,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw004: {
            PRESTATION: "Livret d'apprentissage",
            Obligatoire: '',
            PrixUnitaireTTC: '20,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw005: {
            PRESTATION: "Frais de résiliation (uniquement lorsque l'élève n'a pas de motif légitime et avant le début de la formation pratique)",
            Obligatoire: '',
            PrixUnitaireTTC: '50,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw006: {
            PRESTATION: 'Frais de Gestion Compte CPF',
            Obligatoire: '',
            PrixUnitaireTTC: '250,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw007: {
            PRESTATION: "Réservation d'une place d'Examen sur RDV PERMIS",
            Obligatoire: 'OUI',
            PrixUnitaireTTC: '65,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
        },
        Theorie: {
          packwebAppAccessCodePrices: {
            pricePerMonth: '20€',
            priceForFourMonths: '50€',
          },
          raw001: {
            PRESTATION: 'Rendez-vous Pédagogique (AAC uniquement)',
            Obligatoire: '',
            PrixUnitaireTTC: '55,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw002: {
            PRESTATION: 'Contrôles des connaissance (Examen Blanc)',
            Obligatoire: '',
            PrixUnitaireTTC: '55,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw003: {
            PRESTATION: 'Forfait de Formation Théorique',
            Obligatoire: '',
            PrixUnitaireTTC: '150,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw004: {
            PRESTATION: 'Livre de Vérification',
            Obligatoire: '',
            PrixUnitaireTTC: '10,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw005: {
            PRESTATION: 'Accès e-learning (code en ligne) Pack web',
            Obligatoire: '',
            PrixUnitaireTTC: '50,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
        },
        Pratique: {
          raw001: {
            PRESTATION: 'Rendez-vous Préalable AAC ou Supervisée',
            Obligatoire: '',
            PrixUnitaireTTC: '57,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw002: {
            PRESTATION: 'RDV Pédagogique (Obligatoire pour AAC)',
            Obligatoire: '',
            PrixUnitaireTTC: '55,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw003: {
            PRESTATION: 'Leçon de Conduite Individuelle BM (*)',
            Obligatoire: 'OUI',
            PrixUnitaireTTC: '57,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw004: {
            PRESTATION: 'Leçon de Conduite Individuelle BVA (**)',
            Obligatoire: '',
            PrixUnitaireTTC: '57,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw005: {
            PRESTATION: "Accompagnement à l'Examen (Tarif ne dépassant pas celui d'1h de conduite)",
            Obligatoire: 'OUI',
            PrixUnitaireTTC: '57,00 €',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
          raw006: {
            PRESTATION: 'Forfait de Formation Pratique',
            Obligatoire: '',
            PrixUnitaireTTC: '',
            NbHeures_ou_Units: '',
            MontantTTC: '',
          },
        },
        total: {
          TypeFormation: '',
          WithDeposit: '',
          MontantTTC: '',
        },
        paymentMethod: {
          creditCard: false,
          cheque: false,
          bankTransfer: false,
          cash: false,
          SEPA_DirectDebit: false,
        },
        paymentOptions: {
          withDepositAndBalance: {
            isChecked: false,
            paymentDate: { paymentDay: '00', paymentMonth: '00', paymentYear: '0000' },
          },
          one_offCashPayment: false,
          pay_as_you_go_afterEachService: false,
          three_instalments_FreeOfCharge: false,
          five_instalments_FreeOfCharge: false,
        },
        failOfTheDrivingSchool: {
          yesOption: {
            isChecked: false,
            garantEntity: { name: '', address: { number: '', street: '', town: '' } },
          },
          noOptionIsChecked: true,
        },
        priceOfCodeExam: '30 € TTC',
      },
    },
  };
};

export default getDefaultValues;
