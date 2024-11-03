import React from 'react';

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Cari Surah..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-4 border border-green-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 bg-white text-gray-800 placeholder-gray-400 shadow-md"
    />
  );
}

export default SearchBar;
