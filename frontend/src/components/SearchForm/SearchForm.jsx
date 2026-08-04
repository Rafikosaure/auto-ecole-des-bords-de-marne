import { useState } from "react";

const SearchForm = ({ onSearch, onInputKeyDown }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearch(value, null);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        className="form-control"
        placeholder="Entrez le nom ou le prénom"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={onInputKeyDown}
        autoComplete="off"
      />
    </form>
  );
};

export default SearchForm;
