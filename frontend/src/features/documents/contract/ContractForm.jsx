import { useState } from 'react';
import leftBolt from './images/leftBolt.png';
import rightBolt from './images/rightBolt.png';
import ContractPage1 from './ContractPage1';
import ContractPage2 from './ContractPage2';
import ContractPage3 from './ContractPage3';
import ContractPage4 from './ContractPage4';
import ContractPage5 from './ContractPage5';
import './PrintContractStyles.css';

// Doit être rendu à l'intérieur d'un <FormProvider> (voir PrintContractView.jsx),
// partagé avec PrintContractButton — remplace le recours à Redux qui ne servait
// qu'à faire transiter les données entre ces deux composants frères.
export default function ContractForm({ student }) {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const dateObject = new Date();
  const datetime = dateObject.toLocaleDateString('fr-FR');

  const passToPreviousPage = (e) => {
    e.preventDefault();
    setCurrentPageIndex(currentPageIndex - 1);
  };

  const passToNextPage = (e) => {
    e.preventDefault();
    setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <div className="viewer-navigation">
      {currentPageIndex > 1 && (
        <div className="nav-bolt-left-bolt">
          <img src={leftBolt} className="left-bolt-image" alt="page précédente" onClick={(e) => passToPreviousPage(e)} />
        </div>
      )}

      {currentPageIndex < 5 && (
        <div className="nav-bolt-right-bolt">
          <img src={rightBolt} className="right-bolt-image" alt="page suivante" onClick={(e) => passToNextPage(e)} />
        </div>
      )}

      <div className="viewer-page-counter-wrapper">
        <div className="viewer-page-counter">{`Page ${currentPageIndex}`}</div>
        <div className="viewer-document">
          <ContractPage1 currentPageNumber={currentPageIndex} student={student} />
          <ContractPage2 currentPageNumber={currentPageIndex} student={student} />
          <ContractPage3 currentPageNumber={currentPageIndex} student={student} />
          <ContractPage4 currentPageNumber={currentPageIndex} student={student} />
          <ContractPage5 currentPageNumber={currentPageIndex} datetime={datetime} student={student} />
        </div>
      </div>
    </div>
  );
}
