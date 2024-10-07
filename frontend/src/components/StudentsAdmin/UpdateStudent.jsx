import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, ListGroup } from "react-bootstrap";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "../../api/api-client";
import StudentCard from "../Students/StudentCard";

const UpdateStudent = () => {
  const [studentsList, setStudentsList] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [formationStart, setFormationStart] = useState("");
  const [formationDesiredEnd, setFormationDesiredEnd] = useState("");
  const [formationMaxDuration, setFormationMaxDuration] = useState("");
  const [currentId, setCurrentId] = useState(null);

  const fetchStudents = async () => {
    try {
      const students = await getAllStudents();
      console.log("Fetched students:", students.data);
      setStudentsList(students.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteOneStudent = async (id) => {
    await deleteStudent(id);
    await fetchStudents();
  };

  const modifyStudent = async (id) => {
    await updateStudent({
      id,
      lastName,
      firstName,
      email,
      phoneNumber,
      birthdate,
      formationStart,
      formationDesiredEnd,
      formationMaxDuration,
    });
    await fetchStudents();
    setCurrentId(null);
  };

  const modify = (id) => {
    setCurrentId(id);
    const student = studentsList.find((student) => student.id === id);
    setLastName(student.lastName);
    setFirstName(student.firstName);
    setPhoneNumber(student.phoneNumber);
    setEmail(student.email);
    setBirthdate(student.birthdate);
    setFormationStart(student.formationStart);
    setFormationDesiredEnd(student.formationDesiredEnd);
    setFormationMaxDuration(student.formationMaxDuration);
  };

  return (
    <>
      <Container className="my-4" style={{ marginBottom: "200px" }}>
        <h2 className="text-center">Gestion des étudiants</h2>
        <Row>
          <Col>
            <ListGroup variant="flush">
              {studentsList.map((student) => (
                <ListGroup.Item key={student.id}>
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
                  />
                  <Button
                    variant="danger"
                    onClick={() => deleteOneStudent(student.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Supprimer
                  </Button>
                  <Button variant="warning" onClick={() => modify(student.id)}>
                    Modifier
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
      {currentId && (
        <Container>
          <Form
            onSubmit={(event) => {
              event.preventDefault();
              modifyStudent(currentId);
            }}
            autoComplete="off"
          >
            <Form.Group controlId="lastName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                placeholder="Entrez le nom"
              />
            </Form.Group>

            <Form.Group controlId="firstName">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                placeholder="Entrez le prénom"
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Entrez l'email"
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="Entrez le numéro de téléphone"
              />
            </Form.Group>

            <Form.Group controlId="birthdate">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={birthdate}
                onChange={(event) => setBirthdate(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formationStart">
              <Form.Label>Date de début de formation</Form.Label>
              <Form.Control
                type="date"
                name="formationStart"
                value={formationStart}
                onChange={(event) => setFormationStart(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formationDesiredEnd">
              <Form.Label>Date de fin souhaitée</Form.Label>
              <Form.Control
                type="date"
                name="formationDesiredEnd"
                value={formationDesiredEnd}
                onChange={(event) => setFormationDesiredEnd(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formationMaxDuration">
              <Form.Label>Durée maximale de formation</Form.Label>
              <Form.Control
                type="text"
                name="formationMaxDuration"
                value={formationMaxDuration}
                onChange={(event) =>
                  setFormationMaxDuration(event.target.value)
                }
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Modifier l'étudiant
            </Button>
          </Form>
        </Container>
      )}
    </>
  );
};

export default UpdateStudent;
