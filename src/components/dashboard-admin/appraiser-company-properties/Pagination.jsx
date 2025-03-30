import React, { useState } from "react";

const Pagination = ({ setStart, setEnd, properties }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const propertiesPerPage = 5;

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(properties.length / propertiesPerPage); i++) {
    pageNumbers.push(i);
  }

  const updateDisplayedProperties = (page) => {
    const indexOfLastProperty = page * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    setStart(indexOfFirstProperty);
    setEnd(indexOfLastProperty);
    // console.log(indexOfLastProperty,indexOfFirstProperty);
    // const currentProperties = properties.slice(indexOfFirstProperty-1, indexOfLastProperty-1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateDisplayedProperties(pageNumber);
  };

  return (
    <div>
      {properties.length >= propertiesPerPage ? (
        <ul className="page_navigation">
          {/* Previous page button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              tabIndex="-1"
              aria-disabled={currentPage === 1 ? true : false}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="flaticon-left-arrow"></span>
            </a>
          </li>

          {/* Page numbers */}
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${currentPage === number ? "active" : ""}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={() => handlePageChange(number)}
              >
                {number}
                {currentPage === number && (
                  <span className="sr-only">(current)</span>
                )}
              </a>
            </li>
          ))}

          {/* Next page button */}
          <li
            className={`page-item ${
              currentPage === pageNumbers.length ? "disabled" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="flaticon-right-arrow"></span>
            </a>
          </li>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default Pagination;
