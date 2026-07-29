import { z } from 'zod';

// Une ligne de la grille tarifaire (même forme répétée pour chaque prestation).
const priceLine = z.object({
  PRESTATION: z.string(),
  Obligatoire: z.string(),
  PrixUnitaireTTC: z.string(),
  NbHeures_ou_Units: z.string(),
  MontantTTC: z.string(),
});

const datePartsSchema = z.object({
  day: z.string(),
  month: z.string(),
  year: z.string(),
});

// Schéma du payload FINAL envoyé à POST /document/downloadOneDocument/:studentId
// — c'est-à-dire après buildContractPayload() (booléens déjà convertis en chaînes
// "checked"/"" par deepConvertBooleans, dates composites déjà éclatées). Ne pas
// utiliser ce schéma pour valider les valeurs brutes du formulaire (react-hook-form
// y stocke de vrais booléens tant que buildContractPayload n'a pas tourné).
// Mirroring exact de backend/models/files/contratStagiaire.ejs (vérifié champ par champ).
const checkedAttribute = z.string();

export const contractSchema = z.object({
  fileData: z.object({
    // documentType pilote le choix du template EJS et le nom du fichier côté backend :
    // il doit rester fixe ("contratStagiaire"), jamais édité par l'utilisateur.
    documentType: z.literal('contratStagiaire'),
    documentTitle: z.string(),
    dateTime: z.string(),
    studentContractData: z.object({
      location: z.string(),
      isReadAndApproved: checkedAttribute,
      initialsOptions: z.object({
        ifInitialed_page1: checkedAttribute,
        ifInitialed_page2: checkedAttribute,
        ifInitialed_page3: checkedAttribute,
        ifInitialed_page4: checkedAttribute,
        ifInitialed_page5: checkedAttribute,
        initialsFileName: z.string(),
      }),
      signature: z.object({
        studentId: z.union([z.string(), z.number()]),
        studentSignature: z.string(),
        legalRepresentativeSignature: z.string(),
        enterpriseSignature: z.string(),
      }),
    }),
  }),
  schoolData: z.object({
    location: z.object({
      number: z.string(),
      street: z.string(),
      town: z.string(),
    }),
  }),
  // Attention : les clés sont evaluationDay/evaluationMonth/evaluationYear (et non
  // day/month/year) — vérifié contre contratStagiaire.ejs ligne 232.
  evaluation: z.object({
    date: z.object({
      evaluationDay: z.string(),
      evaluationMonth: z.string(),
      evaluationYear: z.string(),
    }),
    instructorFirstName: z.string(),
    vehicleType: z.string(),
  }),
  emailType: z.string(),
  studentData: z.object({
    studentFirstName: z.string(),
    studentLastName: z.string(),
    studentBirthDate: z.object({
      birthDay: z.string(),
      birthMonth: z.string(),
      birthYear: z.string(),
    }),
    studentAddress: z.object({
      number: z.string(),
      street: z.string(),
      town: z.string(),
    }),
    studentPhoneNumber: z.string(),
    studentEmail: z.string(),
  }),
  formationData: z.object({
    formationType: z.object({
      formationTradB: checkedAttribute,
      apprentAnticipConduite: checkedAttribute,
      conduiteSupervis: checkedAttribute,
      theoricalFormation: z.object({
        isChecked: checkedAttribute,
        duration: z.string(),
        location: z.object({
          onSite: checkedAttribute,
          remote: checkedAttribute,
          onSiteAndRemote: checkedAttribute,
          individualCourses: checkedAttribute,
          groupCourses: checkedAttribute,
        }),
      }),
      practicalFormation: z.object({
        isChecked: checkedAttribute,
        duration: z.string(),
        location: z.object({
          openWayWithAnInstructor: checkedAttribute,
          manualTransmission: checkedAttribute,
          automaticTransmission: checkedAttribute,
        }),
      }),
    }),
    formationStartDate: datePartsSchema,
    formationEndingDesiredDate: datePartsSchema,
    formationMaxEndingDate: datePartsSchema,
    formationDuration: z.object({
      drivingPractice: z.string(),
      totalDrivingLearningDuration: z.string(),
    }),
    // Non consommé par contratStagiaire.ejs (vérifié) : conservé tel quel dans le payload
    // par compatibilité, avec une valeur fixe non éditable (cf. rapport de migration).
    drivingTestExamDatetime: z.object({
      examDate: z.string(),
      examTime: z.string(),
    }),
    formationPrices: z.object({
      EvaluationPrealable: priceLine,
      Frais_Administratifs: z.object({
        raw001: priceLine,
        raw002: priceLine,
        raw003: priceLine,
        raw004: priceLine,
        raw005: priceLine,
        raw006: priceLine,
        raw007: priceLine,
      }),
      Theorie: z.object({
        packwebAppAccessCodePrices: z.object({
          pricePerMonth: z.string(),
          priceForFourMonths: z.string(),
        }),
        raw001: priceLine,
        raw002: priceLine,
        raw003: priceLine,
        raw004: priceLine,
        raw005: priceLine,
      }),
      Pratique: z.object({
        raw001: priceLine,
        raw002: priceLine,
        raw003: priceLine,
        raw004: priceLine,
        raw005: priceLine,
        raw006: priceLine,
      }),
      total: z.object({
        TypeFormation: z.string(),
        WithDeposit: z.string(),
        MontantTTC: z.string(),
      }),
      paymentMethod: z.object({
        creditCard: checkedAttribute,
        cheque: checkedAttribute,
        bankTransfer: checkedAttribute,
        cash: checkedAttribute,
        SEPA_DirectDebit: checkedAttribute,
      }),
      paymentOptions: z.object({
        withDepositAndBalance: z.object({
          isChecked: checkedAttribute,
          paymentDate: z.object({
            paymentDay: z.string(),
            paymentMonth: z.string(),
            paymentYear: z.string(),
          }),
        }),
        one_offCashPayment: checkedAttribute,
        pay_as_you_go_afterEachService: checkedAttribute,
        three_instalments_FreeOfCharge: checkedAttribute,
        five_instalments_FreeOfCharge: checkedAttribute,
      }),
      failOfTheDrivingSchool: z.object({
        yesOption: z.object({
          isChecked: checkedAttribute,
          garantEntity: z.object({
            name: z.string(),
            address: z.object({
              number: z.string(),
              street: z.string(),
              town: z.string(),
            }),
          }),
        }),
        noOptionIsChecked: checkedAttribute,
      }),
      priceOfCodeExam: z.string(),
    }),
  }),
});

