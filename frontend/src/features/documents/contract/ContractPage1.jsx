import './ContractPages.css'
import { useFormContext } from 'react-hook-form'
import config from '../../../config'

export default function ContractPage1({ currentPageNumber, student }) {
    const { register, watch } = useFormContext()

    const pageDisplay = currentPageNumber === 1 ? 'block' : 'none'

    const initialsPage1 = watch('fileData.studentContractData.initialsOptions.ifInitialed_page1')

  return (
    <div className='wrapper' style={{ display: `${pageDisplay}` }}>
        <h1>
            <input type='text' style={{ marginRight: "auto", marginLeft: "auto", width: '100%', textAlign: "center", fontSize: '15px', fontWeight: 'bold' }} {...register('fileData.documentTitle')} />
        </h1>

        <h2 style={{ textAlign: "center", fontSize: '12px' }}>Ce contrat porte sur la formation suivante : ARRETE DU 6 JUIN 2020</h2>


        <div className="section">
        <p className="details">
            <span>Formation Traditionnelle B <input type="checkbox" className='input-checkbox' {...register('formationData.formationType.formationTradB')} /></span>
            <span>Apprentissage Anticipé de la conduite <input type="checkbox" className='input-checkbox' {...register('formationData.formationType.apprentAnticipConduite')} /></span>
            <span>Conduite supervisée <input type="checkbox" className='input-checkbox' {...register('formationData.formationType.conduiteSupervis')} /></span>
        </p>
        <p><strong>Entre :</strong></p>
        <p><strong>Ci-après désigné(e) « l'école de conduite »</strong></p>
        <p className="school-info">
            <strong>AUTO-ECOLE DES BORDS DE MARNE</strong><br />
            9, Grande Rue Charles de Gaulle 94360 BRY SUR MARNE<br />
            Tél/Fax : 01.49.83.93.91<br />
            Agrément Préfectoral : E0209403730 délivré le 17/06/2017 par la préfecture du Val de Marne<br />
            SIRET : 421 652 686 00013 RCS CRETEIL au CAPITAL 22403 Euros<br />
            N° déclaration d'activité (organisme de formation professionnelle) IDF : 11 94 05 65 594<br />
            Représenté par : MR Lounès HANNICHE Directeur Général
        </p>

        <p>Et :<br />
            Ci-après désigné « l'élève »</p>
        <p className="student-info">
            Nom : <input type='text' className='input-type-text' placeholder='nom' {...register('studentData.studentLastName')} /><span className="info">Prénom: <input type='text' className='input-type-text' placeholder='prénom' {...register('studentData.studentFirstName')} /></span><br />
            Date et lieu de naissance : <input type='text' className='input-type-text' style={{ width: '130px' }} placeholder='date de naissance' {...register('_composites.studentBirthDate')} /><br />
            Adresse : <input type='text' className='input-type-text' style={{ width: "50px" }} placeholder='numéro' {...register('studentData.studentAddress.number')} />, <input type="text" className='input-type-text' style={{ width: "380px" }} placeholder='rue' {...register('studentData.studentAddress.street')} />, <input type="text" className='input-type-text' placeholder='ville' {...register('studentData.studentAddress.town')} /><br />
            Tél : <input type="text" className='input-type-text' style={{ width: '130px' }} placeholder='téléphone' {...register('studentData.studentPhoneNumber')} /><span className="info info2">Courriel : <input type="text" className='input-type-text' style={{ width: '200px' }} placeholder='email' {...register('studentData.studentEmail')} /></span>
        </p>
        </div>

        <div className="section">
            <p>Évaluation Préalable de l'Élève: L'évaluation du niveau du candidat avant l'entrée en formation est obligatoire. En application de
                l'article L. 213-2 du Code de la route, le présent contrat est conclu après une évaluation préalable du candidat dans le véhicule ou
                dans les locaux de l'école de conduite, afin de déterminer le nombre prévisionnel d'heures de formation pratique et / ou théorique à
                la conduite nécessaire.</p>
            <p>
                L'évaluation de l'élève a été réalisée le : <input type="text" className='input-type-text' style={{ width: '70px' }} placeholder='date' {...register('_composites.evaluationDate')} /> par <input type="text" className='input-type-text' placeholder='nom du moniteur' {...register('evaluation.instructorFirstName')} /> avec pour moyen d'évaluation utilisé :
                <input type="text" className='input-type-text' style={{ width: '300px' }} placeholder='véhicule' {...register('evaluation.vehicleType')} />
            </p>
            <p>Elle a donné lieu à l'élaboration d'une fiche d'évaluation annexée au contrat. À l'issue de cette évaluation, le nombre
                d'heures prévisionnel de formation pratique est de <input type='text' className='input-type-text' style={{ width: '60px' }} {...register('formationData.formationDuration.drivingPractice')} /> heures.</p>
            <p>L’évaluation de départ permet à l'élève d'avoir une estimation du nombre d'heures de cours de conduite qu’il
                devra prendre pour obtenir son permis de conduire. Il s’agit d'une estimation donc approximative qui n'a qu'une vocation
                indicative, et non contractuelle, l'auto-école ne pouvant présumer ni de la date exacte à laquelle l'élève parviendra à passer son permis de
                conduire ni de la certitude de réussite.<br />Notons que notre établissement, comme tout établissement d’enseignement, a une obligation de
                moyen et non de résultat.</p>
        </div>

        <div className="section">
            <h2 style={{ textDecoration: 'underline', fontStyle: 'italic' }}>Il est convenu ce qui suit :</h2>
            <h3>I-Objet du Contrat</h3>
            <p>Conformément aux articles L. 213-2 et R. 213-3 du code de la route et à l'arrêté du 22 décembre 2009 relatif
                à l'apprentissage de la
                conduite des véhicules à moteur de la catégorie B, le présent contrat a pour objet d'établir les conditions
                et les modalités de
                l'enseignement, théorique et / ou pratique, de la conduite des véhicules à moteur de la catégorie B et de la
                sécurité routière</p>
        </div>

        <div className="section">
            <h3>II-Date de Prise d'Effet et Durée du Contrat</h3>
            <p>Le présent contrat entre en vigueur entre les parties au jour de sa signature pour une durée de 8 mois,
                jusqu’au <input type='text' className='input-type-text' style={{ width: '70px' }} {...register('_composites.formationMaxEndingDate')} />. Les tarifs, les prix détaillés et les termes du contrat ne sont pas révisables pendant toute la
                durée du contrat sauf modification réglementaire. Il est convenu que le contractant est dans l'obligation, pendant la
                durée du contrat de consommer la totalité des leçons de conduite de son forfait, soit <input type='text' className='input-type-text' style={{ width: '60px', paddingLeft: '3px' }} {...register('formationData.formationDuration.totalDrivingLearningDuration')} /> Heures de conduite.</p>
            <p><strong>Le contrat peut faire l'objet d'une prolongation de la part de l’élève pour un prix de 250 EUROS.</strong></p>
            <p>Au-delà des 12 mois, toutes leçons de conduite non consommées seront définitivement perdues et ne feront
                l'objet d’aucun remboursement. Si un événement exceptionnel survient, tel qu'un confinement, l'établissement prolongera le
                contrat gracieusement d'une durée égale à celle de l’événement.</p><br />
            <p><strong>Afin de respecter les modalités ci-dessus, nous vous conseillons de faire du code et vos heures de
                conduite simultanément.</strong> Cela vous permettra aussi de mettre en application votre apprentissage
                de code en conduite et réciproquement. Vous y gagnerez également en motivation.</p>
        </div>

        <div className="initials"><input type="checkbox" className='input-checkbox' {...register('fileData.studentContractData.initialsOptions.ifInitialed_page1')} /> <strong>Initiales:</strong>
            {initialsPage1 ? (
                <img className="image-initials" src={`${config.apiBaseUrlImages}/contract-signatures/studentInitials-${student.id}.png`} alt="paraphe de l'étudiant" />
            ) : (
                null
            )}
        </div>
        <div className="footer">Page 1 sur 5</div>
    </div>
  )
}
