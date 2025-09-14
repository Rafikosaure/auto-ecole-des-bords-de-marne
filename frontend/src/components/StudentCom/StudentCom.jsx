import axios from 'axios'
import { useState } from "react";
import ConvocFormation from './ConvocFormation/ConvocFormation'
import './StudentCom.css'
import { useForm } from 'react-hook-form'
import localData from './ConvocFormation/temporaryData'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config.js'



const StudentCom = ({ student }) => {

  // const documentData = useSelector(selectDocumentData)
  const [showRadioButtons, setShowRadioButtons] = useState("none")
  const [inputValue, setInputValue] = useState("none")
  const [showDocumentOption, setShowDocumentOption] = useState("none")
  const [formFetchData, setFormFetchData] = useState()
  const { register, handleSubmit, reset } = useForm()


  const manageButtonsDisplay = (e) => {
    e.preventDefault()
    if (showRadioButtons === "none") {
      setShowDocumentOption("none")
      setFormFetchData()
      setShowRadioButtons('block')
    } else {
      setInputValue('none')
      setShowDocumentOption("none")
      setFormFetchData()
      setShowRadioButtons('none')
      reset()
    }
  }

  const manageRadioInputValues = (e) => {
    const inputValueConst = e.target.value
    setInputValue(inputValueConst)
    if (inputValueConst === "convoc-formation") {
      setFormFetchData()
    } else if (inputValueConst === "relaunch") {
      setShowDocumentOption('none')
      setFormFetchData()
    } else if (inputValueConst === "convoc-permis") {
      setShowDocumentOption('none')
      setFormFetchData()
    } else {
      setShowDocumentOption('none')
      setFormFetchData()
    }
  }


    const showDocumentFunction = (e) => {
      e.preventDefault()
      if (showDocumentOption === "none") {
        setShowDocumentOption("block")
        setFormFetchData()
      } else {
        setShowDocumentOption("none")
      }
    }

    
    const notifyIfSendingFailed = () => 
      toast.error("L'envoi de l'email a échoué. Veuillez vérifier la validité de l'adresse email et réessayer. Si le problème persiste, contactez l'administrateur. Merci.");


    const notifyIfEmailIsArrived = (toastNotification, datetime) => 
      toast.success(
        <div>
          <p>{toastNotification}</p><br />
          <p>Date & heure de l'envoi: {datetime}.</p>
        </div>
      );


    const manageFetchData = (e) => {
      e.preventDefault()

      // email & documents timestamp
      const dateObject = new Date()
      const datetime = dateObject.toLocaleDateString("fr-FR")

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
      const codeExamDate = codeExamDateObject.toLocaleDateString("fr-FR", examOptionsDate).toUpperCase()
      const codeExamHour = codeExamDateObject.toLocaleTimeString("fr-FR", examOptionsTime).replace(':', 'h')

      // Date de début de formation
      const studentFormationStartDate = new Date(student.formationStart).toLocaleDateString("fr-FR")
  
      // Date désirée de fin de formation
      const studentFormationEndingDesiredDate = new Date(student.formationDesiredEnd).toLocaleDateString("fr-FR")

      let fetchData = {
        formationData: {
          formationTitle: localData.formationTitle,
          drivingTestExamDatetime: {
            examDate: codeExamDate,
            examHour: codeExamHour
          },
          formationStartDate: {
            day: studentFormationStartDate.split('/')[0],
            month: studentFormationStartDate.split('/')[1],
            year: studentFormationStartDate.split('/')[2]
          },
          formationEndingDesiredDate: {
              day: studentFormationEndingDesiredDate.split('/')[0],
              month: studentFormationEndingDesiredDate.split('/')[1],
              year: studentFormationEndingDesiredDate.split('/')[2]
          },
        },
        emailType: 'convocation_formation',
        studentData: {
          studentFirstName: student.firstName,
          studentLastName: student.lastName,
          studentEmail: student.email
        },
        schoolData: {
          location: {
            number: "9",
            street: "Grande rue Charles de Gaulle",
            town: "Bry-sur-Marne"
          }
        },
      }

      if (formFetchData !== undefined) {
        fetchData = {
          fileData: {
            documentType: 'Convocation_Formation',
            documentTitle: formFetchData.fileData.documentTitle.toUpperCase(),
            dateTime: datetime
          },
          formationData: {
            formationTitle: formFetchData.formationTitle,
            drivingTestExamDatetime: {
              examDate: codeExamDate,
              examHour: codeExamHour
            },
            formationStartDate: {
              day: formFetchData.formationStartDate.day,
              month: formFetchData.formationStartDate.month,
              year: formFetchData.formationStartDate.year
            },
            formationEndingDesiredDate: {
                day: formFetchData.formationEndingDesiredDate.day,
                month: formFetchData.formationEndingDesiredDate.month,
                year: formFetchData.formationEndingDesiredDate.year
            },
            formationMaxEndingDate: {
                day: formFetchData.formationMaxEndingDate.day,
                month: formFetchData.formationMaxEndingDate.month,
                year: formFetchData.formationMaxEndingDate.year
            },
            formationDuration: {
                drivingPractice: formFetchData.formationDuration.drivingPractice
            }
          },
          emailType: 'convocation_formation',
          studentData: {
            studentFirstName: formFetchData.studentFirstName,
            studentLastName: formFetchData.studentLastName,
            studentEmail: student.email
          },
          schoolData: {
            location: {
              number: "9",
              street: "Grande rue Charles de Gaulle",
              town: "Bry-sur-Marne"
            }
          },
        }
      }
      if (inputValue === "relaunch") {
        fetchData.emailType = "relaunch"
      }
      if (inputValue === "convoc-permis") {
        fetchData.emailType = "convocation_exam"
      }
      if (showDocumentOption === "none") {
        delete fetchData.fileData
      }
    

      // Envoi de la requête
      axios.post(`${config.apiBaseUrl}/emails/send-mail/${student.id}`, fetchData)
      .then(data => {
        if (data.data.emailIsArrived === true) {
          notifyIfEmailIsArrived(data.data.toastNotification, data.data.datetime)
        }
      
      })
      .catch(error => {
        console.log(error)
        notifyIfSendingFailed()
      })
      reset()
      setFormFetchData()
      setInputValue('none')
      setShowRadioButtons('none')
      setShowDocumentOption("none")
    }




  return (
    <section className="mb-3 container-md d-flex flex-column justify-content-between border border-lightgrey border-1 rounded overflow-hidden">
      <h2 className="text-break ms-auto me-auto mt-3 mb-5 fs-4">Communication avec l'étudiant</h2>
      <div className="container-md d-flex justify-content-center align-items-center mb-3">
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <div className={`d-flex flex-column justify-content-start align-items-start p-2 gap-3`}>
              <button type="button" className="btn btn-primary" style={{ width: "210px", height: "50px", fontSize: "14px" }} onClick={(e) => manageButtonsDisplay(e)}>Contacter l'étudiant par email</button>
            <form onChange={(e) => handleSubmit(manageRadioInputValues(e))} className={`d-${showRadioButtons}`} style={{ width: "210px", height: "80px", fontSize: "13px" }}>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="email-radio-button" id="radio-convocation-formation" value='convoc-formation' {...register("email-radio-button")} />
                <label className="form-check-label" htmlFor="radio-convocation-formation">
                  Convocation à la formation
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="email-radio-button" id="radio-relaunch" value='relaunch' {...register("email-radio-button")} />
                <label className="form-check-label" htmlFor="radio-relaunch">
                  Relance
                </label>
              </div>
              {/* <div className="form-check">
                <input className="form-check-input" type="radio" name="email-radio-button" id="radio-convocation-permis" value='convoc-permis' {...register("email-radio-button")} />
                <label className="form-check-label" htmlFor="radio-convocation-permis">
                  Convocation épreuve du permis
                </label>
              </div> */}
            </form>
          </div>

          {inputValue !== "none" && (
          <div className={`d-flex flex-column justify-content-start align-items-start p-2 gap-3`}>
            <div className={`d-flex justify-content-center align-items-center`} style={{ height: "80px" }}>
              <button type="button" className={`btn btn-danger`} style={{ width: "210px", height: "50px", fontSize: "13px" }} onClick={(e) => manageFetchData(e)}>Expédier l'email</button>
            </div>

            {inputValue === "convoc-formation" && (
              <div className={`d-flex justify-content-center align-items-center`} style={{ height: "80px" }}>
                <button type="button" onClick={(e) => showDocumentFunction(e)} className={`btn btn-warning d-block`} style={{ width: "210px", height: "50px", fontSize: "13px" }}>Joindre une convocation pdf</button>
              </div>
            )}
          </div>
          )}
          
        </div>
          
      </div>

      {showDocumentOption === "block" && (
        <div className="d-flex flex-column">
        <div className="d-flex justify-content-center align-items-center" style={{ width: "auto", height: "20px", fontSize: "12px", backgroundColor: "lightgreen" }}>Modifiez le document si nécessaire</div>
        <div className="container-md d-flex justify-content-center align-items-center document-viewver bg-secondary bg-opacity-25 mb-3">
          
          {/* Ne pas oublier de passer à <ConvocFormation /> les bonnes données en props quant ce sera le moment */}
          <ConvocFormation student={student} setFormFetchData={setFormFetchData} />
        </div>
      </div>
      )}
    </section>
  );
};

export default StudentCom;
