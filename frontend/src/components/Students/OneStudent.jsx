import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { getStudentById } from "../../api/api-client.js";
import StudentCard from "./StudentCard.jsx";
import StudentCom from "./StudentCom/StudentCom.jsx";

const OneStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState([]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await getStudentById(id);
        setStudent(data);
      } catch (error) {
        console.error("Échec de la récupération du cours:", error);
      }
    };
    fetchStudent();
  }, [id]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <StudentCard
            id={student.id}
            lastName={student.lastName}
            firstName={student.firstName}
            email={student.email}
            phoneNumber={student.phoneNumber}
            birthdate={student.birthdate}
            formationStart={student.formationStart}
            formationDesiredEnd={student.formationDesiredEnd}
            formationMaxDuration={student.formationMaxDuration}
            showMore={false}
          />
          <StudentCom
            data={student}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default OneStudent;
