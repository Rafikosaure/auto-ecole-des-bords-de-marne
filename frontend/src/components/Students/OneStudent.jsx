import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Button, Col } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  getStudentById,
  deleteStudent,
  updateStudent,
} from "../../api/api-client.js";
import StudentCard from "./StudentCard.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateStudent from "../StudentsAdmin/UpdateStudent.jsx";
import StudentCom from "../StudentCom/StudentCom.jsx";
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
        <Row>
          <Col>
            <StudentCard
              id={student.id}
              lastName={student.lastName}
              firstName={student.firstName}
              email={student.email}
              phoneNumber={student.phoneNumber}
              birthdate={student.birthdate}
              formationStart={student.formationStart}
              formationDesiredEnd={student.formationDesiredEnd}
              formationMaxEndingDate={student.formationMaxEndingDate}
              formationMaxDuration={student.formationMaxDuration}
              showMore={false}
            />
            <Button
              variant="danger"
              onClick={deleteOneStudent}
              style={{ marginRight: "10px" }}
            >
              <FaTrash />
            </Button>
            <Button variant="warning" onClick={() => setIsEditing(true)}>
              <FaEdit />
            </Button>
          </Col>
        </Row>
      </Container>

      {isEditing && (
        <Container>
          <UpdateStudent student={student} onUpdate={modifyStudent} />
        </Container>
      )}

        <Container>
          <StudentCom student={student} />
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
