import React, { useState } from "react";
import { addStudent } from "../../api/api-client";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStudentForm = () => {
  const [student, setStudent] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
    birthdate: "",
    formationStart: "",
    formationDesiredEnd: "",
    formationMaxDuration: "",
  });

  const notifyError = () =>
    toast.error("Veuillez remplir tous les champs.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const notify = () =>
    toast.error("Une erreur s'est produite lors de l'ajout de l'étudiant.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const confirmation = () =>
    toast.success("Étudiant ajouté avec succès !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !student.lastName ||
      !student.firstName ||
      !student.email ||
      !student.phoneNumber ||
      !student.birthdate ||
      !student.formationStart ||
      !student.formationDesiredEnd ||
      !student.formationMaxDuration
    ) {
      notifyError(); 
      return;
    }

    try {
      const response = await addStudent(student);
      console.log(response);
      confirmation();
    } catch (e) {
      console.log(e);
      notify();
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4">Ajouter un étudiant</h1>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Row>
          <Col md={6}>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Nom de famille</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                placeholder="Entrez le nom de famille"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={student.firstName}
                onChange={handleChange}
                placeholder="Entrez le prénom"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                placeholder="Entrez l'email"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
                placeholder="Entrez le numéro de téléphone"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="birthdate" className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={student.birthdate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formationStart" className="mb-3">
              <Form.Label>Date de début de la formation</Form.Label>
              <Form.Control
                type="date"
                name="formationStart"
                value={student.formationStart}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="formationDesiredEnd" className="mb-3">
              <Form.Label>Date de fin souhaitée de la formation</Form.Label>
              <Form.Control
                type="date"
                name="formationDesiredEnd"
                value={student.formationDesiredEnd}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formationMaxDuration" className="mb-3">
              <Form.Label>Durée maximale de la formation</Form.Label>
              <Form.Control
                type="text"
                name="formationMaxDuration"
                value={student.formationMaxDuration}
                onChange={handleChange}
                placeholder="Entrez la durée maximale"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-center">
          <Button
            variant="primary"
            type="submit"
            className="mt-3"
            style={{ width: "200px" }}
          >
            Ajouter un étudiant
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddStudentForm;
