import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import StudentCard from "./StudentCard";
import { getAllStudents } from "../../api/api-client";
import SearchForm from "../SerchForm/SerchForm";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await getAllStudents();
        console.log(data);
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, []);

  const handleSearch = (query) => {
    const filtered = students.filter((student) =>
      student.lastName.toLowerCase().startsWith(query.toLowerCase().slice(0, 3))
    );
    setFilteredStudents(filtered);
  };

  return (
    <Container className="my-4">
      <h2 className="text-center">Tous les étudiants</h2>
      <SearchForm onSearch={handleSearch} students={students} />
      <Row>
        <Col>
          <ListGroup variant="flush">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((card) => (
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
              ))
            ) : (
              <p className="text-center">Aucun étudiant trouvé</p>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Students;
