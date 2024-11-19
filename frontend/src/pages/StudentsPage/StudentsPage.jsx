import { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import StudentCard from "../../components/Students/StudentCard";
import { getAllStudents } from "../../api/api-client";
import SearchForm from "../../components/SearchForm/SearchForm";
import AddStudentForm from "../../components/StudentsAdmin/AddStudentForm";
import SignaturePad from "../../components/Signature/Signature";

const StudentsPage = () => {
  const [students, setStudents] = useState([]); 
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 
  const studentsPerPage = 10;

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page) => {
    try {
      const { data } = await getAllStudents(page, studentsPerPage);
      if (Array.isArray(data.students)) {
        setStudents(data.students);
        setFilteredStudents(data.students); 
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Ошибка при загрузке студентов:", error);
    }
  };

  const handleSearch = (query, type) => {
    if (query) {
      const filtered = students.filter((student) =>
        student.lastName.toLowerCase().startsWith(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); 
    }
  };

  const reloadPage = () => {
    setFilteredStudents(students); 
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Container className="my-4">
      <SearchForm
        onSearch={handleSearch}
        students={students}
        isSearchActive={filteredStudents.length !== students.length}
        reloadPage={reloadPage}
      />
      <h2 className="text-center">Tous les étudiants</h2>
      <Row>
        <Col>
          <ListGroup variant="flush">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <ListGroup.Item key={student.id}>
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

      <AddStudentForm reload={fetchStudents} />
      <SignaturePad></SignaturePad>
    </Container>
  );
};

export default StudentsPage;
