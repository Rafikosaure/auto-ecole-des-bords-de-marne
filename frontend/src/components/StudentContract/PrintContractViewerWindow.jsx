import React, { useEffect } from 'react'
import { useState } from 'react'
import dataStorage from './StudentContractPages/temporaryData'
import './PrintContractStyles.css'
import leftBolt from './images/left-bolt.png'
import rightBolt from './images/right-bolt.png'
import StudentContractPage1 from './StudentContractPages/StudentContractPage1'
import StudentContractPage2 from './StudentContractPages/StudentContractPage2'
import StudentContractPage3 from './StudentContractPages/StudentContractPage3'
import StudentContractPage4 from './StudentContractPages/StudentContractPage4'
import StudentContractPage5 from './StudentContractPages/StudentContractPage5'



export default function PrintContractViewerWindow({ student }) {

    // Import local data
    const localData = dataStorage(student)

    // email & documents timestamp
    const dateObject = new Date()
    const datetime = dateObject.toLocaleDateString("fr-FR")
    const [currentPageIndex, setCurrentPageIndex] = useState(1)

    // Configure the code exam date and time
    const codeExamDateObject = new Date("January 03, 2025 08:45:00")
    const examOptionsDate = {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric"
    }
    const examOptionsTime = {
        hour: '2-digit', 
        minute:'2-digit'
    }
    // Lieu, jour et heure de l'examen
    const codeExamDate = codeExamDateObject.toLocaleDateString("fr-FR", examOptionsDate).toUpperCase()
    const codeExamHour = codeExamDateObject.toLocaleTimeString("fr-FR", examOptionsTime).replace(':', 'h')

    // Titre du document
    const [documentType, setDocumentType] = useState(localData.fileData.documentType)
    const [documentTitle, setDocumentTitle] = useState(localData.fileData.documentTitle)

    // Type de la formation
    const [formationTradB, setFormationTradB] = useState(localData.formationData.formationType.formationTradB)
    const [apprentAnticipConduite, setApprentAnticipConduite] = useState(localData.formationData.formationType.apprentAnticipConduite)
    const [conduiteSupervis, setConduiteSupervis] = useState(localData.formationData.formationType.conduiteSupervis)
    const [theoricalFormationLocationOnSite, setTheoricalFormationLocationOnSite] = useState(localData.formationData.formationType.theoricalFormation.location.onSite)
    const [theoricalFormationLocationRemote, setTheoricalFormationLocationRemote] = useState(localData.formationData.formationType.theoricalFormation.location.remote)
    const [theoricalFormationLocationOnSiteAndRemote, setTheoricalFormationLocationOnSiteAndRemote] = useState(localData.formationData.formationType.theoricalFormation.location.onSiteAndRemote)
    const [theoricalFormationLocationIndividualCourses, setTheoricalFormationLocationIndividualCourses] = useState(localData.formationData.formationType.theoricalFormation.location.individualCourses)
    const [theoricalFormationLocationGroupCourses, setTheoricalFormationLocationGroupCourses] = useState(localData.formationData.formationType.theoricalFormation.location.groupCourses)

    // Coordonnées de l'étudiant
    const [studentLastName, setStudentLastName] = useState(localData.studentData.studentLastName)
    const [studentFirstName, setStudentFirstName] = useState(localData.studentData.studentFirstName)
    // const [studentBirthDay, setStudentBirthDay] = useState(localData.studentData.studentBirthDate.birthDay)
    // const [studentBirthMonth, setStudentBirthMonth] = useState(localData.studentData.studentBirthDate.birthMonth)
    // const [studentBirthYear, setStudentBirthYear] = useState(localData.studentData.studentBirthDate.birthYear)
    const [studentBirthDate, setStudentBirthDate] = useState()
    const [studentAddressNumber, setStudentAddressNumber] = useState(localData.studentData.studentAddress.number)
    const [studentAddressStreet, setStudentAddressStreet] = useState(localData.studentData.studentAddress.street)
    const [studentAddressTown, setStudentAddressTown] = useState(localData.studentData.studentAddress.town)
    const [studentPhoneNumber, setStudentPhoneNumber] = useState(localData.studentData.studentPhoneNumber)
    const [studentEmail, setStudentEmail] = useState(localData.studentData.studentEmail)

    // Evaluation
    const [evaluationDate, setEvaluationDate] = useState('')
    const [evaluationInstructorFirstName, setEvaluationInstructorFirstName] = useState()
    const [evaluationVehicleType, setEvaluationVehicleType] = useState()
    const [evalPrealable, setEvalPrealable] = useState(localData.formationData.formationPrices.EvaluationPrealable.PRESTATION)
    const [evalObligatory, setEvalObligatory] = useState(localData.formationData.formationPrices.EvaluationPrealable.Obligatoire)
    const [evalPrixUnitTTC, setEvalPrixUnitTTC] = useState(`${localData.formationData.formationPrices.EvaluationPrealable.PrixUnitaireTTC}`)
    const [evalNbHeuresOuUnits, setEvalNbHeuresOuUnits] = useState(localData.formationData.formationPrices.EvaluationPrealable.NbHeures_ou_Units)
    const [evalMontantTTC, setEvalMontantTTC] = useState(`${localData.formationData.formationPrices.EvaluationPrealable.MontantTTC}`)

    // Formation suivie
    const [formationDurationDrivingPractice, setFormationDurationDrivingPractice] = useState()
    const [formationDurationTotalDrivingLearning, setFormationDurationTotalDrivingLearning] = useState(localData.formationData.formationDuration.totalDrivingLearningDuration)
    // const [formationMaxEndingDay, setFormationMaxEndingDay] = useState(localData.formationData.formationMaxEndingDate.day)
    // const [formationMaxEndingMonth, setFormationMaxEndingMonth] = useState(localData.formationData.formationMaxEndingDate.month)
    // const [formationMaxEndingYear, setFormationMaxEndingYear] = useState(localData.formationData.formationMaxEndingDate.year)
    const [formationMaxEndingDate, setFormationMaxEndingDate] = useState()

    // Localisation de l'auto-école
    // const [schoolLocationNumber, setSchoolLocationNumber] = useState(localData.schoolData.location.number)
    // const [schoolLocationStreet, setSchoolLocationStreet] = useState(localData.schoolData.location.street)
    // const [schoolLocationTown, setSchoolLocationTown] = useState(localData.schoolData.location.town)

    // Elements de signature du contrat
    const [initialsPage1, setInitialsPage1] = useState(localData.fileData.studentContractData.initialsOptions.ifInitialed_page1)
    const [initialsPage2, setInitialsPage2] = useState(localData.fileData.studentContractData.initialsOptions.ifInitialed_page2)
    const [initialsPage3, setInitialsPage3] = useState(localData.fileData.studentContractData.initialsOptions.ifInitialed_page3)
    const [initialsPage4, setInitialsPage4] = useState(localData.fileData.studentContractData.initialsOptions.ifInitialed_page4)
    const [initialsPage5, setInitialsPage5] = useState(localData.fileData.studentContractData.initialsOptions.ifInitialed_page5)
    // const [failToTheDrivingSchoolIsYes, setFailToTheDrivingSchoolIsYes] = useState(data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.isChecked)
    const [studentSignature, setStudentSignature] = useState(localData.fileData.studentContractData.isReadAndApproved)
    const [legalRepresent, setLegalRepresent] = useState(false)
    const [entrepriseSignatureAndStamp, setEntrepriseSignatureAndStamp] = useState(false)

    // Formation suivie et tarifs
    const [theoricalFormationDuration, setTheoricalFormationDuration] = useState(localData.formationData.formationType.theoricalFormation.duration)
    const [theoricalFormationIsChecked, setTheoricalFormationIsChecked] = useState(localData.formationData.formationType.theoricalFormation.isChecked)
    const [practicalFormationDuration, setPracticalFormationDuration] = useState(localData.formationData.formationType.practicalFormation.duration)
    const [typeFormation, setTypeFormation] = useState(localData.formationData.formationPrices.total.TypeFormation)
    const [totalFormationPrices, setTotalFormationPrices] = useState(`${localData.formationData.formationPrices.total.MontantTTC}`)
    const [gestionEleveObligatoire, setGestionEleveObligatoire] = useState(localData.formationData.formationPrices.Frais_Administratifs.raw001.Obligatoire)
    const [formationPricesAdminPriceUnitTTC, setFormationPricesAdminPriceUnitTTC] = useState(`${localData.formationData.formationPrices.Frais_Administratifs.raw001.PrixUnitaireTTC}`)
    const [formationPricesAdminNbHeuresOuUnits, setFormationPricesAdminNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Frais_Administratifs.raw001.NbHeures_ou_Units)
    const [formationPricesAdminMontantTTC, setFormationPricesAdminMontantTTC] = useState(`${localData.formationData.formationPrices.Frais_Administratifs.raw001.MontantTTC}`)
    const [formationPricesTheoryRDVPedagoObligatoire, setFormationPricesTheoryRDVPedagoObligatoire] = useState(localData.formationData.formationPrices.Theorie.raw001.Obligatoire)
    const [formationPricesTheoryRDVPedagoPriceUnitTTC, setFormationPricesTheoryRDVPedagoPriceUnitTTC] = useState(localData.formationData.formationPrices.Theorie.raw001.PrixUnitaireTTC)
    const [formationPricesTheoryRDVPedagoNbHeuresOuUnits, setFormationPricesTheoryRDVPedagoNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Theorie.raw001.NbHeures_ou_Units)
    const [formationPricesTheoryRDVPedagoMontantTTC, setFormationPricesTheoryRDVPedagoMontantTTC] = useState(localData.formationData.formationPrices.Theorie.raw001.MontantTTC)
    const [formationPricesTheoryCtrlConnaisancesObligatoire, setFormationPricesTheoryCtrlConnaisancesObligatoire] = useState(localData.formationData.formationPrices.Theorie.raw002.Obligatoire)
    const [formationPricesTheoryCtrlConnaisancesPriceUnitTTC, setFormationPricesTheoryCtrlConnaisancesPriceUnitTTC] = useState(localData.formationData.formationPrices.Theorie.raw002.PrixUnitaireTTC)
    const [formationPricesTheoryCtrlConnaisancesNbHeuresOuUnits, setFormationPricesTheoryCtrlConnaisancesNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Theorie.raw002.NbHeures_ou_Units)
    const [formationPricesTheoryCtrlConnaisancesMontantTTC, setFormationPricesTheoryCtrlConnaisancesMontantTTC] = useState(localData.formationData.formationPrices.Theorie.raw002.MontantTTC)
    const [formationPricesTheoryForfaitTheoObligatoire, setFormationPricesTheoryForfaitTheoObligatoire] = useState(localData.formationData.formationPrices.Theorie.raw003.Obligatoire)
    const [formationPricesTheoryForfaitTheoPriceUnitTTC, setFormationPricesTheoryForfaitTheoPriceUnitTTC] = useState(localData.formationData.formationPrices.Theorie.raw002.PrixUnitaireTTC)
    const [formationPricesTheoryForfaitTheoNbHeuresOuUnits, setFormationPricesTheoryForfaitTheoNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Theorie.raw002.NbHeures_ou_Units)
    const [formationPricesTheoryForfaitTheoMontantTTC, setFormationPricesTheoryForfaitTheoMontantTTC] = useState(localData.formationData.formationPrices.Theorie.raw002.MontantTTC)
    const [formationPricesTheoryVerifBookObligatoire, setFormationPricesTheoryVerifBookObligatoire] = useState(localData.formationData.formationPrices.Theorie.raw004.Obligatoire)
    const [formationPricesTheoryVerifBookPriceUnitTTC, setFormationPricesTheoryVerifBookPriceUnitTTC] = useState(localData.formationData.formationPrices.Theorie.raw004.PrixUnitaireTTC)
    const [formationPricesTheoryVerifBookNbHeuresOuUnits, setFormationPricesTheoryVerifBookNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Theorie.raw004.NbHeures_ou_Units)
    const [formationPricesTheoryVerifBookMontantTTC, setFormationPricesTheoryVerifBookMontantTTC] = useState(localData.formationData.formationPrices.Theorie.raw004.MontantTTC)
    const [formationPricesTheoryELearningAccessObligatoire, setFormationPricesTheoryELearningAccessObligatoire] = useState(localData.formationData.formationPrices.Theorie.raw005.Obligatoire)
    const [formationPricesTheoryELearningAccessPriceUnitTTC, setFormationPricesTheoryELearningAccessPriceUnitTTC] = useState(localData.formationData.formationPrices.Theorie.raw005.PrixUnitaireTTC)
    const [formationPricesTheoryELearningAccessNbHeuresOuUnits, setFormationPricesTheoryELearningAccessNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Theorie.raw005.NbHeures_ou_Units)
    const [formationPricesTheoryELearningAccessMontantTTC, setFormationPricesTheoryELearningAccessMontantTTC] = useState(localData.formationData.formationPrices.Theorie.raw005.MontantTTC)
    const [formationPricesPracticeRDVPrevObligatoire, setFormationPricesPracticeRDVPrevObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw001.Obligatoire)
    const [formationPricesPracticeRDVPrevPriceUnitTTC, setFormationPricesPracticeRDVPrevPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw001.PrixUnitaireTTC)
    const [formationPricesPracticeRDVPrevNbHeuresOuUnits, setFormationPricesPracticeRDVPrevNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw001.NbHeures_ou_Units)
    const [formationPricesPracticeRDVPrevMontantTTC, setFormationPricesPracticeRDVPrevMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw001.MontantTTC)
    const [formationPricesPracticeRDVPedagoObligatoire, setFormationPricesPracticeRDVPedagoObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw002.Obligatoire)
    const [formationPricesPracticeRDVPedagoPriceUnitTTC, setFormationPricesPracticeRDVPedagoPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw002.PrixUnitaireTTC)
    const [formationPricesPracticeRDVPedagoNbHeuresOuUnits, setFormationPricesPracticeRDVPedagoNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw002.NbHeures_ou_Units)
    const [formationPricesPracticeRDVPedagoMontantTTC, setFormationPricesPracticeRDVPedagoMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw002.MontantTTC)
    const [formationPricesPracticeConduiteBMObligatoire, setFormationPricesPracticeConduiteBMObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw003.Obligatoire)
    const [formationPricesPracticeConduiteBMPriceUnitTTC, setFormationPricesPracticeConduiteBMPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw003.PrixUnitaireTTC)
    const [formationPricesPracticeConduiteBMNbHeuresOuUnits, setFormationPricesPracticeConduiteBMNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw003.NbHeures_ou_Units)
    const [formationPricesPracticeConduiteBMMontantTTC, setFormationPricesPracticeConduiteBMMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw003.MontantTTC)
    const [formationPricesPracticeConduiteBVAObligatoire, setFormationPricesPracticeConduiteBVAObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw004.Obligatoire)
    const [formationPricesPracticeConduiteBVAPriceUnitTTC, setFormationPricesPracticeConduiteBVAPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw004.PrixUnitaireTTC)
    const [formationPricesPracticeConduiteBVANbHeuresOuUnits, setFormationPricesPracticeConduiteBVANbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw004.NbHeures_ou_Units)
    const [formationPricesPracticeConduiteBVAMontantTTC, setFormationPricesPracticeConduiteBVAMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw004.MontantTTC)
    const [formationPricesPracticeAccompExamObligatoire, setFormationPricesPracticeAccompExamObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw005.Obligatoire)
    const [formationPricesPracticeAccompExamPriceUnitTTC, setFormationPricesPracticeAccompExamPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw005.PrixUnitaireTTC)
    const [formationPricesPracticeAccompExamNbHeuresOuUnits, setFormationPricesPracticeAccompExamNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw005.NbHeures_ou_Units)
    const [formationPricesPracticeAccompExamMontantTTC, setFormationPricesPracticeAccompExamMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw005.MontantTTC)
    const [formationPricesPracticeForfaitPratObligatoire, setFormationPricesPracticeForfaitPratObligatoire] = useState(localData.formationData.formationPrices.Pratique.raw006.Obligatoire)
    const [formationPricesPracticeForfaitPratPriceUnitTTC, setFormationPricesPracticeForfaitPratPriceUnitTTC] = useState(localData.formationData.formationPrices.Pratique.raw006.PrixUnitaireTTC)
    const [formationPricesPracticeForfaitPratNbHeuresOuUnits, setFormationPricesPracticeForfaitPratNbHeuresOuUnits] = useState(localData.formationData.formationPrices.Pratique.raw006.NbHeures_ou_Units)
    const [formationPricesPracticeForfaitPratMontantTTC, setFormationPricesPracticeForfaitPratMontantTTC] = useState(localData.formationData.formationPrices.Pratique.raw006.MontantTTC)

    // Examen du code
    const [formationPriceOfCodeExam, setFormationPriceOfCodeExam] = useState(localData.formationData.formationPrices.priceOfCodeExam)

    useEffect(() => {
        console.log('Notre étudiant et ses données :', student)
    }, [student])


    const passToPreviousPage = (e) => {
        e.preventDefault()
        setCurrentPageIndex(currentPageIndex - 1)
    }


    const passToNextPage = (e) => {
        e.preventDefault()
        setCurrentPageIndex(currentPageIndex + 1)
    }


    const addCurrencySymbol = (string) => {
        const currentString = string.replaceAll("€", '').replaceAll(" ", '')
        const newString = `${currentString} €`
        return newString
    }

    const fromCheckedToTrue = (checkboxValue) => {
        if (checkboxValue) {
            return "checked"
        } else {
            return ""
        }
    }

    const fetchData = {
        fileData: {
            // print: true,
            documentType: documentType,
            documentTitle: documentTitle,
            dateTime: datetime,
            studentContractData: {
              location: "Bry-sur-Marne",
              isReadAndApproved: fromCheckedToTrue(true),   // traduire en "checked" si true !
              initialsOptions: {
                ifInitialed_page1: fromCheckedToTrue(initialsPage1), // traduire en "checked" si true !
                ifInitialed_page2: fromCheckedToTrue(initialsPage2), // traduire en "checked" si true !
                ifInitialed_page3: fromCheckedToTrue(initialsPage3), // traduire en "checked" si true !
                ifInitialed_page4: fromCheckedToTrue(initialsPage4), // traduire en "checked" si true !
                ifInitialed_page5: fromCheckedToTrue(initialsPage5), // traduire en "checked" si true !
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
              evaluationDay: evaluationDate.split('/')[0], // Vérifier la validité de la date !
              evaluationMonth: evaluationDate.split('/')[1], // Vérifier la validité de la date !
              evaluationYear: evaluationDate.split('/')[2] // Vérifier la validité de la date !
            },
            instructorFirstName: evaluationInstructorFirstName,
            vehicleType: evaluationVehicleType
          },
          emailType: "",
          studentData: {
            studentFirstName: studentFirstName,
            studentLastName: studentLastName,
            studentBirthDate: studentBirthDate,
            studentAddress: {
                number: studentAddressNumber,
                street: studentAddressStreet,
                town: studentAddressTown
            },
            studentPhoneNumber: studentPhoneNumber,
            studentEmail: studentEmail
          },
          formationData: {
            formationType: {
              formationTradB: fromCheckedToTrue(formationTradB), // traduire en "checked" si true !
              apprentAnticipConduite: fromCheckedToTrue(apprentAnticipConduite), // traduire en "checked" si true !
              conduiteSupervis: fromCheckedToTrue(conduiteSupervis), // traduire en "checked" si true !
              theoricalFormation: {
                isChecked: fromCheckedToTrue(theoricalFormationIsChecked), // traduire en "checked" si true !
                duration: theoricalFormationDuration,
                location: {
                  onSite: fromCheckedToTrue(theoricalFormationLocationOnSite), // traduire en "checked" si true !
                  remote: fromCheckedToTrue(theoricalFormationLocationRemote), // traduire en "checked" si true !
                  onSiteAndRemote: fromCheckedToTrue(theoricalFormationLocationOnSiteAndRemote), // traduire en "checked" si true !
                  individualCourses: fromCheckedToTrue(theoricalFormationLocationIndividualCourses), // traduire en "checked" si true !
                  groupCourses: fromCheckedToTrue(theoricalFormationLocationGroupCourses) // traduire en "checked" si true !
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
              day: "00",
              month: "00",
              year: "0000"
            },
            formationEndingDesiredDate: {
              day: "00",
              month: "00",
              year: "0000"
            },
            formationMaxEndingDate: {
              day: "00",
              month: "00",
              year: "0000"
            },
            formationDuration: {
              drivingPractice: "000",
              totalDrivingLearningDuration: "00"
            },
            drivingTestExamDatetime: {
              examDate: "", // Mettre en forme la date d'examen avant la validation !
              examTime: "" // Mettre en forme l'heure d'examen avant la validation !
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





  return (
    <div className='viewer-navigation'>
        {currentPageIndex <= 1 ? (
            null
        ) : (
            <div className='nav-bolt-left-bolt'>
                <img src={leftBolt} className='left-bolt-image' alt="page précédente" onClick={(e) => passToPreviousPage(e)} />
            </div>
        )}
        
        {currentPageIndex >= 5 ? (
            null
        ) : (
            <div className='nav-bolt-right-bolt'>
                <img src={rightBolt} className='right-bolt-image' alt="page suivante" onClick={(e) => passToNextPage(e)} />
            </div>
        )}
        
        <div className='viewer-page-counter-wrapper'>
            <div className='viewer-page-counter'>{`Page ${currentPageIndex}`}</div>
            <div className='viewer-document'>
                <StudentContractPage1 currentPageNumber={currentPageIndex} student={student} setDocumentTitle={setDocumentTitle} setFormationTradB={setFormationTradB} setApprentAnticipConduite={setApprentAnticipConduite} setConduiteSupervis={setConduiteSupervis} setStudentLastName={setStudentLastName} setStudentFirstName={setStudentFirstName} setStudentBirthDate={setStudentBirthDate} setStudentAddressNumber={setStudentAddressNumber} setStudentAddressStreet={setStudentAddressStreet} setStudentAddressTown={setStudentAddressTown} setStudentPhoneNumber={setStudentPhoneNumber} setStudentEmail={setStudentEmail} setEvaluationDate={setEvaluationDate} setEvaluationInstructorFirstName={setEvaluationInstructorFirstName} setEvaluationVehicleType={setEvaluationVehicleType} setFormationDurationDrivingPractice={setFormationDurationDrivingPractice} setFormationDurationTotalDrivingLearning={setFormationDurationTotalDrivingLearning} setFormationMaxEndingDate={setFormationMaxEndingDate} initialsPage1={initialsPage1} setInitialsPage1={setInitialsPage1} />

                <StudentContractPage2 currentPageNumber={currentPageIndex} student={student} initialsPage2={initialsPage2} setInitialsPage2={setInitialsPage2} setTheoricalFormationDuration={setTheoricalFormationDuration} setPracticalFormationDuration={setPracticalFormationDuration} setTypeFormation={setTypeFormation} setTotalFormationPrices={setTotalFormationPrices} setGestionEleveObligatoire={setGestionEleveObligatoire} setFormationPricesAdminPriceUnitTTC={setFormationPricesAdminPriceUnitTTC} setFormationPricesAdminNbHeuresOuUnits={setFormationPricesAdminNbHeuresOuUnits} setFormationPricesAdminMontantTTC={setFormationPricesAdminMontantTTC} setFormationPricesTheoryRDVPedagoObligatoire={setFormationPricesTheoryRDVPedagoObligatoire} setFormationPricesTheoryRDVPedagoPriceUnitTTC={setFormationPricesTheoryRDVPedagoPriceUnitTTC} setFormationPricesTheoryRDVPedagoNbHeuresOuUnits={setFormationPricesTheoryRDVPedagoNbHeuresOuUnits} setFormationPricesTheoryRDVPedagoMontantTTC={setFormationPricesTheoryRDVPedagoMontantTTC} setFormationPricesTheoryCtrlConnaisancesObligatoire={setFormationPricesTheoryCtrlConnaisancesObligatoire} setFormationPricesTheoryCtrlConnaisancesPriceUnitTTC={setFormationPricesTheoryCtrlConnaisancesPriceUnitTTC} setFormationPricesTheoryCtrlConnaisancesNbHeuresOuUnits={setFormationPricesTheoryCtrlConnaisancesNbHeuresOuUnits} setFormationPricesTheoryCtrlConnaisancesMontantTTC={setFormationPricesTheoryCtrlConnaisancesMontantTTC} setFormationPricesTheoryForfaitTheoObligatoire={setFormationPricesTheoryForfaitTheoObligatoire} setFormationPricesTheoryForfaitTheoPriceUnitTTC={setFormationPricesTheoryForfaitTheoPriceUnitTTC} setFormationPricesTheoryForfaitTheoNbHeuresOuUnits={setFormationPricesTheoryForfaitTheoNbHeuresOuUnits} setFormationPricesTheoryForfaitTheoMontantTTC={setFormationPricesTheoryForfaitTheoMontantTTC} setFormationPricesTheoryVerifBookObligatoire={setFormationPricesTheoryVerifBookObligatoire} setFormationPricesTheoryVerifBookPriceUnitTTC={setFormationPricesTheoryVerifBookPriceUnitTTC} setFormationPricesTheoryVerifBookNbHeuresOuUnits={setFormationPricesTheoryVerifBookNbHeuresOuUnits} setFormationPricesTheoryVerifBookMontantTTC={setFormationPricesTheoryVerifBookMontantTTC} setFormationPricesTheoryELearningAccessObligatoire={setFormationPricesTheoryELearningAccessObligatoire} setFormationPricesTheoryELearningAccessPriceUnitTTC={setFormationPricesTheoryELearningAccessPriceUnitTTC} setFormationPricesTheoryELearningAccessNbHeuresOuUnits={setFormationPricesTheoryELearningAccessNbHeuresOuUnits} setFormationPricesTheoryELearningAccessMontantTTC={setFormationPricesTheoryELearningAccessMontantTTC} setFormationPricesPracticeRDVPrevObligatoire={setFormationPricesPracticeRDVPrevObligatoire} setFormationPricesPracticeRDVPrevPriceUnitTTC={setFormationPricesPracticeRDVPrevPriceUnitTTC} setFormationPricesPracticeRDVPrevNbHeuresOuUnits={setFormationPricesPracticeRDVPrevNbHeuresOuUnits} setFormationPricesPracticeRDVPrevMontantTTC={setFormationPricesPracticeRDVPrevMontantTTC} setFormationPricesPracticeRDVPedagoObligatoire={setFormationPricesPracticeRDVPedagoObligatoire} setFormationPricesPracticeRDVPedagoPriceUnitTTC={setFormationPricesPracticeRDVPedagoPriceUnitTTC} setFormationPricesPracticeRDVPedagoNbHeuresOuUnits={setFormationPricesPracticeRDVPedagoNbHeuresOuUnits} setFormationPricesPracticeRDVPedagoMontantTTC={setFormationPricesPracticeRDVPedagoMontantTTC} setFormationPricesPracticeConduiteBMObligatoire={setFormationPricesPracticeConduiteBMObligatoire} setFormationPricesPracticeConduiteBMPriceUnitTTC={setFormationPricesPracticeConduiteBMPriceUnitTTC} setFormationPricesPracticeConduiteBMNbHeuresOuUnits={setFormationPricesPracticeConduiteBMNbHeuresOuUnits} setFormationPricesPracticeConduiteBMMontantTTC={setFormationPricesPracticeConduiteBMMontantTTC} setFormationPricesPracticeConduiteBVAObligatoire={setFormationPricesPracticeConduiteBVAObligatoire} setFormationPricesPracticeConduiteBVAPriceUnitTTC={setFormationPricesPracticeConduiteBVAPriceUnitTTC} setFormationPricesPracticeConduiteBVANbHeuresOuUnits={setFormationPricesPracticeConduiteBVANbHeuresOuUnits} setFormationPricesPracticeConduiteBVAMontantTTC={setFormationPricesPracticeConduiteBVAMontantTTC} setFormationPricesPracticeAccompExamObligatoire={setFormationPricesPracticeAccompExamObligatoire} setFormationPricesPracticeAccompExamPriceUnitTTC={setFormationPricesPracticeAccompExamPriceUnitTTC} setFormationPricesPracticeAccompExamNbHeuresOuUnits={setFormationPricesPracticeAccompExamNbHeuresOuUnits} setFormationPricesPracticeAccompExamMontantTTC={setFormationPricesPracticeAccompExamMontantTTC} setFormationPricesPracticeForfaitPratObligatoire={setFormationPricesPracticeForfaitPratObligatoire} setFormationPricesPracticeForfaitPratPriceUnitTTC={setFormationPricesPracticeForfaitPratPriceUnitTTC} setFormationPricesPracticeForfaitPratNbHeuresOuUnits={setFormationPricesPracticeForfaitPratNbHeuresOuUnits} setFormationPricesPracticeForfaitPratMontantTTC={setFormationPricesPracticeForfaitPratMontantTTC} setEvalPrealable={setEvalPrealable} setEvalObligatory={setEvalObligatory} setEvalPrixUnitTTC={setEvalPrixUnitTTC} setEvalNbHeuresOuUnits={setEvalNbHeuresOuUnits} setEvalMontantTTC={setEvalMontantTTC} setFormationPriceOfCodeExam={setFormationPriceOfCodeExam} setTheoricalFormationIsChecked={setTheoricalFormationIsChecked} />

                <StudentContractPage3 currentPageNumber={currentPageIndex} student={student} initialsPage3={initialsPage3} setInitialsPage3={setInitialsPage3} setTheoricalFormationLocationOnSite={setTheoricalFormationLocationOnSite} setTheoricalFormationLocationRemote={setTheoricalFormationLocationRemote} setTheoricalFormationLocationOnSiteAndRemote={setTheoricalFormationLocationOnSiteAndRemote} setTheoricalFormationLocationIndividualCourses={setTheoricalFormationLocationIndividualCourses} setTheoricalFormationLocationGroupCourses={setTheoricalFormationLocationGroupCourses} />

                <StudentContractPage4 currentPageNumber={currentPageIndex} student={student} initialsPage4={initialsPage4} setInitialsPage4={setInitialsPage4} />

                <StudentContractPage5 currentPageNumber={currentPageIndex} datetime={datetime} student={student} initialsPage5={initialsPage5} setInitialsPage5={setInitialsPage5} studentSignature={studentSignature} setStudentSignature={setStudentSignature} legalRepresent={legalRepresent} setLegalRepresent={setLegalRepresent} entrepriseSignatureAndStamp={entrepriseSignatureAndStamp} setEntrepriseSignatureAndStamp={setEntrepriseSignatureAndStamp} />
            </div>
            
        </div>
    </div>
  )
}
