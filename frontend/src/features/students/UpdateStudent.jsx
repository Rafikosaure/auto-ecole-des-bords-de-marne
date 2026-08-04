import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="form-group mb-3">
        <label className="form-label" htmlFor="lastName">Nom de famille</label>
        <input
          id="lastName"
          type="text"
          className={`form-control${errors.lastName ? ' is-invalid' : ''}`}
          placeholder="Ex : Dupont"
          {...register("lastName")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="firstName">Prénom</label>
        <input
          id="firstName"
          type="text"
          className={`form-control${errors.firstName ? ' is-invalid' : ''}`}
          placeholder="Ex : Jean"
          {...register("firstName")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          type="email"
          className={`form-control${errors.email ? ' is-invalid' : ''}`}
          placeholder="jean.dupont@email.com"
          {...register("email")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="phoneNumber">Numéro de téléphone</label>
        <input
          id="phoneNumber"
          type="text"
          className={`form-control${errors.phoneNumber ? ' is-invalid' : ''}`}
          placeholder="Ex : 06 12 34 56 78"
          value={watch("phoneNumber")}
          onChange={(e) => setValue("phoneNumber", formatPhoneDisplay(e.target.value), { shouldValidate: true })}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="birthdate">Date de naissance</label>
        <input
          id="birthdate"
          type="date"
          className={`form-control${errors.birthdate ? ' is-invalid' : ''}`}
          {...register("birthdate")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="formationStart">Date de début de la formation</label>
        <input
          id="formationStart"
          type="date"
          className={`form-control${errors.formationStart ? ' is-invalid' : ''}`}
          {...register("formationStart")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="formationDesiredEnd">Date de fin souhaitée de la formation</label>
        <input
          id="formationDesiredEnd"
          type="date"
          className={`form-control${errors.formationDesiredEnd ? ' is-invalid' : ''}`}
          {...register("formationDesiredEnd")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="formationMaxEndingDate">Date maximale de fin de formation</label>
        <input
          id="formationMaxEndingDate"
          type="date"
          className={`form-control${errors.formationMaxEndingDate ? ' is-invalid' : ''}`}
          {...register("formationMaxEndingDate")}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label" htmlFor="formationMaxDuration">Durée maximale de la formation</label>
        <div className="input-group">
          <input
            id="formationMaxDuration"
            type="text"
            className={`form-control${errors.formationMaxDuration ? ' is-invalid' : ''}`}
            placeholder="Ex : 8"
            {...register("formationMaxDuration")}
          />
          <span className="input-group-text">mois</span>
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-3">
        Modifier l'étudiant
      </button>
    </form>
  );
};

export default UpdateStudent;
