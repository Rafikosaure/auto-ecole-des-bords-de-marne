import { Link } from "react-router";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "./StudentCard.css";

const StudentCard = ({
  id,
  lastName,
  firstName,
  formationStart,
  formationMaxEndingDate,
  formationMaxDuration,
  isActive,
}) => {

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? "N/A" : format(date, "dd/MM/yyyy", { locale: fr });
  };

  return (
    <Link
      to={`/student/${id}`}
      className={`d-block text-decoration-none text-reset mb-2 student-card${isActive ? ' student-card-active' : ''}`}
    >
      <div className="card h-100">
        <div className="card-body py-2 px-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0 fs-5">
              {lastName} {firstName}
            </h5>
          </div>
          <div className="row g-1">
            <div className="col-12 col-sm-4">
              <p className="mb-0"><strong>Début :</strong> {formatDate(formationStart)}</p>
            </div>
            <div className="col-12 col-sm-4">
              <p className="mb-0"><strong>Date limite :</strong> {formatDate(formationMaxEndingDate)}</p>
            </div>
            <div className="col-12 col-sm-4">
              <p className="mb-0"><strong>Durée max. :</strong> {formationMaxDuration} mois</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudentCard;
