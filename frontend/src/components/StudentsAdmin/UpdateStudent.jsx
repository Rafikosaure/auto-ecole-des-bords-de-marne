import { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { updateStudent, getStudentById } from "../../api/apiClient";
import { formatPhoneDisplay, normalizePhone } from "../../utils/phoneUtils";


const UpdateStudent = ({ student, onUpdate }) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [formationStart, setFormationStart] = useState("");
  const [formationDesiredEnd, setFormationDesiredEnd] = useState("");
  const [formationMaxEndingDate, setFormationMaxEndingDate] = useState("");
  const [formationMaxDuration, setFormationMaxDuration] = useState("");

  useEffect(() => {
    if (student) {
      setLastName(student.lastName || "");
      setFirstName(student.firstName || "");
      setEmail(student.email || "");
      setPhoneNumber(formatPhoneDisplay(student.phoneNumber || ""));
      setBirthdate(student.birthdate || "");
      setFormationStart(student.formationStart || "");
      setFormationDesiredEnd(student.formationDesiredEnd || "");
      setFormationMaxEndingDate(student.formationMaxEndingDate || "");
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
        phoneNumber: normalizePhone(phoneNumber),
        birthdate,
        formationStart,
        formationDesiredEnd,
        formationMaxEndingDate,
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
      <Form.Group controlId="lastName" className="mb-3">
        <Form.Label>Nom de famille</Form.Label>
        <Form.Control
          type="text"
          value={lastName}
          placeholder="Ex : Dupont"
          onChange={(e) => setLastName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="firstName" className="mb-3">
        <Form.Label>Prénom</Form.Label>
        <Form.Control
          type="text"
          value={firstName}
          placeholder="Ex : Jean"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Adresse e-mail</Form.Label>
        <Form.Control
          type="email"
          value={email}
          placeholder="jean.dupont@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="phoneNumber" className="mb-3">
        <Form.Label>Numéro de téléphone</Form.Label>
        <Form.Control
          type="text"
          value={phoneNumber}
          placeholder="Ex : 06 12 34 56 78"
          onChange={(e) => setPhoneNumber(formatPhoneDisplay(e.target.value))}
        />
      </Form.Group>

      <Form.Group controlId="birthdate" className="mb-3">
        <Form.Label>Date de naissance</Form.Label>
        <Form.Control
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationStart" className="mb-3">
        <Form.Label>Date de début de la formation</Form.Label>
        <Form.Control
          type="date"
          value={formationStart}
          onChange={(e) => setFormationStart(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationDesiredEnd" className="mb-3">
        <Form.Label>Date de fin souhaitée de la formation</Form.Label>
        <Form.Control
          type="date"
          value={formationDesiredEnd}
          onChange={(e) => setFormationDesiredEnd(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationMaxEndingDate" className="mb-3">
        <Form.Label>Date maximale de fin de formation</Form.Label>
        <Form.Control
          type="date"
          value={formationMaxEndingDate}
          onChange={(e) => setFormationMaxEndingDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formationMaxDuration" className="mb-3">
        <Form.Label>Durée maximale de la formation</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            value={formationMaxDuration}
            placeholder="Ex : 8"
            onChange={(e) => setFormationMaxDuration(e.target.value)}
          />
          <InputGroup.Text>mois</InputGroup.Text>
        </InputGroup>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Modifier l'étudiant
      </Button>
    </Form>
  );
};

export default UpdateStudent;
