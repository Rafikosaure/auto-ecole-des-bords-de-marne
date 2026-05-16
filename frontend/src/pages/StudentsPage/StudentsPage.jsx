import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentsPage.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import StudentCard from "../../components/Students/StudentCard";
import { getAllStudents, getStudents } from "../../api/apiClient";
import SearchForm from "../../components/SearchForm/SearchForm";
import AddStudentForm from "../../components/StudentsAdmin/AddStudentForm";

const StudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(-1);
  const studentsPerPage = 3;
  const listTopRef = useRef(null);

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchStudents = async (page) => {
    try {
      const { data } = await getAllStudents(page, studentsPerPage);
      if (Array.isArray(data.students)) {
        setStudents(data.students);
        setFilteredStudents(data.students);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des étudiants:", error);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const { data } = await getStudents();
      if (Array.isArray(data)) {
        setAllStudents(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de tous les étudiants:", error);
    }
  };

  const handleSearch = (query) => {
    const trimmed = query ? query.trim() : '';

    if (!trimmed) {
      setFilteredStudents(students);
      setIsSearchActive(false);
      return;
    }

    const lowerTrimmed = trimmed.toLowerCase();

    const filtered = allStudents.filter((student) => {
      const fullName = `${student.lastName} ${student.firstName}`.toLowerCase();
      const reverseName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.startsWith(lowerTrimmed) || reverseName.startsWith(lowerTrimmed);
    });

    if (filtered.length === 0) {
      setFilteredStudents(students);
      setIsSearchActive(false);
    } else {
      setFilteredStudents(filtered);
      setIsSearchActive(true);
    }
  };

  useEffect(() => {
    setHighlightedCardIndex(-1);
  }, [filteredStudents]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredStudents.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedCardIndex((prev) =>
          prev < filteredStudents.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedCardIndex((prev) =>
          prev > 0 ? prev - 1 : filteredStudents.length - 1
        );
      } else if (e.key === 'Enter' && highlightedCardIndex >= 0) {
        if (document.activeElement?.tagName === 'INPUT') return;
        navigate(`/student/${filteredStudents[highlightedCardIndex].id}`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredStudents, highlightedCardIndex, navigate]);

  const handleCardKeyDown = (e) => {
    if (filteredStudents.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedCardIndex((prev) =>
        prev < filteredStudents.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedCardIndex((prev) =>
        prev > 0 ? prev - 1 : filteredStudents.length - 1
      );
    } else if (e.key === 'Enter' && highlightedCardIndex >= 0) {
      e.preventDefault();
      navigate(`/student/${filteredStudents[highlightedCardIndex].id}`);
    }
  };

  const reloadPage = () => {
    setFilteredStudents(students);
    setIsSearchActive(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsSearchActive(false);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const reloadAfterAdd = async (page) => {
    await fetchStudents(page || currentPage);
    await fetchAllStudents();
  };

  return (
    <Container className="my-4">
      <div ref={listTopRef} style={{ scrollMarginTop: '80px' }}>
        <SearchForm
          onSearch={handleSearch}
          onInputKeyDown={handleCardKeyDown}
        />
      </div>
      <h2 className="text-center fw-bold text-uppercase fs-2 my-4">Tous les étudiants</h2>

      {!isSearchActive && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <div className="d-flex justify-content-center" style={{ width: '70px' }}>
            {currentPage > 1 && (
              <Button
                variant="link"
                onClick={() => handlePageChange(currentPage - 1)}
                className="text-decoration-none px-3 py-2"
                style={{ fontSize: '2rem', lineHeight: 1 }}
              >
                ←
              </Button>
            )}
          </div>
          <span className="fs-5 mx-3">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="d-flex justify-content-center" style={{ width: '70px' }}>
            {currentPage < totalPages && (
              <Button
                variant="link"
                onClick={() => handlePageChange(currentPage + 1)}
                className="text-decoration-none px-3 py-2"
                style={{ fontSize: '2rem', lineHeight: 1 }}
              >
                →
              </Button>
            )}
          </div>
        </div>
      )}

      <Row className="students-list-min-height">
        <Col>
          <div>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <StudentCard
                  key={student.id}
                  id={student.id}
                  lastName={student.lastName}
                  firstName={student.firstName}
                  formationStart={student.formationStart}
                  formationMaxEndingDate={student.formationMaxEndingDate}
                  formationMaxDuration={student.formationMaxDuration}
                  isActive={index === highlightedCardIndex}
                />
              ))
            ) : (
              <p className="text-center">Aucun étudiant trouvé</p>
            )}
          </div>
        </Col>
      </Row>

      <AddStudentForm reload={reloadAfterAdd} />
    </Container>
  );
};

export default StudentsPage;
