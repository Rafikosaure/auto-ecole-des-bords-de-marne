import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import StudentCard from "./StudentCard";
import { getAllStudents } from "../../api/api-client";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await getAllStudents();
        console.log(data);
        setStudents(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, []);

  return (
    <Container className="my-4">
      <h2 className="text-center">Tous les étudiants</h2>
      <Row>
        <Col>
          <ListGroup variant="flush">
            {students.map((card) => (
              <ListGroup.Item key={card.id}>
                <StudentCard
                  id={card.id}
                  lastName={card.lastName}
                  firstName={card.firstName}
                  email={card.email}
                  phoneNumber={card.phoneNumber}
                  birthdate={card.birthdate}
                  formationStart={card.formationStart}
                  formationDesiredEnd={card.formationDesiredEnd}
                  formationMaxDuration={card.formationMaxDuration}
                  showMore={true}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Students;
