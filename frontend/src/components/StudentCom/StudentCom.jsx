import React from "react"
import { useState } from "react";
import ConvocFormation from './ConvocFormation/ConvocFormation'
import './StudentCom.css'
// import { right } from "@popperjs/core";
import { useForm } from 'react-hook-form'




const StudentCom = ({
  id,
  lastName,
  firstName,
  email,
  phoneNumber,
  birthdate,
  formationStart,
  formationDesiredEnd,
  formationMaxDuration,
  showMore
}) => {


  const [showRadioButtons, setShowRadioButtons] = useState("none")
  const [inputValue, setInputValue] = useState("none")
  const [showDocumentOption, setShowDocumentOption] = useState("none")
  const [showEmailSendButton, setShowEmailSendButton] = useState("none")
  const { register, handleSubmit, reset } = useForm()


  const manageButtonsDisplay = (e) => {
    e.preventDefault()
    if (showRadioButtons === "none") {
      setShowDocumentOption("none")
      setShowRadioButtons('block')
    } else {
      setInputValue('none')
      setShowDocumentOption("none")
      setShowRadioButtons('none')
      setShowEmailSendButton("none")
      reset()
    }
  }

  const manageRadioInputValues = (e) => {
    const inputValueConst = e.target.value
    setInputValue(inputValueConst)
    if (inputValueConst === "convoc-formation") {
      console.log(inputValueConst)
      // setShowEmailSendButton("flex")
    } else if (inputValueConst === "relaunch") {
      console.log(inputValueConst)
      // setShowEmailSendButton("flex")
      setShowDocumentOption('none')
    } else {
      console.log(inputValueConst)
      setShowDocumentOption('none')
    }
    console.log(inputValueConst)
  }


    const showDocumentFunction = (e) => {
      e.preventDefault()
      if (showDocumentOption === "none") {
        setShowDocumentOption("block")
      } else {
        setShowDocumentOption("none")
      }
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
              <div className="form-check">
                <input className="form-check-input" type="radio" name="email-radio-button" id="radio-convocation-permis" value='convoc-permis' {...register("email-radio-button")} />
                <label className="form-check-label" htmlFor="radio-convocation-permis">
                  Convocation épreuve du permis
                </label>
              </div>
            </form>
          </div>

          {inputValue !== "none" && (
          <div className={`d-flex flex-column justify-content-start align-items-start p-2 gap-3`}>
            <div className={`d-flex justify-content-center align-items-center`} style={{ height: "80px" }}>
              <button type="button" className={`btn btn-danger`} style={{ width: "210px", height: "50px", fontSize: "13px" }}>Expédier l'email</button>
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
          <ConvocFormation />
        </div>
      </div>
      )}
      
      
      {/* <Card.Body>
        <Card.Title>
          Communication avec l'étudiant
        </Card.Title>
        <Row>
          <Col md={6}>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Téléphone:</strong> {phoneNumber}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Date de naissance:</strong> {birthdate}
            </p>
            <p>
              <strong>Début de la formation:</strong> {formationStart}
            </p>
            <p>
              <strong>Date de fin souhaitée:</strong> {formationDesiredEnd}
            </p>
            <p>
              <strong>Durée maximale de la formation:</strong>{" "}
              {formationMaxDuration}
            </p>
            {showMore && <Link to={`/student/${id}`}>Voir plus</Link>}
          </Col>
        </Row>
      </Card.Body> */}
    </section>
  );
};

export default StudentCom;
