import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { studentSchema } from "./schema";
import { useAddStudent } from "./api";
import { formatPhoneDisplay, normalizePhone } from "../../utils/phoneUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TOAST_OPTIONS = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const AddStudentForm = ({ onAdded }) => {
  const addStudent = useAddStudent();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      phoneNumber: "",
      birthdate: "",
      formationStart: "",
      formationDesiredEnd: "",
      formationMaxEndingDate: "",
      formationMaxDuration: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      await addStudent.mutateAsync({ ...values, phoneNumber: normalizePhone(values.phoneNumber) });
      toast.success("Étudiant ajouté avec succès !", TOAST_OPTIONS);
      reset();
      onAdded?.();
    } catch (e) {
      console.error(e);
      toast.error("Une erreur s'est produite lors de l'ajout de l'étudiant.", TOAST_OPTIONS);
    }
  };

  const onInvalid = () => {
    toast.error("Veuillez remplir tous les champs.", TOAST_OPTIONS);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4">Ajouter un étudiant</h1>
      <Form onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
        <Row>
          <Col md={6}>
            <Form.Group controlId="lastName" className="mb-3">
              <Form.Label>Nom de famille</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de famille"
                isInvalid={Boolean(errors.lastName)}
                {...register("lastName")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="firstName" className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le prénom"
                isInvalid={Boolean(errors.firstName)}
                {...register("firstName")}
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
                placeholder="Entrez l'email"
                isInvalid={Boolean(errors.email)}
                {...register("email")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phoneNumber" className="mb-3">
              <Form.Label>Numéro de téléphone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le numéro de téléphone"
                isInvalid={Boolean(errors.phoneNumber)}
                value={watch("phoneNumber")}
                onChange={(e) => setValue("phoneNumber", formatPhoneDisplay(e.target.value), { shouldValidate: true })}
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
                isInvalid={Boolean(errors.birthdate)}
                {...register("birthdate")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formationStart" className="mb-3">
              <Form.Label>Date de début de la formation</Form.Label>
              <Form.Control
                type="date"
                isInvalid={Boolean(errors.formationStart)}
                {...register("formationStart")}
              />
            </Form.Group>
          </Col>
        </Row>

          <Row>
          <Col md={6}>
            <Form.Group controlId="formationMaxEndingDate" className="mb-3">
              <Form.Label>Date maximale de fin de formation</Form.Label>
              <Form.Control
                type="date"
                isInvalid={Boolean(errors.formationMaxEndingDate)}
                {...register("formationMaxEndingDate")}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formationMaxDuration" className="mb-3">
              <Form.Label>Durée maximale de la formation</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ex : 8"
                  isInvalid={Boolean(errors.formationMaxDuration)}
                  {...register("formationMaxDuration")}
                />
                <InputGroup.Text>mois</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
        <Row>
        <Col md={6}>
            <Form.Group controlId="formationDesiredEnd" className="mb-3">
              <Form.Label>Date de fin souhaitée de la formation</Form.Label>
              <Form.Control
                type="date"
                isInvalid={Boolean(errors.formationDesiredEnd)}
                {...register("formationDesiredEnd")}
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
    </Container>
  );
};

export default AddStudentForm;
