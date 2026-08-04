import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import "./StudentsPage.css";
import StudentCard from "./StudentCard";
import { useStudents, useAllStudents } from "./api";
import SearchForm from "../../components/SearchForm/SearchForm";
import AddStudentForm from "./AddStudentForm";

const StudentsPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [highlightedCardIndex, setHighlightedCardIndex] = useState(-1);
  const studentsPerPage = 3;
  const listTopRef = useRef(null);

  const { data: pageData } = useStudents(currentPage, studentsPerPage);
  const { data: allStudents = [] } = useAllStudents();

  const students = useMemo(() => pageData?.students ?? [], [pageData]);
  const totalPages = pageData?.totalPages ?? 0;
  const displayedStudents = isSearchActive ? filteredStudents : students;

  // Réinitialise l'index surligné dès que la liste affichée change, sans
  // passer par un Effect (cf. https://react.dev/learn/you-might-not-need-an-effect
  // -> "Adjusting some state when a prop changes").
  const [prevDisplayedStudents, setPrevDisplayedStudents] = useState(displayedStudents);
  if (displayedStudents !== prevDisplayedStudents) {
    setPrevDisplayedStudents(displayedStudents);
    setHighlightedCardIndex(-1);
  }

  const handleSearch = (query) => {
    const trimmed = query ? query.trim() : '';

    if (!trimmed) {
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
      setIsSearchActive(false);
    } else {
      setFilteredStudents(filtered);
      setIsSearchActive(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (displayedStudents.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedCardIndex((prev) =>
          prev < displayedStudents.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedCardIndex((prev) =>
          prev > 0 ? prev - 1 : displayedStudents.length - 1
        );
      } else if (e.key === 'Enter' && highlightedCardIndex >= 0) {
        if (document.activeElement?.tagName === 'INPUT') return;
        navigate(`/student/${displayedStudents[highlightedCardIndex].id}`);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [displayedStudents, highlightedCardIndex, navigate]);

  const handleCardKeyDown = (e) => {
    if (displayedStudents.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedCardIndex((prev) =>
        prev < displayedStudents.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setHighlightedCardIndex((prev) =>
        prev > 0 ? prev - 1 : displayedStudents.length - 1
      );
    } else if (e.key === 'Enter' && highlightedCardIndex >= 0) {
      e.preventDefault();
      navigate(`/student/${displayedStudents[highlightedCardIndex].id}`);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setIsSearchActive(false);
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container my-4">
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
              <button
                type="button"
                className="btn btn-link text-decoration-none px-3 py-2"
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ fontSize: '2rem', lineHeight: 1 }}
              >
                ←
              </button>
            )}
          </div>
          <span className="fs-5 mx-3">
            Page {currentPage} sur {totalPages}
          </span>
          <div className="d-flex justify-content-center" style={{ width: '70px' }}>
            {currentPage < totalPages && (
              <button
                type="button"
                className="btn btn-link text-decoration-none px-3 py-2"
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ fontSize: '2rem', lineHeight: 1 }}
              >
                →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="row students-list-min-height">
        <div className="col">
          <div>
            {displayedStudents.length > 0 ? (
              displayedStudents.map((student, index) => (
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
        </div>
      </div>

      <AddStudentForm onAdded={() => setCurrentPage(1)} />
    </div>
  );
};

export default StudentsPage;
