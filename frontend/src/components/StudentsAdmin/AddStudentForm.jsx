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

  // Уведомление об ошибке
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

  // Уведомление об успешном добавлении
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

    try {
      const response = await addStudent(student);
      console.log(response);
      confirmation(); // Отображение успешного уведомления
    } catch (e) {
      console.log(e);
      notify(); // Отображение уведомления об ошибке
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4">Ajouter un étudiant</h1>
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Row>
          <Col md={6}>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={student.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={student.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
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
                placeholder="Enter email"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="birthdate" className="mb-3">
              <Form.Label>Birthdate</Form.Label>
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
              <Form.Label>Formation Start</Form.Label>
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
              <Form.Label>Formation Desired End</Form.Label>
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
              <Form.Label>Formation Max Duration</Form.Label>
              <Form.Control
                type="text"
                name="formationMaxDuration"
                value={student.formationMaxDuration}
                onChange={handleChange}
                placeholder="Enter max duration"
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

      {/* Добавляем ToastContainer для отображения уведомлений */}
      <ToastContainer />
    </Container>
  );
};

export default AddStudentForm;
