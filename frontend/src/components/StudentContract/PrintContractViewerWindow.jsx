import React from 'react'
import { useState } from 'react'
import './PrintContractStyles.css'
import leftBolt from './images/left-bolt.png'
import rightBolt from './images/right-bolt.png'
import StudentContractPage1 from './StudentContractPages/StudentContractPage1'
import StudentContractPage2 from './StudentContractPages/StudentContractPage2'
import StudentContractPage3 from './StudentContractPages/StudentContractPage3'
import StudentContractPage4 from './StudentContractPages/StudentContractPage4'
import StudentContractPage5 from './StudentContractPages/StudentContractPage5'
import StudentInitials from './StudentContractPages/images/studentInitials.png'
import StudentSignature from './StudentContractPages/images/studentSignature.png'
import RepLegalSignature from './StudentContractPages/images/legalRepresentSignature.png'
import EntrepriseSignature from './StudentContractPages/images/enterpriseSignature.png'


export default function PrintContractViewerWindow() {

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
                <StudentContractPage1 StudentInitials={StudentInitials} currentPageNumber={currentPageIndex} />
                <StudentContractPage2 StudentInitials={StudentInitials} currentPageNumber={currentPageIndex} addCurrencySymbol={addCurrencySymbol} />
                <StudentContractPage3 StudentInitials={StudentInitials} currentPageNumber={currentPageIndex} />
                <StudentContractPage4 StudentInitials={StudentInitials} currentPageNumber={currentPageIndex} />
                <StudentContractPage5 StudentInitials={StudentInitials} StudentSignature={StudentSignature} RepLegalSignature={RepLegalSignature} EntrepriseSignature={EntrepriseSignature} currentPageNumber={currentPageIndex} datetime={datetime} />
            </div>
            
        </div>
    </div>
  )
}
