import React from "react";

const PaginationControls = ({ page, prevPage, nextPage, isFirstPage, className }) => (
  <div className={`flex justify-between mt-4 items-center ${className || ""}`}>
    <button
      className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
      onClick={prevPage}
      disabled={isFirstPage}
      aria-label="Previous page"
    >
      Previous
    </button>
    <span className="text-gray-600 text-sm">Page {page}</span>
    <button
      className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300"
      onClick={nextPage}
      aria-label="Next page"
    >
      Next
    </button>
  </div>
);

export default PaginationControls;