import React, { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";

const SearchForm = ({ onSearch, students }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setSuggestions([]);
      onSearch("");
      return;
    }

    const filteredSuggestions = students.filter((student) =>
      student.lastName.toLowerCase().startsWith(value.toLowerCase().slice(0, 3))
    );

    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (lastName) => {
    setSearchValue(lastName); 
    setSuggestions([]); 
    onSearch(lastName); 
    setSearchValue(""); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim() !== "") {
      
      onSearch(searchValue); 
      setSearchValue(""); 
      setSuggestions([]); 
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      event.preventDefault();
      onSearch(searchValue); 
      setSearchValue(""); 
      setSuggestions([]); 
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="d-flex">
        <Form.Control
          type="text"
          name="searchStudent"
          placeholder="Entrez le nom"
          className="me-2"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown} 
        />
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>

      {suggestions.length > 0 && (
        <ListGroup className="mt-2">
          {suggestions.map((student) => (
            <ListGroup.Item
              key={student.id}
              onClick={() => handleSuggestionClick(student.lastName)}
              style={{ cursor: "pointer" }}
            >
              {student.lastName}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default SearchForm;