// Convertit un booléen de formulaire en attribut HTML "checked" littéral,
// contrat imposé par contratStagiaire.ejs (ex: <input type="checkbox" <%= ... %>>).
export const toCheckedAttribute = (value) => (value ? 'checked' : '');

// Découpe une date composite "JJ/MM/AAAA" saisie dans un seul champ visuel
// en {day, month, year}, exactement comme le faisait l'ancien code au moment
// de la construction de fetchData.
export const splitDateString = (value, dayKey = 'day', monthKey = 'month', yearKey = 'year') => {
  const [day, month, year] = (value || '').split('/');
  return { [dayKey]: day || '', [monthKey]: month || '', [yearKey]: year || '' };
};

// Convertit récursivement tous les booléens d'un objet en "checked"/"" —
// remplace l'appel répété à fromCheckedToTrue() sur chaque champ individuel.
const deepConvertBooleans = (value) => {
  if (typeof value === 'boolean') return toCheckedAttribute(value);
  if (Array.isArray(value)) return value.map(deepConvertBooleans);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepConvertBooleans(val)]));
  }
  return value;
};

// Construit le payload final envoyé au backend à partir des valeurs brutes du
// formulaire (booléens + champs de date composites `_composites.*`).
export const buildContractPayload = (raw) => {
  const { _composites, ...rest } = raw;

  const withDates = {
    ...rest,
    studentData: {
      ...rest.studentData,
      studentBirthDate: splitDateString(_composites.studentBirthDate, 'birthDay', 'birthMonth', 'birthYear'),
    },
    evaluation: {
      ...rest.evaluation,
      date: splitDateString(_composites.evaluationDate, 'evaluationDay', 'evaluationMonth', 'evaluationYear'),
    },
    formationData: {
      ...rest.formationData,
      formationMaxEndingDate: splitDateString(_composites.formationMaxEndingDate),
      formationPrices: {
        ...rest.formationData.formationPrices,
        paymentOptions: {
          ...rest.formationData.formationPrices.paymentOptions,
          withDepositAndBalance: {
            ...rest.formationData.formationPrices.paymentOptions.withDepositAndBalance,
            paymentDate: splitDateString(_composites.paymentDate, 'paymentDay', 'paymentMonth', 'paymentYear'),
          },
        },
      },
    },
  };

  return deepConvertBooleans(withDates);
};

// Formate {day, month, year} en chaîne "JJ/MM/AAAA" pour l'affichage dans un
// champ composite unique (opération inverse de splitDateString).
export const joinDateParts = (parts, dayKey = 'day', monthKey = 'month', yearKey = 'year') =>
  `${parts[dayKey]}/${parts[monthKey]}/${parts[yearKey]}`;
