import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
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
      <Card className="h-100">
        <Card.Body className="py-2 px-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0 fs-5">
              {lastName} {firstName}
            </Card.Title>
          </div>
          <Row className="g-1">
            <Col xs={12} sm={4}>
              <p className="mb-0"><strong>Début :</strong> {formatDate(formationStart)}</p>
            </Col>
            <Col xs={12} sm={4}>
              <p className="mb-0"><strong>Date limite :</strong> {formatDate(formationMaxEndingDate)}</p>
            </Col>
            <Col xs={12} sm={4}>
              <p className="mb-0"><strong>Durée max. :</strong> {formationMaxDuration} mois</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default StudentCard;
