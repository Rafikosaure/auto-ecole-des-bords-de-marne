import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, InputGroup } from "react-bootstrap";
import { studentSchema } from "./schema";
import { useUpdateStudent } from "./api";
import { formatPhoneDisplay, normalizePhone } from "../../utils/phoneUtils";

const UpdateStudent = ({ student, onUpdate }) => {
  const updateStudent = useUpdateStudent();
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

  useEffect(() => {
    if (student) {
      reset({
        lastName: student.lastName || "",
        firstName: student.firstName || "",
        email: student.email || "",
        phoneNumber: formatPhoneDisplay(student.phoneNumber || ""),
        birthdate: student.birthdate || "",
        formationStart: student.formationStart || "",
        formationDesiredEnd: student.formationDesiredEnd || "",
        formationMaxEndingDate: student.formationMaxEndingDate || "",
        formationMaxDuration: student.formationMaxDuration || "",
      });
    }
  }, [student, reset]);

  const onSubmit = async (values) => {
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        ...values,
        phoneNumber: normalizePhone(values.phoneNumber),
      });
      onUpdate?.();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Form.Group controlId="lastName" className="mb-3">
        <Form.Label>Nom de famille</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : Dupont"
          isInvalid={Boolean(errors.lastName)}
          {...register("lastName")}
        />
      </Form.Group>

      <Form.Group controlId="firstName" className="mb-3">
        <Form.Label>Prénom</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : Jean"
          isInvalid={Boolean(errors.firstName)}
          {...register("firstName")}
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Adresse e-mail</Form.Label>
        <Form.Control
          type="email"
          placeholder="jean.dupont@email.com"
          isInvalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Form.Group>

      <Form.Group controlId="phoneNumber" className="mb-3">
        <Form.Label>Numéro de téléphone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ex : 06 12 34 56 78"
          isInvalid={Boolean(errors.phoneNumber)}
          value={watch("phoneNumber")}
          onChange={(e) => setValue("phoneNumber", formatPhoneDisplay(e.target.value), { shouldValidate: true })}
        />
      </Form.Group>

      <Form.Group controlId="birthdate" className="mb-3">
        <Form.Label>Date de naissance</Form.Label>
        <Form.Control
          type="date"
          isInvalid={Boolean(errors.birthdate)}
          {...register("birthdate")}
        />
      </Form.Group>

      <Form.Group controlId="formationStart" className="mb-3">
        <Form.Label>Date de début de la formation</Form.Label>
        <Form.Control
          type="date"
          isInvalid={Boolean(errors.formationStart)}
          {...register("formationStart")}
        />
      </Form.Group>

      <Form.Group controlId="formationDesiredEnd" className="mb-3">
        <Form.Label>Date de fin souhaitée de la formation</Form.Label>
        <Form.Control
          type="date"
          isInvalid={Boolean(errors.formationDesiredEnd)}
          {...register("formationDesiredEnd")}
        />
      </Form.Group>

      <Form.Group controlId="formationMaxEndingDate" className="mb-3">
        <Form.Label>Date maximale de fin de formation</Form.Label>
        <Form.Control
          type="date"
          isInvalid={Boolean(errors.formationMaxEndingDate)}
          {...register("formationMaxEndingDate")}
        />
      </Form.Group>

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

      <Button variant="primary" type="submit" className="mt-3">
        Modifier l'étudiant
      </Button>
    </Form>
  );
};

export default UpdateStudent;
