import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange, placeholder = "Search...", className }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange}
      />
      <MagnifyingGlassIcon className="absolute left-2.5 top-3 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;