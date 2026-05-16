import { useState } from "react";
import { Form } from "react-bootstrap";

const SearchForm = ({ onSearch, onInputKeyDown }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value, null);
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Control
        type="text"
        placeholder="Entrez le nom ou le prénom"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={onInputKeyDown}
        autoComplete="off"
      />
    </Form>
  );
};

export default SearchForm;
