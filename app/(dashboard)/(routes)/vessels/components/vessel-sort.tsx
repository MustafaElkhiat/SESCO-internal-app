import React from 'react';

const SortOptions = ({ sortOption, onSortChange }) => {
    const handleSortChange = (e) => {
      const sortValue = e.target.value;
      onSortChange(sortValue);
    };
  
    return (
      <select
        className="px-2 py-1 border border-gray-300 rounded-3xl h-9 mr-2 shadow-md cursor-pointer"
        value={sortOption}
        onChange={handleSortChange}
      >
        <option value="" hidden>Sort By</option>
        <option value="name">name</option>
        <option value="IMO">IMO</option>
        <option value="tonnage">tonnage</option>
      </select>
    );
  };
  
  export default SortOptions;