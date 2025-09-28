import { useState } from "react";

const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));

  return { page, setPage, nextPage, prevPage };
};

export default usePagination;