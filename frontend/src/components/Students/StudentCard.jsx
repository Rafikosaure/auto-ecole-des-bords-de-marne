import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

const StudentCard = ({
  id,
  lastName,
  firstName,
  email,
  phoneNumber,
  birthdate,
  formationStart,
  formationDesiredEnd,
  formationMaxDuration,
  showMore
}) => {
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
              <strong>Date de naissance:</strong> {birthdate}
            </p>
            <p>
              <strong>Début de la formation:</strong> {formationStart}
            </p>
            <p>
              <strong>Date de fin souhaitée:</strong> {formationDesiredEnd}
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
