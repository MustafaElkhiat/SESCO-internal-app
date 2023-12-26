import React from 'react';

const ContractorFilters = ({ onFilterChange }) => {
  const handleFilterChange = (filterKey, e) => {
    const filterValue = e.target.value;
    onFilterChange(filterKey, filterValue);
    console.log(filterValue)
  };

  return (
    <div className="px-4 md:px-20 lg:px-32 space-y-0 flex items-center justify-center gap-8 flex-col md:flex-row">
      <input
        className="px-2 py-1 border shadow-md border-gray-300 rounded-xl  outline-none focus:shadow-xl focus:rounded-xl focus:scale-105 transition-all duration-300 text-muted-foreground"
        type="text"
        onChange={(e) => handleFilterChange('name', e)}
        placeholder="Contractor Name"
      />

      <input
        className="px-2 py-1 border shadow-md border-gray-300 rounded-xl  outline-none focus:shadow-xl focus:rounded-xl focus:scale-105 transition-all duration-300 text-muted-foreground"
        type="number"
        onChange={(e) => handleFilterChange('code', e)}
        placeholder="Contractor code"
      />

    </div>
  );
};

export default ContractorFilters;