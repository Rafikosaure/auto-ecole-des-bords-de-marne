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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateStudent from "../StudentsAdmin/UpdateStudent.jsx";
const OneStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudent = async () => {
    try {
      const { data } = await getStudentById(id);
      setStudent(data);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étudiant :", error);
    }
  };

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
      setIsEditing(false);
      fetchStudent();
      toast.success("L'étudiant a été mis à jour avec succès.");
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

      <ToastContainer />
    </>
  );
};

export default OneStudent;
