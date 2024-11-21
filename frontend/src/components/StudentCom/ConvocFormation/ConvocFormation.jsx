import React from 'react';
import { useState, useEffect } from 'react';
import './ConvocFormation.css';
import data from './temporaryData'


export default function ConvocationFormation({ student, setFormFetchData }) {

  // Date de début de formation
  const studentFormationStartDate = new Date(student.formationStart).toLocaleDateString("fr-FR")
  
  // Date désirée de fin de formation
  const studentFormationEndingDesiredDate = new Date(student.formationDesiredEnd).toLocaleDateString("fr-FR")

  const [documentTitle, setDocumentTitle] = useState(data.fileData.documentTitle)
  const [studentFirstName, setStudentFirstName] = useState(student.firstName)
  const [studentLastName, setStudentLastName] = useState(student.lastName)
  const [formationTitle, setFormationTitle] = useState(data.formationTitle)

  const [formationStartDate, setFormationStartDate] = useState(studentFormationStartDate)
  const [formationStartDay, setFormationStartDay] = useState(studentFormationStartDate.split('/')[0])
  const [formationStartMonth, setFormationStartMonth] = useState(studentFormationStartDate.split('/')[1])
  const [formationStartYear, setFormationStartYear] = useState(studentFormationStartDate.split('/')[2])

  const [formationEndingDesiredDate, setFormationEndingDesiredDate] = useState(studentFormationEndingDesiredDate)
  const [formationEndingDesiredDay, setFormationEndingDesiredDay] = useState(studentFormationEndingDesiredDate.split('/')[0])
  const [formationEndingDesiredMonth, setFormationEndingDesiredMonth] = useState(studentFormationEndingDesiredDate.split('/')[1])
  const [formationEndingDesiredYear, setFormationEndingDesiredYear] = useState(studentFormationEndingDesiredDate.split('/')[2])
  const [formationMaxEndingDate, setFormationMaxEndingDate] = useState(`${data.formationMaxEndingDate.day}/${data.formationMaxEndingDate.month}/${data.formationMaxEndingDate.year}`)
  const [formationMaxEndingDay, setFormationMaxEndingDay] = useState(data.formationMaxEndingDate.day)
  const [formationMaxEndingMonth, setFormationMaxEndingMonth] = useState(data.formationMaxEndingDate.month)
  const [formationMaxEndingYear, setFormationMaxEndingYear] = useState(data.formationMaxEndingDate.year)
  const [drivingPracticeDuration, setDrivingPracticeDuration] = useState(data.formationDuration.drivingPractice)



  useEffect(() => {

    const fetchData = {
      fileData: {
        documentType: 'convocation_formation',
        documentTitle: documentTitle
      },
      emailType: "convocation_formation",
      studentFirstName: studentFirstName,
      studentLastName: studentLastName,
      studentEmail: student.email,
      formationTitle: formationTitle,
      formationStartDate: {
        day: formationStartDay,
        month: formationStartMonth,
        year: formationStartYear
      },
      formationEndingDesiredDate: {
        day: formationEndingDesiredDay,
        month: formationEndingDesiredMonth,
        year: formationEndingDesiredYear
      },
      formationMaxEndingDate: {
        day: formationMaxEndingDay,
        month: formationMaxEndingMonth,
        year: formationMaxEndingYear
      },
      formationDuration: {
        drivingPractice: drivingPracticeDuration
      }
    }

    if (validateDate(formationStartDate) && validateDate(formationEndingDesiredDate) && validateDate(formationMaxEndingDate)) {
    } else {
      // console.log("Invalid dates!")
    }
    setFormFetchData(fetchData)
    // console.log('Données côté formulaire :', fetchData)
    
  }, [formationStartDate, student, documentTitle, drivingPracticeDuration, formationEndingDesiredDay, formationEndingDesiredMonth, formationEndingDesiredYear, formationMaxEndingDay, formationMaxEndingMonth, formationMaxEndingYear, formationStartDay, formationStartMonth, formationStartYear, formationTitle, studentFirstName, studentLastName, formationEndingDesiredDate, formationMaxEndingDate, setFormFetchData])


  function validateDate(dateStr) {
    const dateArr = dateStr.split('/');
    const newDate = new Date(dateArr[2], parseInt(dateArr[1],10)-1, parseInt(dateArr[0],10));
    return newDate.getMonth() === parseInt(dateArr[1],10)-1;
  }


  return (
    <div style={{ margin: 0 }} id='wrapper'>
      <div id="p1" style={{ overflow: 'hidden', position: 'relative', backgroundColor: 'white' }}>
        
      <div id="pg1Overlay" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1, backgroundColor: 'rgba(0,0,0,0)' }}></div>
        
        <div id="pg1" style={{ WebkitUserSelect: 'none' }}>
          <object width="909" height="1286" 
          // data="1/1.svg"
          type="image/svg+xml" id="pdf1" style={{ width: '909px', height: '1286px', MozTransform: 'scale(1)', zIndex: 0 }} aria-label='document view before printing'></object>
        </div>

        <div className="text-container">
          <form>
          <span id="t1_1" className="t s0"><input type='text' name="documentTitle" defaultValue={data.fileData.documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} style={{ marginRight: "auto", marginLeft: "auto", width: '500px', textAlign: "center", textTransform: 'uppercase' }}/></span>
          <span id="t2_1" className="t s1">Bonjour Mr/Mme : <input type="text" name="studentFirstName" placeholder='Prénom' defaultValue={student.firstName} onChange={(e) => setStudentFirstName(e.target.value)} style={{ width: '150px' }} /><input type="text" name="studentLastName" placeholder='nom' defaultValue={student.lastName} onChange={(e) => setStudentLastName(e.target.value)} style={{ width: '250px' }} /></span>
          <span id="t3_1" className="t s1">Vous êtes convoqués pour la formation :</span>
          <span id="t4_1" className="t s2"><input type="text" name='formationTitle' defaultValue={data.formationTitle} onChange={(e) => setFormationTitle(e.target.value)} style={{ width: '450px' }} /></span>
          <span id="t5_1" className="t s2">Dates de la formation</span><span id="t6_1" className="t s1">: Début <input type="text" name='formationStartDate' defaultValue={studentFormationStartDate} onChange={(e) => setFormationStartDate(e.target.value)} style={{ width: '80px' }}
          // ${setFormationStartDay(e.target.value)}/${setFormationStartMonth(e.target.value)}/${setFormationStartYear(e.target.value)}
          />   -- Fin souhaitée : <input type="text" name='formationEndingDesiredDate' defaultValue={studentFormationEndingDesiredDate} onChange={(e) => setFormationEndingDesiredDate(e.target.value)}
          // `${setFormationEndingDesiredDay(e.target.value)}/${setFormationEndingDesiredMonth(e.target.value)}/${setFormationEndingDesiredYear}`
          style={{ width: '80px' }} /> - Maximum: <input type="text" name='formationMaxEndingDate' defaultValue={`${data.formationMaxEndingDate.day}/${data.formationMaxEndingDate.month}/${data.formationMaxEndingDate.year}`} onChange={(e) => setFormationMaxEndingDate(e.target.value)} 
          // `${setFormationMaxEndingDay(e.target.value)}/${setFormationMaxEndingMonth(e.target.value)}/${setFormationMaxEndingYear(e.target.value)}`
          style={{ width: '80px' }} />  (8 mois maxi)</span>
          
          
          <span id="th_1" className="t s2">Durée de la formation </span>
          <span id="ti_1" className="t s1">:</span>
          <span id="tj_1" className="t s1"><input type="text" name='drivingPracticeDuration' defaultValue={data.formationDuration.drivingPractice} onChange={(e) => setDrivingPracticeDuration(e.target.value)} style={{ width: '60px' }} /> H pratique + Formation code à distance Packweb
          </span>
          <span id="tk_1" className="t s1"> </span>
          <span id="tl_1" className="t s2">Objectifs Pédagogiques </span>
          <span id="tm_1" className="t s3">-Connaître la réglementation routière </span>
          <span id="tn_1" className="t s3">-Maîtriser le maniement du véhicule </span>
          <span id="to_1" className="t s3">-Appréhender la route dans des conditions Normales (Respecter les règles de circulation, adapter son allure aux </span>
          <span id="tp_1" className="t s3">situations, bien se placer (quelque soit le type de route) </span>
          <span id="tq_1" className="t s3">-Circuler dans des conditions difficiles et partager la route avec les autres usagers. </span>
          <span id="tr_1" className="t s3">-Pratiquer une conduite sûre et autonome </span>
          <span id="ts_1" className="t s3">-Sensibilisation aux enjeux environnementaux et aux usagers vulnérables. </span>
          <span id="tt_1" className="t s4">Vous Trouverez en pièces jointes </span><span id="tu_1" className="t s3">: </span>
          <span id="tv_1" className="t s3">1-le plan détaillé de la formation </span>
          <span id="tw_1" className="t s3">2-le déroulement de la formation </span>
          <span id="tx_1" className="t s3">3-le déroulement d'une séance pratique </span>
          <span id="ty_1" className="t s3">4-Le programme (Référentiel National REMC : Réferentiel Education Mobilité Citoyenne) </span>
          <span id="tz_1" className="t s4">Nos horaires d'ouverture</span><span id="t10_1" className="t s3">: </span>
          <span id="t11_1" className="t s3">Bureau et salle de code </span><span id="t12_1" className="t s3">: Lundi :17h-20h                          Cours de Conduite </span>
          <span id="t13_1" className="t s3">Du mardi au vendredi :15h-20h                                      Lundi au vendredi : 9h-20h </span>
          <span id="t14_1" className="t s3">Le samedi :10h-12h et 14h-16h                                      Samedi  : 8h-16h </span>
          <span id="t15_1" className="t s4">Mode de réservation des cours : </span>
          <span id="t16_1" className="t s4">CODE </span><span id="t17_1" className="t s4">: </span>
          <span id="t18_1" className="t m0 s5">Formation à distance </span><span id="t19_1" className="t s4">: </span><span id="t1a_1" className="t s3">un lien avec mot de passe pour la plateforme PACKWEB vous sera fourni. </span>
          <span id="t1b_1" className="t m0 s5">Formation en salle de code </span><span id="t1c_1" className="t s4">: </span>
          <span id="t1d_1" className="t s4">-</span><span id="t1e_1" className="t s3">Accès libre sans rdv aux horaires ci dessus (arrivée toujours à heure pile) </span>
          <span id="t1f_1" className="t s3">-Une séance dure environ 50 min, vous pouvez faire plusieurs séances d'affilée. </span>
          <span id="t1g_1" className="t s3">-Vous munir d'un stylo et de votre livre de code </span>
          <span id="t1h_1" className="t s4">CONDUITE </span><span id="t1i_1" className="t s3">: -Réservation par mail ou par téléphone ou directement au bureau. </span>
          <span id="t1j_1" className="t s3">-Vous munir de votre pièce d'identité, Livret d'Apprentissage et Livret d'Auto -évaluation </span>
          <span id="t1k_1" className="t s4">Services à proximité </span><span id="t1l_1" className="t s3">: </span>
          <span id="t1m_1" className="t s3">Transport: bus 120, 210, RER A arrêt Bry-sur-Marne </span>
          <span id="t1n_1" className="t s3">Restauration: </span><span id="t1o_1" className="t m0 s6">Pizzeria et restauration rapide </span>
          <span id="t1p_1" className="t s3">café, brasserie </span>
          <span id="t1q_1" className="t s3">Banques, Tabac-Presse </span>
          <span id="t1r_1" className="t s1">Auto-Ecole des Bords de Marne – 9 Grande rue Charles de Gaulle – 94360 Bry-sur-Marne </span>
          <span id="t1s_1" className="t s1">Tél: 01.49.83.93.91 Mail : </span><span id="t1t_1" className="t s7">aebdm94@gmail.com </span>
          <span id="t1u_1" className="t s1">Organisme de Formation enregistré à la DIRECCTE Île-de-France sous le numéro 11 94 056 55 94 </span>
          <span id="t1v_1" className="t s1">(cet enregistrement ne vaut pas agrément de l’État) </span>
          </form>
        </div>
      </div>
    </div>
  );
}
