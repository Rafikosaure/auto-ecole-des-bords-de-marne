import './StudentContractPages.css'
import data from './temporaryData'
import React, { useState, useEffect } from 'react'




export default function StudentContractPage1({ StudentInitials, currentPageNumber }) {

    // Gestion de la pagination
    const [pageDisplay, setPageDisplay] = useState('block')

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
    // Lieu, jour et heure de l'examen
    const codeExamDate = codeExamDateObject.toLocaleDateString("fr-FR", examOptionsDate).toUpperCase()
    const codeExamHour = codeExamDateObject.toLocaleTimeString("fr-FR", examOptionsTime).replace(':', 'h')

    // Elements de signature du contrat
    const [initialsPage1, setInitialsPage1] = useState(data.fileData.studentContractData.initialsOptions.ifInitialed_page1)


    useEffect(() => {
        if (currentPageNumber === 3) {
            setPageDisplay('block')
        } else {
            setPageDisplay('none')
        }
    }, [pageDisplay, currentPageNumber])



  return (
    <div className='wrapper' style={{ display: `${pageDisplay}` }}>
        
        <div className="section">
          <p>Les objectifs de la formation sont précisés dans les quatre compétences de formation du livret
            d'apprentissage remis à l'élève le jour de la signature du contrat.</p>
          <p><strong>Ces compétences sont les suivantes :</strong></p>
          <ul className="unordered-list">
            <li><strong>MAÎTRISER LE MANIEMENT</strong> du véhicule dans un trafic faible ou nul</li>
            <li><strong>APPRÉHENDER</strong> la route et circuler dans des conditions normales</li>
            <li><strong>CIRCULER</strong> dans des conditions difficiles et partager la route avec les autres usagers
            </li>
            <li><strong>PRATIQUER une conduite autonome, sûre et économique</strong></li>
          </ul>
        </div>
        <div className="section">
          <h4>1.1 Programme de formation théorique en vigueur</h4>
          <p>La formation théorique générale dispensée par l'école de conduite correspond au programme de l'épreuve
            théorique générale (ETG). Elle porte notamment sur la connaissance des règlements relatifs à la circulation
            et la conduite d'un véhicule, ainsi que sur celle des bons comportements du conducteur. Seront également
            dispensés : les règles de sécurité routière à appliquer dans les tunnels, les précautions à prendre en
            quittant le véhicule, les facteurs de sécurité concernant le chargement du véhicule et les personnes
            transportées, les règles de conduite respectueuses de l'environnement, ainsi que la réglementation relative
            à l'obligation d'assurance et aux documents administratifs liés à l'utilisation du véhicule.</p>
        </div>
        <div className="section">
          <h4>1.2 Déroulement de la formation</h4>
          <div className="checkboxes">
            <p className="checkbox-section-element"><strong>L'enseignement théorique se déroule: </strong></p>
            <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.theoricalFormation.location.onSite} /><label style={{ marginLeft: '1px' }}>Sur place</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.theoricalFormation.location.remote} /><label style={{ marginLeft: '1px' }}>À distance</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.theoricalFormation.location.onSiteAndRemote} /><label style={{ marginLeft: '1px' }}>Les deux</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.theoricalFormation.location.individualCourses} /><label style={{ marginLeft: '1px' }}>En cours individuel</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.theoricalFormation.location.groupCourses} /><label style={{ marginLeft: '1px' }}>En cours collectif</label></div>
          </div>
        </div>
        <div className="section">
          <h4>1.3 Moyens pédagogiques et techniques</h4>
          <p><strong>Soit : </strong>à distance via l'application PACKWEB 2, un login vous sera fourni ({data.formationData.formationPrices.Theorie.packwebAppAccessCodePrices.pricePerMonth}/mois ou {data.formationData.formationPrices.Theorie.packwebAppAccessCodePrices.priceForFourMonths}/4 mois).</p>
          <p><strong>Soit : </strong>En salle audiovisuelle (écran, tablette, feuille de réponse, émargement) voir
            horaires d'ouverture.</p>
        </div>
        <div className="section">
          <h4>1.4 Accompagnement et inscription à l'épreuve théorique générale (ETG)</h4>
          <p>Voir au-dessus EXAMEN (code de la Route).</p>
        </div>
        <div className="section" style={{marginBottom: '30px'}}>
          <h4>2.1 Programme de formation en vigueur (voir annexe).</h4>
        </div>
        <div className="section">
          <h4>2.2 Calendrier</h4>
          <p>Le calendrier de formation pratique est établi par l'école de conduite en concertation avec l'élève, en
            fonction de leurs disponibilités respectives.</p>
        </div>
        <div className="section">
          <h4>2.3 Déroulement de la formation</h4>
          <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'baseline', gap: '15px'}}>
            <div style={{display: 'flex'}}>
              <p className="checkbox-section-element">L'enseignement pratique se déroule :</p>
              <div className="checkbox-section-element" style={{marginLeft: '22px'}}><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.practicalFormation.location.openWayWithAnInstructor} /><label style={{ marginLeft: '5px' }}>Sur voies ouvertes à la circulation avec un enseignant. En cours
                  individuel.</label></div>
            </div>
            <div style={{display: 'flex', gap: '100px'}}>
              <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.practicalFormation.location.manualTransmission} /><label style={{ marginLeft: '5px' }}>Sur
                  boîte manuelle</label></div>
              <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationType.practicalFormation.location.automaticTransmission} /><label style={{ marginLeft: '5px' }}>Sur
                  boîte automatique</label></div>
            </div>
          </div>
          <p style={{ marginTop: '10px' }}>La durée de chaque leçon en formation pratique comprend le temps nécessaire notamment à l'accueil, la
            détermination de l'objectif, la leçon, l'évaluation et le bilan de la leçon. Soit 55 minutes.</p>
        </div>
        <div className="section">
          <h4>2.4 Évaluation des compétences en fin de formation initiale CAS CONDUITE SUPERVISEE</h4>
          <p>Pendant la formation pratique définie lors de l'évaluation préalable, ou à tout moment à la demande de
            l'élève, l'enseignant effectue un bilan des compétences acquises par l'élève : si l'élève satisfait à ce
            bilan, l'école de conduite lui délivre une attestation de fin de formation initiale. La poursuite de la
            formation dans le cadre de la conduite supervisée pourra être envisagée. Dans le cas contraire, en fonction
            du résultat obtenu par l'élève et de son niveau, l'école de conduite précise les points à approfondir.
            Lorsque le nombre d'heures prévues initialement au contrat, n'a pas suffi à l'élève pour atteindre le niveau
            lui permettant de se présenter à l'épreuve pratique ou en cas d'échec à cette épreuve, un complément
            d'heures de formation pourra être proposé par l'école de conduite.</p>
        </div>
        <div className="section">
          <h4>2.5 Présentation à l'épreuve pratique du permis de conduire</h4>
          <p>L'élève sera présenté à l'épreuve pratique par l'école de conduite, suivant les dates arrêtées et
            communiquées par l'autorité administrative.</p>
        </div>




        <div className="initials"><input type="checkbox" className='input-checkbox' defaultChecked={data.fileData.studentContractData.initialsOptions.ifInitialed_page1} onChange={(e) => setInitialsPage1(e.target.checked)} /> <strong>Initiales:</strong>
            {initialsPage1 ? (
                <img className="image-initials" src={StudentInitials} alt="paraphe de l'étudiant" />
            ) : (
                null
            )}
        </div>
        <div className="footer">Page 3 sur 5</div>
    </div>
  )
}
