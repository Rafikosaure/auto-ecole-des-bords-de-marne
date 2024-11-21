import './StudentContractPages.css'
import dataStorage from './temporaryData'
import React, { useState, useEffect } from 'react'




export default function StudentContractPage5({ currentPageNumber, datetime, student, initialsPage5, setInitialsPage5, studentSignature, setStudentSignature, legalRepresent, setLegalRepresent, entrepriseSignatureAndStamp, setEntrepriseSignatureAndStamp }) {

    // Import des données par défaut
    const data = dataStorage(student)

    // Gestion de la pagination
    const [pageDisplay, setPageDisplay] = useState('block')

    useEffect(() => {
        if (currentPageNumber === 5) {
            setPageDisplay('block')
        } else {
            setPageDisplay('none')
        }
    }, [pageDisplay, currentPageNumber])



  return (
    <div className='wrapper' style={{ display: `${pageDisplay}` }}>
        
        <div className="section">
        <h3>5- Modalités de paiement</h3>
        <p>Le paiement des prestations s'effectue par :</p>
        <table className="table" cellPadding={0}>
            <tbody><tr>
                <td style={{width: '100px', height: '30px'}}><div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationPrices.paymentMethod.creditCard} /><label style={{ marginLeft: '2px' }}>Carte bancaire</label></div></td>
                <td style={{width: '100px', height: '30px'}}><div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationPrices.paymentMethod.cheque} /><label style={{ marginLeft: '2px' }}>Chèque</label></div></td>
                <td style={{width: '100px', height: '30px'}}><div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationPrices.paymentMethod.bankTransfer} /><label style={{ marginLeft: '2px' }}>Virement</label></div></td>
                <td style={{width: '100px', height: '30px'}}><div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationPrices.paymentMethod.cash} /><label style={{ marginLeft: '2px' }}>Espèce</label></div></td>
                <td style={{width: '100px', height: '30px'}}><div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' defaultChecked={data.formationData.formationPrices.paymentMethod.SEPA_DirectDebit} /><label style={{ marginLeft: '2px' }}>Prélèvement SEPA</label></div></td>
            </tr>
            </tbody>
        </table>
        <p style={{ marginTop: '5px' }}>Le paiement pourra s'effectuer selon l'une des modalités suivantes :</p>
        <div className="checkboxes" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px'}}>
            <div className="checkbox-section-element"><input type="checkbox" className="input-shaping input-checkbox" defaultChecked={data.formationData.formationPrices.paymentOptions.withDepositAndBalance.isChecked} /><label style={{ marginLeft: '2px' }}>1 - avec des arrhes et le solde d'un montant de <input type="text" className='input-type-text' style={{ width: '50px' }} defaultValue={data.formationData.formationPrices.total.MontantTTC} /> € devant être réglé le <input type="text" className='input-type-text' style={{ width: '80px' }} defaultValue={`${data.formationData.formationPrices.paymentOptions.withDepositAndBalance.paymentDate.paymentDay}/${data.formationData.formationPrices.paymentOptions.withDepositAndBalance.paymentDate.paymentMonth}/${data.formationData.formationPrices.paymentOptions.withDepositAndBalance.paymentDate.paymentYear}`} /></label></div>
            <div className="checkbox-section-element"><input type="checkbox" className="input-shaping input-checkbox" defaultChecked={data.formationData.formationPrices.paymentOptions.one_offCashPayment} /><label style={{ marginLeft: '2px' }}>2 - paiement comptant en un seul versement</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className="input-shaping input-checkbox" defaultChecked={data.formationData.formationPrices.paymentOptions.pay_as_you_go_afterEachService} /><label style={{ marginLeft: '2px' }}>3 - à l'unité, après chaque prestation</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className="input-shaping input-checkbox" defaultChecked={data.formationData.formationPrices.paymentOptions.three_instalments_FreeOfCharge} /><label style={{ marginLeft: '2px' }}>4 - échelonné en trois versements sans frais</label></div>
            <div className="checkbox-section-element"><input type="checkbox" className="input-shaping input-checkbox" defaultChecked={data.formationData.formationPrices.paymentOptions.five_instalments_FreeOfCharge} /><label style={{ marginLeft: '2px' }}>5 - échelonné en cinq versements sans frais.</label></div>
        </div>
        <p style={{ marginTop: '5px' }}>Si l'option 4 ou 5 est retenue, les versements s'effectueront aux échéances et selon les montants suivants : -1er Versement à l’inscription – 2 -ème versement le mois suivant – 3 -ème versement le mois d’après et ainsi de suite.</p>
        <p>L'école de conduite délivre une note à l'élève avant le paiement de la prestation. Pour les prestations forfaitaires, la note indique la liste détaillée des prestations comprises dans le forfait. Conformément à l'article 1 de l'arrêté du 3 octobre 1983, toute prestation dont le prix est égal ou supérieur à 25 € TTC fera l'objet de la délivrance d'une note. Elle peut être remise sur simple demande de l'élève pour des prestations dont le prix est inférieur à 25 €.</p>
        <p style={{marginBottom: 0}}>En cas de défaillance de l'école de conduite, celle-ci a souscrit à un dispositif de garantie financière :</p>
        
        <div className="checkbox-section-element"><input type="checkbox" className='input-checkbox' style={{ marginRight: '2px' }} defaultChecked={data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.isChecked} />Oui<input type="checkbox" className='input-checkbox' style={{ marginLeft: '20px', marginRight: '2px' }} defaultChecked={data.formationData.formationPrices.failOfTheDrivingSchool.noOptionIsChecked} />Non, car l’auto-école des bords de marne dispose de fond propre supérieurs à 300 000 euros.</div>
            <p style={{marginTop: 0, marginBottom: '15px'}}>Nom et adresse de l'organisme garant : <input type='text' className='input-type-text' style={{ width: '320px' }} defaultValue={data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.garantEntity.name} placeholder="Nom de l'organisme" /><br /><input type="text" className="input-type-text" style={{ width: '40px' }} defaultValue={data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.garantEntity.address.number} placeholder="N°" /> <input type="text" className="input-type-text" style={{ width: '450px' }} defaultValue={data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.garantEntity.address.street} placeholder="Rue" /> <input type="text" className="input-type-text" style={{ width: '150px' }} defaultValue={data.formationData.formationPrices.failOfTheDrivingSchool.yesOption.garantEntity.address.town} placeholder="Ville" />
            </p>
        </div>
        
        <div className="section">
        <h3>VII - Conditions de rétractation ou de résiliation</h3>
        <h4>1- Rétractation</h4>
        <p>Dans le cadre d'un contrat conclu à distance tel que défini à l'article L. 221-1 du code de la consommation, l'élève bénéficie, à compter de la date de la signature du présent contrat, d'un droit de rétraction de 14 jours conformément à l'article L. 221-18 du même code.<br />Dans l'hypothèse où l'élève souhaite exercer ce droit, il adresse sa décision de se rétracter à l'école de conduite soit par lettre recommandée ou envoi recommandé électronique avec avis de réception à l'adresse postale de l'école de conduite ou par courriel à l'adresse électronique de l'école de conduite.<br />Le formulaire de rétractation figurant en annexe peut être utilisé par l'élève.<br />Si l'élève a expressément demandé à débuter sa formation avant l'expiration du délai de rétractation, l'école de conduite lui facturera le montant des prestations réalisées jusqu'à la notification par l'élève de sa décision de se rétracter.<br />En cas de prestations déjà réglées par l'élève dans le cadre d'un forfait, le remboursement s'effectue au prorata des prestations déjà réalisées. En cas de prestations non encore facturées à l'élève dans le cadre d'un forfait, la facturation s'effectue au prorata des prestations déjà réalisées.</p>
        <h4>2- Résiliation</h4>
        <p>L'élève peut résilier le présent contrat à tout moment par lettre recommandée ou envoi recommandé électronique avec avis de réception à l'adresse postale de l'école de conduite ou par courriel à l'adresse électronique de l'école de conduite, moyennant paiement des prestations déjà réalisées.<br />La résiliation prend effet 15 jours à compter de la date de première présentation de la lettre recommandée ou de l'envoi recommandé électronique. Ce délai de préavis ne s'applique pas en cas de motif légitime.<br />L'école de conduite peut résilier le présent contrat en cas de violence avérée, de mise en danger d'autrui, d'incivilités ou de manquements répétés à l'une de ses obligations issues du présent contrat (hypothèse : retards de paiement non régularisés), après mise en demeure spécifiant le motif de la résiliation notifiée par lettre recommandée ou de l'envoi recommandé électronique avec avis de réception. La résiliation prend effet 15 jours à compter de la date de première présentation de la lettre recommandée ou de l'envoi recommandé électronique. L'élève peut contester la décision de l'école de conduite. A défaut de solution, il peut recourir à une procédure de médiation.<br />La résiliation du présent contrat avant son terme entraîne l'apurement définitif des comptes. L'école de conduite facturera le montant des prestations réalisées jusqu'à la date de la prise d'effet de la résiliation. En cas de prestations déjà réglées par l'élève dans le cadre d'un forfait, le remboursement s'effectue au prorata des prestations déjà réalisées. En cas de prestations non encore facturées à l'élève dans le cadre d'un forfait, la facturation s'effectue au prorata des prestations déjà réalisées.</p>
        </div>
        
        <div className="signature-section" style={{margin: 0}}>
        <p style={{marginTop: '0px'}}>Fait en 2 exemplaires, à BRY-SUR-MARNE, le {datetime}</p>
        <p style={{marginTop: '0px', marginBottom: 0}}>Signatures (avec mention lu et approuvé et avoir pris un exemplaire)</p>
        <div style={{margin: 0, display: 'flex', flex: 1}}><p style={{textAlign: 'center', width: '120px', marginBottom: 0}}>Élève:<input type="checkbox" className='input-checkbox' style={{ marginLeft: '4px' }} defaultChecked={data.fileData.studentContractData.isReadAndApproved} onChange={(e) => setStudentSignature(e.target.checked)} /></p><p style={{textAlign: 'center', marginBottom: 0}}>Représentant légal (élève mineur):<input type="checkbox" className='input-checkbox' style={{ marginLeft: '4px' }} defaultChecked={false} onChange={(e) => setLegalRepresent(e.target.checked)} />
        </p><p style={{textAlign: 'center', marginBottom: 0}}>Cachet et signature de l'établissement:<input type="checkbox" className='input-checkbox' style={{ marginLeft: '4px' }} defaultChecked={false} onChange={(e) => setEntrepriseSignatureAndStamp(e.target.checked)} /></p></div>
        
        <div>
            {studentSignature && (
                <span className="student-signature-section">LU ET APPROUVÉ <img className="image-signature" src={`http://localhost:3001/contract-signatures/studentSignature-${student.id}.png`} alt="signature de l'élève" /></span>
            )}
            {legalRepresent && (
                <img className="image-signature legal-representative-signature-section" src={`http://localhost:3001/contract-signatures/legalRepresentSignature-${student.id}.png`} alt="signature du représentant légal" />
            )}
            {entrepriseSignatureAndStamp && (
                <img className="enterprise-signature-section" src={`http://localhost:3001/contract-signatures/enterpriseSignature.png`} alt="cachet & signature de l'établissement" />
            )}
            </div>
        </div>

        <div className="initials"><input type="checkbox" className='input-checkbox' defaultChecked={data.fileData.studentContractData.initialsOptions.ifInitialed_page5} onChange={(e) => setInitialsPage5(e.target.checked)} /> <strong>Initiales:</strong>
            {initialsPage5 ? (
                <img className="image-initials" src={`http://localhost:3001/contract-signatures/studentInitials-${student.id}.png`} alt="paraphe de l'étudiant" />
            ) : (
                null
            )}
        </div>
        <div className="footer">Page 5 sur 5</div>
    </div>
  )
}
