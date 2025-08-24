import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; 

const StudentCard = ({
  id,
  lastName,
  firstName,
  email,
  phoneNumber,
  birthdate,
  formationStart,
  formationDesiredEnd,
  formationMaxEndingDate,
  formationMaxDuration,
  showMore,
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? "N/A" : format(date, "dd/MM/yyyy", { locale: fr });
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>
          {lastName} {firstName}
        </Card.Title>
        <Row>
          <Col md={6}>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Téléphone:</strong> {phoneNumber}
            </p>
          </Col>
          <Col md={6}>
            <p>
              <strong>Date de naissance:</strong> {formatDate(birthdate)}
            </p>
            <p>
              <strong>Début de la formation:</strong>{" "}
              {formatDate(formationStart)}
            </p>
            <p>
              <strong>Date de fin souhaitée:</strong>{" "}
              {formatDate(formationDesiredEnd)}
            </p>
            <p>
              <strong>Date limite de fin de formation:</strong>{" "}
              {formatDate(formationMaxEndingDate)}
            </p>
            <p>
              <strong>Durée maximale de la formation:</strong>{" "}
              {formationMaxDuration}
            </p>
            {showMore && <Link to={`/student/${id}`}>Voir plus</Link>}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StudentCard;
