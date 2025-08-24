import { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";

const SearchForm = ({
  onSearch,
  students = [],
  instructors = [],
  isSearchActive,
  reloadPage,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setSuggestions([]);
      onSearch("", null);
      return;
    }

    const lowercasedValue = value.toLowerCase().trim();
    const searchTerm = lowercasedValue.slice(0, 3); // Utiliser les 3 premiers caractères pour filtrer

    // Vérifiez si les listes sont définies avant de filtrer
    const filteredStudents = Array.isArray(students)
      ? students
          .filter((student) =>
            student.lastName.toLowerCase().startsWith(searchTerm)
          )
          .map((student) => ({ ...student, type: "Étudiant" }))
      : [];

    const filteredInstructors = Array.isArray(instructors)
      ? instructors
          .filter((instructor) =>
            instructor.lastName.toLowerCase().startsWith(searchTerm)
          )
          .map((instructor) => ({ ...instructor, type: "Instructeur" }))
      : [];

    const combinedSuggestions = [...filteredStudents, ...filteredInstructors];

    setSuggestions(combinedSuggestions);
  };

  const handleSuggestionClick = (entity) => {
    if (!entity) return;
    const displayName = `${entity.lastName} ${entity.firstName} (${entity.type})`;
    setSearchValue(displayName);
    setSuggestions([]);
    onSearch(entity.lastName, entity.type);
    setSearchValue(""); // Réinitialiser le champ de recherche après sélection
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim() !== "") {
      onSearch(searchValue, null); // 'null' indique une recherche générale
      setSearchValue("");
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      event.preventDefault();
      onSearch(searchValue, null);
      setSearchValue("");
      setSuggestions([]);
    }
  };

  const handleButtonClick = () => {
    if (isSearchActive) {
      // Recharger la page si une recherche est active
      if (reloadPage) {
        reloadPage();
      }
    } else {
      // Effectuer une recherche normale
      handleSubmit(new Event("submit"));
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="d-flex">
        <Form.Control
          type="text"
          name="searchEntity"
          placeholder="Entrez le nom"
          className="me-2"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button variant="primary" type="button" onClick={handleButtonClick}>
          Rechercher
        </Button>
      </Form>

      {suggestions.length > 0 && (
        <ListGroup className="mt-2">
          {suggestions.map((entity) => (
            <ListGroup.Item
              key={`${entity.type}-${entity.id}`}
              onClick={() => handleSuggestionClick(entity)}
              style={{ cursor: "pointer" }}
            >
              {entity.lastName} {entity.firstName} ({entity.type})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default SearchForm;
