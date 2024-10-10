import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { updateStudent, getStudentById } from "../../api/api-client";


const UpdateStudent = ({ student, onUpdate }) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [formationStart, setFormationStart] = useState("");
  const [formationDesiredEnd, setFormationDesiredEnd] = useState("");
  const [formationMaxDuration, setFormationMaxDuration] = useState("");

  useEffect(() => {
    if (student) {
      setLastName(student.lastName || "");
      setFirstName(student.firstName || "");
      setEmail(student.email || "");
      setPhoneNumber(student.phoneNumber || "");
      setBirthdate(student.birthdate || "");
      setFormationStart(student.formationStart || "");
      setFormationDesiredEnd(student.formationDesiredEnd || "");
      setFormationMaxDuration(student.formationMaxDuration || "");
    }
  }, [student]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      await updateStudent({
        id: student.id,
        lastName,
        firstName,
        email,
        phoneNumber,
        birthdate,
        formationStart,
        formationDesiredEnd,
        formationMaxDuration,
      });

      const { data } = await getStudentById(student.id);
      onUpdate(data); 
      
    } catch (error) {
     
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <Form onSubmit={handleUpdate} autoComplete="off">
      <Form.Group controlId="lastName">
        <Form.Label>Nom</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="firstName">
        <Form.Label>Prénom</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="phoneNumber">
        <Form.Label>Numéro de téléphone</Form.Label>
        <Form.Control
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="birthdate">
        <Form.Label>Date de naissance</Form.Label>
        <Form.Control
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationStart">
        <Form.Label>Date de début de formation</Form.Label>
        <Form.Control
          type="date"
          value={formationStart}
          onChange={(e) => setFormationStart(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationDesiredEnd">
        <Form.Label>Date de fin souhaitée</Form.Label>
        <Form.Control
          type="date"
          value={formationDesiredEnd}
          onChange={(e) => setFormationDesiredEnd(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationMaxDuration">
        <Form.Label>Durée maximale de formation</Form.Label>
        <Form.Control
          type="text"
          value={formationMaxDuration}
          onChange={(e) => setFormationMaxDuration(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Modifier l'étudiant
      </Button>
    </Form>
  );
};

export default UpdateStudent;
