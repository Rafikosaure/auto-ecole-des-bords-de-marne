import './StudentContractPages.css'
import dataStorage from './temporaryData'
import React, { useState, useEffect } from 'react'




export default function StudentContractPage4({ currentPageNumber, student, initialsPage4, setInitialsPage4 }) {

    // Import des données par défaut
    const data = dataStorage(student)

    // Gestion de la pagination
    const [pageDisplay, setPageDisplay] = useState('block')


    useEffect(() => {
        if (currentPageNumber === 4) {
            setPageDisplay('block')
        } else {
            setPageDisplay('none')
        }
    }, [pageDisplay, currentPageNumber])



  return (
    <div className='wrapper' style={{ display: `${pageDisplay}` }}>
        
        <div className="section">
            <p>En cas d'échec, et après accord entre les parties sur les besoins de l'élève, l'école de conduite présentera ce dernier à une nouvelle épreuve pratique après signature d'un nouveau contrat de formation et en fonction du calendrier qui lui est communiqué par l'autorité administrative.</p>
            <p style={{marginTop: '50px'}}><strong>Expliquons ce qui est écrit ci-dessus !</strong><br />Ce contrat est conclu pour une seule présentation pratique (incluse dans le Forfait de base). C'est à dire qu'à issue de la première présentation, si le résultat à l'examen du permis est défavorable et dans un objectif de réussite à l'examen suivant, <strong>un bilan général de 2h de conduite vous sera proposé</strong>.<br />Pour éviter un nouvel échec, le volume d'heures minimum pour une 2ème présentation ne pourra être inférieur à 4H pour les candidats en Conduite Accompagnée /Supervisée et 6h pour les formations classiques.<br />En cas d'accord, un avenant au présent contrat avec une nouvelle tarification sera signé entre les parties</p>
            <p style={{marginTop: '25px'}}><strong>En cas de refus : l'école se réserve le droit de ne pas Re-présenter l'élève puisque le contrat de base est signé pour une seule présentation. L'élève pourrait alors s'inscrire dans une autre école de conduite ou se présenter en candidat libre.</strong></p>
        </div>
        <div className="section">
            <h4>2-6 Accompagnement à l'épreuve pratique</h4>
            <p>Le jour de l'épreuve pratique, l'école de conduite assure l'accompagnement de l'élève sur le centre de l'examen et met à sa disposition le véhicule de l'école de conduite pendant toute la durée de l'épreuve.<br />Les frais d'accompagnement facturés à ce titre par l'école de conduite à l'élève correspondent à une heure de conduite, conformément aux dispositions de l'article R. 213-3-3 du code de la route.</p>
        </div>
        <div className="section">
            <h3>V - Obligations des parties</h3>
            <p>En cas d'annulation des leçons en formation pratique : Sauf cas de force majeure ou motif légitime dûment justifié à l'école de conduite, toute leçon non décommandée par l'élève au moins 48 heures à l'avance n'est pas remboursée. Si elle n'a pas été payée à l'avance, elle est considérée comme due. Sauf cas de force majeure ou motif légitime dûment justifié à l'élève, l'école de conduite s'engage à n'annuler aucune leçon moins de 48 heures à l'avance. À défaut la leçon doit être reportée et remboursée.</p>
            <h4>1- Démarches administratives :</h4>
            <p>En vertu du présent contrat, l'élève peut choisir de mandater l'école de conduite pour accomplir en son nom et place toutes les démarches et formalités nécessaires auprès de l'administration, en vue de l'enregistrement de son livret et de son dossier d'examen. L'élève est avisé par l'école de conduite de la liste des documents à fournir pour constituer son dossier d'examen. L'élève garde la possibilité de mettre fin au mandat à tout moment conformément à la loi, moyennent, le cas échéant, le paiement d'une somme compensant strictement les moyens engagés par l'école de conduite jusqu'à la résiliation. L’école s'engage à déposer le dossier, dès lors qu'il est complet et à fournir à l'élève son numéro d'enregistrement préfectoral harmonisé (NEPH). Le mandataire ne saurait être tenu responsable du retard pris par le mandant pour fournir les pièces justificatives ou de celui imputable à l'autorité compétence pour enregistrer ou valider la demande.</p>
            <h4>2- Inscription aux épreuves théorique et pratique du permis de conduire</h4>
            <p>
            </p><ul className="unordered-list" style={{marginBottom: 0}}>
            <li>- EPREUVE THEORIQUE (code): voir au-dessus</li>
            <li>- EPREUVE PRATIQUE: L'inscription à l'épreuve pratique est réalisée : Par l'école de conduite</li>
            </ul>Dans ce cas, en vertu du présent contrat, l'élève peut choisir de mandater l'école de conduite pour accomplir en son nom et place toutes les démarches et formalités nécessaires et de l'administration, en vue de la réservation des places d'examen. L'élève garde la possibilité de mettre fin au mandat à tout moment conformément à la loi, moyennent, le cas échéant, le paiement d'une somme compensant strictement les moyens engagés par l'école de conduite jusqu'à la résiliation.<br />L'école de conduite s'engage à inscrire l'élève aux épreuves pratiques du permis à une date en accord avec ce dernier.<p />
            <h4>3- Obligations de l'élève :</h4>
            <ul className="unordered-list">
            <li>- être âgé de 16 ans minimum ou 15 ans minimum en cas d'apprentissage anticipé de la conduite</li>
            <li>- être détenteur, notamment lors des leçons pratiques, des documents suivants : livret d'apprentissage conforme à la réglementation; formulaire de la demande de permis de conduire validée par le préfet du lieu de département de son dépôt</li>
            <li>- Respecter le règlement intérieur de l'école figurant en annexe, et dont il a pris connaissance</li>
            </ul>
            <h4>4- Obligations de l'école :</h4>
            <ul className="unordered-list">
            <li>- Délivrer à l'élève une formation théorique et pratique conforme aux programmes en vigueur</li>
            <li>- Présenter le candidat à l'épreuve ou aux épreuves en fournissant les moyens nécessaires sauf si le candidat souhaite se présenter directement</li>
            </ul>
        </div>

        <div className="initials"><input type="checkbox" className='input-checkbox' defaultChecked={data.fileData.studentContractData.initialsOptions.ifInitialed_page4} onChange={(e) => setInitialsPage4(e.target.checked)} /> <strong>Initiales:</strong>
            {initialsPage4 ? (
                <img className="image-initials" src={`http://localhost:3001/contract-signatures/studentInitials-${student.id}.png`} alt="paraphe de l'étudiant" />
            ) : (
                null
            )}
        </div>
        <div className="footer">Page 4 sur 5</div>
    </div>
  )
}
