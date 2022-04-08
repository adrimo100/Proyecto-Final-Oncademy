import React from "react";

export const Pagination = ({ page, pages, setPage }) => {
  return (
    <nav aria-label="Navegación de páginas">
      <ul className="pagination mb-0 justify-content-center">
        <li className={"page-item " + (page == 1 && "disabled")}>
          <button className="page-link" onClick={() => setPage(page - 1)}>
            Anterior
          </button>
        </li>
        <li className="page-item">
          <span className="page-link text-dark">{page}</span>
        </li>
        <li className={"page-item " + (page == pages && "disabled")}>
          <button className="page-link" onClick={() => setPage(page + 1)}>
            Siguente
          </button>
        </li>
      </ul>
    </nav>
  );
};
