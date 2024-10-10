import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import StudentCard from "./StudentCard";
import { getAllStudents } from "../../api/api-client";
import SearchForm from "../SerchForm/SerchForm";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async (page) => {
      console.log(`Fetching students for page: ${page}`); 
      try {
        const { data } = await getAllStudents(page, studentsPerPage);
        console.log("Data received from API:", data);
        if (Array.isArray(data.students)) {
          setStudents(data.students);
          setFilteredStudents(data.students); 
          setTotalPages(data.totalPages);
        } else {
          console.log("Data received is not an array:", data.students);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStudents(currentPage);
  }, [currentPage]); 

  const handleSearch = (query) => {
    if (query) {
      const filtered = students.filter((student) =>
        student.lastName.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); 
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container className="my-4">
      <SearchForm onSearch={handleSearch} students={students} />
      <h2 className="text-center">Tous les étudiants</h2>
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
      
      <div className="d-flex justify-content-center align-items-center my-3">
        <Button
          variant="link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-decoration-none"
        >
          ←
        </Button>
        <span className="mx-3">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          variant="link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-decoration-none"
        >
          →
        </Button>
      </div>
    </Container>
  );
};

export default Students;
