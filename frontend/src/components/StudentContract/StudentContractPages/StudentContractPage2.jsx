import './StudentContractPages.css'
import dataStorage from './temporaryData'
import TableGrid from './images/table_grid.png'
import React, { useState, useEffect } from 'react'
import config from '../../../config'



export default function StudentContractPage2({ currentPageNumber, student, initialsPage2, setInitialsPage2, setTheoricalFormationDuration, setPracticalFormationDuration, setPracticalFormationIsChecked, setTypeFormation, setTotalFormationPrices, setGestionEleveObligatoire, setFormationPricesAdminPriceUnitTTC, setFormationPricesAdminNbHeuresOuUnits, setFormationPricesAdminMontantTTC, setFormationPricesAdminDemandeNumObligatoire, setFormationPricesAdminDemandeNumPriceUnitTTC, setFormationPricesAdminDemandeNumNbHeuresOuUnits, setFormationPricesAdminDemandeNumMontantTTC, setFormationPricesAdminDemandeTitreObligatoire, setFormationPricesAdminDemandeTitrePriceUnitTTC,     setFormationPricesAdminDemandeTitreNbHeuresOuUnits, setFormationPricesAdminDemandeTitreMontantTTC, setFormationPricesAdminLivretApprentObligatoire, setFormationPricesAdminLivretApprentPriceUnitTTC, setFormationPricesAdminLivretApprentNbHeuresOuUnits, setFormationPricesAdminLivretApprentMontantTTC,     setFormationPricesAdminFraisResObligatoire, setFormationPricesAdminFraisResPriceUnitTTC, setFormationPricesAdminFraisResNbHeuresOuUnits, setFormationPricesAdminFraisResMontantTTC, setFormationPricesAdminFraisCPFObligatoire, setFormationPricesAdminFraisCPFPriceUnitTTC, setFormationPricesAdminFraisCPFNbHeuresOuUnits, setFormationPricesAdminFraisCPFMontantTTC, setFormationPricesAdminReservRDVExamObligatoire, setFormationPricesAdminReservRDVExamPriceUnitTTC, setFormationPricesAdminReservRDVExamNbHeuresOuUnits, setFormationPricesAdminReservRDVExamMontantTTC, setFormationPricesTheoryRDVPedagoObligatoire, setFormationPricesTheoryRDVPedagoPriceUnitTTC, setFormationPricesTheoryRDVPedagoNbHeuresOuUnits, setFormationPricesTheoryRDVPedagoMontantTTC, setFormationPricesTheoryCtrlConnaisancesObligatoire, setFormationPricesTheoryCtrlConnaisancesPriceUnitTTC, setFormationPricesTheoryCtrlConnaisancesNbHeuresOuUnits, setFormationPricesTheoryCtrlConnaisancesMontantTTC, setFormationPricesTheoryForfaitTheoObligatoire, setFormationPricesTheoryForfaitTheoPriceUnitTTC, setFormationPricesTheoryForfaitTheoNbHeuresOuUnits, setFormationPricesTheoryForfaitTheoMontantTTC, setFormationPricesTheoryVerifBookObligatoire, setFormationPricesTheoryVerifBookPriceUnitTTC, setFormationPricesTheoryVerifBookNbHeuresOuUnits, setFormationPricesTheoryVerifBookMontantTTC, setFormationPricesTheoryELearningAccessObligatoire, setFormationPricesTheoryELearningAccessPriceUnitTTC, setFormationPricesTheoryELearningAccessNbHeuresOuUnits, setFormationPricesTheoryELearningAccessMontantTTC, setFormationPricesPracticeRDVPrevObligatoire, setFormationPricesPracticeRDVPrevPriceUnitTTC, setFormationPricesPracticeRDVPrevNbHeuresOuUnits, setFormationPricesPracticeRDVPrevMontantTTC, setFormationPricesPracticeRDVPedagoObligatoire, setFormationPricesPracticeRDVPedagoPriceUnitTTC, setFormationPricesPracticeRDVPedagoNbHeuresOuUnits, setFormationPricesPracticeRDVPedagoMontantTTC, setFormationPricesPracticeConduiteBMObligatoire, setFormationPricesPracticeConduiteBMPriceUnitTTC, setFormationPricesPracticeConduiteBMNbHeuresOuUnits, setFormationPricesPracticeConduiteBMMontantTTC, setFormationPricesPracticeConduiteBVAObligatoire, setFormationPricesPracticeConduiteBVAPriceUnitTTC, setFormationPricesPracticeConduiteBVANbHeuresOuUnits, setFormationPricesPracticeConduiteBVAMontantTTC, setFormationPricesPracticeAccompExamObligatoire, setFormationPricesPracticeAccompExamPriceUnitTTC, setFormationPricesPracticeAccompExamNbHeuresOuUnits, setFormationPricesPracticeAccompExamMontantTTC, setFormationPricesPracticeForfaitPratObligatoire, setFormationPricesPracticeForfaitPratPriceUnitTTC, setFormationPricesPracticeForfaitPratNbHeuresOuUnits, setFormationPricesPracticeForfaitPratMontantTTC, setEvalPrealable, setEvalObligatory, setEvalPrixUnitTTC, setEvalNbHeuresOuUnits, setEvalMontantTTC, setFormationPriceOfCodeExam, setTheoricalFormationIsChecked }) {

    // Import des données par défaut
    const data = dataStorage(student)

    // Gestion de la pagination
    const [pageDisplay, setPageDisplay] = useState('block')

    useEffect(() => {
        if (currentPageNumber === 2) {
            setPageDisplay('block')
        } else {
            setPageDisplay('none')
        }
    }, [pageDisplay, currentPageNumber])



  return (
    <div className='wrapper' style={{ display: `${pageDisplay}` }}>

        <p><strong>Le présent contrat porte sur une durée de : 8 mois</strong></p>

        <div className="section">
            <p>Nombre d'heures de formation et d'enseignement:</p>
            <p style={{ display: 'inline', paddingRight: '50px', width: '100%' }}>
                <input
                    type="checkbox"
                    defaultChecked={data.formationData.formationType.theoricalFormation.isChecked}
                    className='input-checkbox'
                    style={{ marginRight: '10px', width: '10px', height: '10px' }}
                    onChange={(e) => setTheoricalFormationIsChecked(e.target.checked)}
                />
                Formation théorique : nombre de leçon(s) de formation théorique ou durée de la formation théorique : <input type="text" className='input-type-text' style={{ width: '70px' }} defaultValue={data.formationData.formationType.theoricalFormation.duration} onChange={(e) => setTheoricalFormationDuration(e.target.value)} />
            </p>
            <br />
            <p style={{ display: 'inline' }}>
                <input
                    type="checkbox"
                    defaultChecked={data.formationData.formationType.practicalFormation.isChecked}
                    className='input-checkbox'
                    style={{ marginRight: '10px', width: '10px', height: '10px' }}
                    onChange={(e) => setPracticalFormationIsChecked(e.target.checked)}
                />
                <span>Nombre de leçon(s) de formation pratique : <input type="text" className='input-type-text' style={{ width: '70px' }} defaultValue={data.formationData.formationType.practicalFormation.duration} onChange={(e) => setPracticalFormationDuration(e.target.value)} /></span>
            </p>
        </div>

        <div className="section">
            <div className='div-table-prices'>
                <img src={TableGrid} alt="Grille des tarifs de la formation" className='table-grid' />
                <span style={{ top: '4px', left: '95px' }}><strong>PRESTATION</strong></span>
                <span style={{ top: '4px', left: '360px' }}><strong>Obligatoire</strong></span>
                <span style={{ top: '4px', left: '433px' }}><strong>Prix <br />Unitaire <br />(€) TTC</strong></span>
                <span style={{ top: '4px', left: '508px' }}><strong>Nombre <br />d'heures/Unités</strong></span>
                <span style={{ top: '4px', left: '618px' }}><strong>Montant <br />(€) TTC</strong></span>

                <span style={{ top: '54px', left: '95px' }}>Évaluation Préalable</span>
                <span style={{ top: '76px', left: '6px' }}>Frais <br />Administratifs</span>
                <span style={{ top: '76px', left: '95px' }}>Gestion de l’élève (dossier, rdv, planning)</span>
                <span style={{ top: '99px', left: '95px' }}>Demande de numéro NEPH sur ANTS</span>
                <span style={{ top: '121px', left: '95px' }}>Demande Fabrication du Titre (Réussite)</span>
                <span style={{ top: '143px', left: '95px' }}>Livret d'apprentissage</span>
                <span style={{ top: '165px', left: '95px' }}>Frais de résiliation (uniquement lorsque l'élève <br />n'a pas de motif légitime et avant le début de la <br />formation pratique)</span>
                <span style={{ top: '216px', left: '95px' }}>Frais de Gestion Compte CPF</span>
                <span style={{ top: '238px', left: '95px' }}>Réservation d'une place d'Examen sur RDV <br />PERMIS</span>

                <span style={{ top: '275px', left: '6px' }}>Théorie</span>
                <span style={{ top: '275px', left: '95px' }}>Rendez-vous Pédagogique (AAC uniquement)</span>
                <span style={{ top: '310px', left: '95px' }}>Contrôles des connaissance (Examen Blanc)</span>
                <span style={{ top: '332px', left: '95px' }}>Forfait de Formation Théorique</span>
                <span style={{ top: '355px', left: '95px' }}>Livre de Vérification</span>
                <span style={{ top: '377px', left: '95px' }}>Accès e-learning (code en ligne) Pack web</span>

                <span style={{ top: '400px', left: '6px' }}>Pratique</span>
                <span style={{ top: '400px', left: '95px' }}>Rendez-vous Préalable AAC ou Supervisée</span>
                <span style={{ top: '422px', left: '95px' }}>RDV Pédagogique (Obligatoire pour AAC)</span>
                <span style={{ top: '458px', left: '95px' }}>Leçon de Conduite Individuelle BM (*)</span>
                <span style={{ top: '493px', left: '95px' }}>Leçon de Conduite Individuelle BVA (**)</span>
                <span style={{ top: '515px', left: '95px' }}>Accompagnement à l'Examen (Tarif ne dépassant <br />pas celui d'1h de conduite)</span>
                <span style={{ top: '551px', left: '95px' }}>Forfait de Formation Pratique</span>

                <input type="text" className='input-type-text' style={{ width: '50px', top: '52px', left: '360px' }} defaultValue={data.formationData.formationPrices.EvaluationPrealable.Obligatoire} onChange={(e) => setEvalObligatory(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '52px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.EvaluationPrealable.PrixUnitaireTTC}`} onChange={(e) => setEvalPrixUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '52px', left: '507px' }} defaultValue={data.formationData.formationPrices.EvaluationPrealable.NbHeures_ou_Units} onChange={(e) => setEvalNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '52px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.EvaluationPrealable.MontantTTC}`} onChange={(e) => setEvalMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '75px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw001.Obligatoire} onChange={(e) => setGestionEleveObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '75px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw001.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '75px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw001.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '75px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw001.MontantTTC}`} onChange={(e) => setFormationPricesAdminMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '97px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw002.Obligatoire} onChange={(e) => setFormationPricesAdminDemandeNumObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '97px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw002.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminDemandeNumPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '97px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw002.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminDemandeNumNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '97px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw002.MontantTTC}`} onChange={(e) => setFormationPricesAdminDemandeNumMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '119px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw003.Obligatoire} onChange={(e) => setFormationPricesAdminDemandeTitreObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '119px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw003.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminDemandeTitrePriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '119px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw003.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminDemandeTitreNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '119px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw003.MontantTTC}`} onChange={(e) => setFormationPricesAdminDemandeTitreMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '142px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw004.Obligatoire} onChange={(e) => setFormationPricesAdminLivretApprentObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '142px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw004.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminLivretApprentPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '142px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw004.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminLivretApprentNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '142px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw004.MontantTTC}`} onChange={(e) => setFormationPricesAdminLivretApprentMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '165px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw005.Obligatoire} onChange={(e) => setFormationPricesAdminFraisResObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '165px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw005.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminFraisResPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '165px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw005.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminFraisResNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '165px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw005.MontantTTC}`} onChange={(e) => setFormationPricesAdminFraisResMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '214px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw006.Obligatoire} onChange={(e) => setFormationPricesAdminFraisCPFObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '214px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw006.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminFraisCPFPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '214px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw006.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminFraisCPFNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '214px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw006.MontantTTC}`} onChange={(e) => setFormationPricesAdminFraisCPFMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '237px', left: '360px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw007.Obligatoire} onChange={(e) => setFormationPricesAdminReservRDVExamObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '237px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw007.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesAdminReservRDVExamPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '237px', left: '507px' }} defaultValue={data.formationData.formationPrices.Frais_Administratifs.raw007.NbHeures_ou_Units} onChange={(e) => setFormationPricesAdminReservRDVExamNbHeuresOuUnits(e.target.value)} />
                <textarea className='input-type-text' style={{ width: '61px', height: '32px', top: '236px', left: '616px' }} defaultValue={`${data.formationData.formationPrices.Frais_Administratifs.raw007.MontantTTC}`} onChange={(e) => setFormationPricesAdminReservRDVExamMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '273px', left: '360px' }} defaultValue={data.formationData.formationPrices.Theorie.raw001.Obligatoire} onChange={(e) => setFormationPricesTheoryRDVPedagoObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '273px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw001.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesTheoryRDVPedagoPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '273px', left: '507px' }} defaultValue={data.formationData.formationPrices.Theorie.raw001.NbHeures_ou_Units} onChange={(e) => setFormationPricesTheoryRDVPedagoNbHeuresOuUnits(e.target.value)} />
                <textarea className='input-type-text' style={{ width: '61px', height: '32px', top: '272px', left: '616px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw001.MontantTTC}`} onChange={(e) => setFormationPricesTheoryRDVPedagoMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '308px', left: '360px' }} defaultValue={data.formationData.formationPrices.Theorie.raw002.Obligatoire} onChange={(e) => setFormationPricesTheoryCtrlConnaisancesObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '308px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw002.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesTheoryCtrlConnaisancesPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '308px', left: '507px' }} defaultValue={data.formationData.formationPrices.Theorie.raw002.NbHeures_ou_Units} onChange={(e) => setFormationPricesTheoryCtrlConnaisancesNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '308px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw002.MontantTTC}`} onChange={(e) => setFormationPricesTheoryCtrlConnaisancesMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '331px', left: '360px' }} defaultValue={data.formationData.formationPrices.Theorie.raw003.Obligatoire} onChange={(e) => setFormationPricesTheoryForfaitTheoObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '331px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw003.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesTheoryForfaitTheoPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '331px', left: '507px' }} defaultValue={data.formationData.formationPrices.Theorie.raw003.NbHeures_ou_Units} onChange={(e) => setFormationPricesTheoryForfaitTheoNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '331px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw003.MontantTTC}`} onChange={(e) => setFormationPricesTheoryForfaitTheoMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '353px', left: '360px' }} defaultValue={data.formationData.formationPrices.Theorie.raw004.Obligatoire} onChange={(e) => setFormationPricesTheoryVerifBookObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '353px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw004.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesTheoryVerifBookPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '353px', left: '507px' }} defaultValue={data.formationData.formationPrices.Theorie.raw004.NbHeures_ou_Units} onChange={(e) => setFormationPricesTheoryVerifBookNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '353px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw004.MontantTTC}`} onChange={(e) => setFormationPricesTheoryVerifBookMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '376px', left: '360px' }} defaultValue={data.formationData.formationPrices.Theorie.raw005.Obligatoire} onChange={(e) => setFormationPricesTheoryELearningAccessObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '376px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw005.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesTheoryELearningAccessPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '376px', left: '507px' }} defaultValue={data.formationData.formationPrices.Theorie.raw005.NbHeures_ou_Units} onChange={(e) => setFormationPricesTheoryELearningAccessNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '376px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Theorie.raw005.MontantTTC}`} onChange={(e) => setFormationPricesTheoryELearningAccessMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '398px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw001.Obligatoire} onChange={(e) => setFormationPricesPracticeRDVPrevObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '398px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw001.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeRDVPrevPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '398px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw001.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeRDVPrevNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '398px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw001.MontantTTC}`} onChange={(e) => setFormationPricesPracticeRDVPrevMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '420px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw002.Obligatoire} onChange={(e) => setFormationPricesPracticeRDVPedagoObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '420px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw002.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeRDVPedagoPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '420px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw002.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeRDVPedagoNbHeuresOuUnits(e.target.value)} />
                <textarea className='input-type-text' style={{ width: '61px', height: '32px', top: '420px', left: '616px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw002.MontantTTC}`} onChange={(e) => setFormationPricesPracticeRDVPedagoMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '456px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw003.Obligatoire} onChange={(e) => setFormationPricesPracticeConduiteBMObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '456px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw003.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeConduiteBMPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '456px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw003.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeConduiteBMNbHeuresOuUnits(e.target.value)} />
                <textarea className='input-type-text' style={{ width: '61px', height: '32px', top: '456px', left: '616px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw003.MontantTTC}`} onChange={(e) => setFormationPricesPracticeConduiteBMMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '492px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw004.Obligatoire} onChange={(e) => setFormationPricesPracticeConduiteBVAObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '492px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw004.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeConduiteBVAPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '492px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw004.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeConduiteBVANbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '492px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw004.MontantTTC}`} onChange={(e) => setFormationPricesPracticeConduiteBVAMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '514px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw005.Obligatoire} onChange={(e) => setFormationPricesPracticeAccompExamObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '514px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw005.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeAccompExamPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '514px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw005.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeAccompExamNbHeuresOuUnits(e.target.value)} />
                <textarea className='input-type-text' style={{ width: '61px', height: '32px', top: '514px', left: '616px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw005.MontantTTC}`} onChange={(e) => setFormationPricesPracticeAccompExamMontantTTC(e.target.value)} />

                <input type="text" className='input-type-text' style={{ width: '50px', top: '550px', left: '360px' }} defaultValue={data.formationData.formationPrices.Pratique.raw006.Obligatoire} onChange={(e) => setFormationPricesPracticeForfaitPratObligatoire(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '66px', top: '550px', left: '432px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw006.PrixUnitaireTTC}`} onChange={(e) => setFormationPricesPracticeForfaitPratPriceUnitTTC(`${e.target.value}`)} />
                <input type="text" className='input-type-text' style={{ width: '100px', top: '550px', left: '507px' }} defaultValue={data.formationData.formationPrices.Pratique.raw006.NbHeures_ou_Units} onChange={(e) => setFormationPricesPracticeForfaitPratNbHeuresOuUnits(e.target.value)} />
                <input type="text" className='input-type-text' style={{ width: '56px', top: '550px', left: '617px' }} defaultValue={`${data.formationData.formationPrices.Pratique.raw006.MontantTTC}`} onChange={(e) => setFormationPricesPracticeForfaitPratMontantTTC(e.target.value)} />

                {/* TOTAL */}
                <span style={{ top: '574px', left: '6px' }}><strong>TOTAL (€)</strong></span>
                <span style={{ top: '574px', left: '95px' }}><strong>TYPE DE FORMATION</strong></span>
                <input type="text" className='input-type-text' style={{ fontWeight: 'bold', width: '252px', top: '574px', left: '360px' }} defaultValue={data.formationData.formationPrices.total.TypeFormation} onChange={(e) => setTypeFormation(e.target.value)} />
                <input type='text' className='input-type-text' style={{ fontWeight: 'bold', width: '56px', top: '574px', left: '618px' }} defaultValue={`${data.formationData.formationPrices.total.MontantTTC}`} onChange={(e) => setTotalFormationPrices(e.target.value)} />

            </div>
            <p>*BM : Boite de vitesses Manuelle – **BVA : Boite de vitesses Automatique</p>
        </div>

        <div className="section">
            <p><strong>Au titre du présent contrat, la leçon d'une heure de conduite individuelle comprend : le temps
                nécessaire à l'accueil, à la
                détermination de l'objectif (5 min), à la conduite (45 minutes environ), à l'évaluation et au bilan de
                la leçon (5 min).
                Soit 55 minutes.</strong>
            </p>
            <p><strong>EXAMEN THEORIQUE (CODE DE LA ROUTE) :</strong><br />
                Le montant de l'inscription à l'examen de l'épreuve
                théorique (code) est fixé par arrêté du ministère des finances: <input type='text' className='input-type-text' style={{ width: '70px' }} defaultValue={data.formationData.formationPrices.priceOfCodeExam} onChange={(e) => setFormationPriceOfCodeExam(e.target.value)} />.
                <br />Cette prestation est exclue de tous nos forfaits et prestations. L'élève réserve lui-même sa place et se déplace tout seul.
            </p>
            <p><strong>Les tarifs ci-dessus sont inchangés pendant la durée du contrat (8 mois) sauf modification
                    législative ou réglementaire.</strong>
            </p>
        </div>

        <div className="section" style={{ marginTop: '20px' }}>
            <h3>IV-Programme et déroulement de la formation</h3>
            <p>L'école de conduite s'engage à délivrer à l'élève une formation théorique et pratique conforme aux
                dispositions législatives et réglementaires en vigueur.
            </p>
        </div>

        <div className="initials"><input type="checkbox" className='input-checkbox' defaultChecked={data.fileData.studentContractData.initialsOptions.ifInitialed_page2} onChange={(e) => setInitialsPage2(e.target.checked)} /> <strong>Initiales:</strong>
            {initialsPage2 ? (
                <img className="image-initials" src={`${config.apiBaseUrlImages}/contract-signatures/studentInitials-${student.id}.png`} alt="paraphe de l'étudiant" />
            ) : (
                null
            )}
        </div>
        <div className="footer">Page 2 sur 5</div>
    </div>
    )
}
