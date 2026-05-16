import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { format } from "date-fns";
import { formatPhoneDisplay } from "../../utils/phoneUtils";
import { fr } from "date-fns/locale";
import {
  getStudentById,
  deleteStudent,
  updateStudent,
} from "../../api/apiClient.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateStudent from "../StudentsAdmin/UpdateStudent.jsx";
import StudentCommunication from "../StudentCom/StudentCommunication.jsx";
import SignaturePad from "../SignaturePad/SignaturePad.jsx"
import PrintContractView from "../StudentContract/PrintContractView.jsx";
import deleteFilesAfterProcessing from "../StudentContract/deleteFilesAfterProcessing.js";

const OneStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [numberOfComponent, setNumberOfComponent] = useState(1)

  const fetchStudent = async () => {
    try {
      const { data } = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étudiant :", error);
    }
  };

  // useEffect(() => {
  //   if (student && numberOfComponent === 1) {
  //     deleteFilesAfterProcessing(student.id)
  //   }
  // })
  useEffect(() => {
    if (student?.id && numberOfComponent === 1) {
      deleteFilesAfterProcessing(student.id);
    }
  }, [student?.id, numberOfComponent]);



  useEffect(() => {
    fetchStudent();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date) ? "—" : format(date, "dd/MM/yyyy", { locale: fr });
  };

  if (!student) {
    return <div>Chargement...</div>;
  }

  const deleteOneStudent = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer l'étudiant ?")) {
      try {
        await deleteStudent(id);
        toast.success("L'étudiant a été supprimé avec succès.");
        navigate("/students");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        toast.error("Erreur lors de la suppression de l'étudiant.");
      }
    }
  };

  const modifyStudent = async (updatedStudent) => {
    try {
      await updateStudent(updatedStudent);
      await fetchStudent();
      setIsEditing(false);
      toast.success("L'étudiant a été mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la modification de l'étudiant :", error);
      toast.error("Erreur lors de la modification de l'étudiant.");
    }
  };

  return (
    <>
      <Container className="my-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold text-uppercase mb-0 fs-3">
            {student.lastName} {student.firstName}
          </h2>
          <div className="d-flex gap-2">
            <Button variant="warning" onClick={() => setIsEditing(!isEditing)}>
              <FaEdit />
            </Button>
            <Button variant="danger" onClick={deleteOneStudent}>
              <FaTrash />
            </Button>
          </div>
        </div>

        <Table bordered hover responsive>
          <tbody>
            <tr className="table-secondary">
              <th colSpan={2} className="text-uppercase fs-6 py-2">
                Informations personnelles
              </th>
            </tr>
            <tr>
              <th style={{ width: '40%' }}>Nom de famille</th>
              <td>{student.lastName}</td>
            </tr>
            <tr>
              <th>Prénom</th>
              <td>{student.firstName}</td>
            </tr>
            <tr>
              <th>Adresse e-mail</th>
              <td>{student.email}</td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td>{formatPhoneDisplay(student.phoneNumber)}</td>
            </tr>
            <tr>
              <th>Date de naissance</th>
              <td>{formatDate(student.birthdate)}</td>
            </tr>
            <tr className="table-secondary">
              <th colSpan={2} className="text-uppercase fs-6 py-2">
                Formation
              </th>
            </tr>
            <tr>
              <th>Début de la formation</th>
              <td>{formatDate(student.formationStart)}</td>
            </tr>
            <tr>
              <th>Date de fin souhaitée</th>
              <td>{formatDate(student.formationDesiredEnd)}</td>
            </tr>
            <tr>
              <th>Date limite de fin</th>
              <td>{formatDate(student.formationMaxEndingDate)}</td>
            </tr>
            <tr>
              <th>Durée maximale</th>
              <td>{student.formationMaxDuration} mois</td>
            </tr>
          </tbody>
        </Table>
      </Container>

      {isEditing && (
        <Container>
          <UpdateStudent student={student} onUpdate={modifyStudent} />
        </Container>
      )}

        <Container>
          <StudentCommunication student={student} />
        </Container>



        <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '30px', marginBottom: '70px' }}>
          <h2 className="fs-4" style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>Contrat de formation</h2>
          {numberOfComponent !== 1 && (
            <Button variant="warning" style={{ maxWidth: '200px' }} onClick={() => setNumberOfComponent(1)}>Annuler la procédure</Button>
          )} 
          {numberOfComponent === 1 && (
            <SignaturePad imageName={'studentInitials'} title={"Initiales de l'étudiant"} student={student} numberOfComponent={numberOfComponent} setNumberOfComponent={setNumberOfComponent} />
          )}
          {numberOfComponent === 2 && (
            <SignaturePad imageName={'studentSignature'} title={"Signature de l'étudiant"} student={student} numberOfComponent={numberOfComponent} setNumberOfComponent={setNumberOfComponent} />
          )}
          {numberOfComponent === 3 && (
            <SignaturePad imageName={'legalRepresentSignature'} title={"Signature du représentant légal"} student={student} numberOfComponent={numberOfComponent} setNumberOfComponent={setNumberOfComponent} />
          )}
          {numberOfComponent === 4 && (
            <PrintContractView setNumberOfComponent={setNumberOfComponent} student={student} />
          )}          
        </Container>
    </>
  );
};

export default OneStudent;
