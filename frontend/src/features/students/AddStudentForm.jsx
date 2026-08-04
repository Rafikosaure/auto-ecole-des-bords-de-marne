import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h1 className="text-center mb-4">Ajouter un étudiant</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} autoComplete="off">
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-lastName">Nom de famille</label>
              <input
                id="add-lastName"
                type="text"
                className={`form-control${errors.lastName ? ' is-invalid' : ''}`}
                placeholder="Entrez le nom de famille"
                {...register("lastName")}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-firstName">Prénom</label>
              <input
                id="add-firstName"
                type="text"
                className={`form-control${errors.firstName ? ' is-invalid' : ''}`}
                placeholder="Entrez le prénom"
                {...register("firstName")}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-email">Email</label>
              <input
                id="add-email"
                type="email"
                className={`form-control${errors.email ? ' is-invalid' : ''}`}
                placeholder="Entrez l'email"
                {...register("email")}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-phoneNumber">Numéro de téléphone</label>
              <input
                id="add-phoneNumber"
                type="text"
                className={`form-control${errors.phoneNumber ? ' is-invalid' : ''}`}
                placeholder="Entrez le numéro de téléphone"
                value={watch("phoneNumber")}
                onChange={(e) => setValue("phoneNumber", formatPhoneDisplay(e.target.value), { shouldValidate: true })}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-birthdate">Date de naissance</label>
              <input
                id="add-birthdate"
                type="date"
                className={`form-control${errors.birthdate ? ' is-invalid' : ''}`}
                {...register("birthdate")}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-formationStart">Date de début de la formation</label>
              <input
                id="add-formationStart"
                type="date"
                className={`form-control${errors.formationStart ? ' is-invalid' : ''}`}
                {...register("formationStart")}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-formationMaxEndingDate">Date maximale de fin de formation</label>
              <input
                id="add-formationMaxEndingDate"
                type="date"
                className={`form-control${errors.formationMaxEndingDate ? ' is-invalid' : ''}`}
                {...register("formationMaxEndingDate")}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-formationMaxDuration">Durée maximale de la formation</label>
              <div className="input-group">
                <input
                  id="add-formationMaxDuration"
                  type="text"
                  className={`form-control${errors.formationMaxDuration ? ' is-invalid' : ''}`}
                  placeholder="Ex : 8"
                  {...register("formationMaxDuration")}
                />
                <span className="input-group-text">mois</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label className="form-label" htmlFor="add-formationDesiredEnd">Date de fin souhaitée de la formation</label>
              <input
                id="add-formationDesiredEnd"
                type="date"
                className={`form-control${errors.formationDesiredEnd ? ' is-invalid' : ''}`}
                {...register("formationDesiredEnd")}
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary mt-3"
            style={{ width: "200px" }}
          >
            Ajouter un étudiant
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
